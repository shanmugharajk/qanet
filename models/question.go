package models

import (
	"strconv"
	"strings"
	"time"

	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

const ERROR_IN_FETCHING = "Error in fetching the details"

const INVALID_POST_ID = "Invalid post id"

const POST_INACTIVE = "Inactive post"

const POST_CLOSED = "Closed post"

// Question is the model for questions table.
type Question struct {
	ID                int64     `json:"id"`
	Title             string    `json:"title"`
	TitleSearch       string    `json:"-" gorm:"type:tsvector;column:title_search"`
	QuestionContent   string    `json:"questionContent"`
	Bookmarks         int       `json:"bookmarks"`
	Votes             int       `json:"votes"`
	CloseVotes        int       `json:"closeVotes"`
	BountyPoints      int       `json:"bountyPoints"`
	BountyExpiryDate  time.Time `json:"bountyExpiryDate"`
	IsActive          bool      `json:"isActive"`
	IsClosed          bool      `json:"isClosed"`
	IsReopenRequested bool      `json:"isReopenRequested"`
	DeactivatedBy     string    `json:"deactivated_by" gorm:"default:'NULL'" sql:"default:null"`
	CreatedBy         string    `json:"createdBy"`
	UpdatedBy         string    `json:"updatedBy"`

	Base

	// Association
	QuestionComments []QuestionComment `json:"comments"`
	QuestionTags     []Tag             `json:"questionTags" gorm:"many2many:question_tags"`

	// Dto purpose.
	Tags              string    `json:"tags" gorm:"-"`
	HasMoreComments   bool      `json:"hasMoreComments" gorm:"-"`
	AskedAt           time.Time `json:"askedAt" gorm:"-"`
	AuthorPoints      int       `json:"authorPoints" gorm:"-"`
	HasAcceptedAnswer bool      `json:"hasAcceptedAnswer" gorm:"-"`
	TotalAnswers      int       `json:"totalAnswers" gorm:"-"`
	TotalBookmarks    int       `json:"totalBookmarks" gorm:"-"`
	SelfVote          int       `json:"selfVote" gorm:"-"`
	SelfBookmarked    bool      `json:"selfBookmarked" gorm:"-"`
}

// Validate - validates the question details.
func (q *Question) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: q.Title, Name: "Title"},
		&validators.StringIsPresent{Field: q.QuestionContent, Name: "QuestionContent"},
		&validators.StringIsPresent{Field: q.Tags, Name: "Tags"},
	)
}

// Post interface implemenation
func (q *Question) PostId() int64 {
	return q.ID
}

func (q *Question) QuestionId() int64 {
	return q.ID
}

func (q *Question) TotalVote() int {
	return q.Votes
}

func (q *Question) Author() string {
	return q.CreatedBy
}

func (q *Question) StrID() string {
	return strconv.FormatInt(q.ID, 10)
}

func (q *Question) StrUpdatedAt() string {
	return strings.Replace(q.UpdatedAt.String(), " +0000 +0000", "", 1)
}

func (q *Question) UpdateVoteById(tx *gorm.DB, points int) error {
	db := tx.Model(Question{}).
		Where("id = ?", q.ID).
		UpdateColumn("votes", gorm.Expr("votes + ?", points))

	return db.Error
}

// Actions
func AddQuestion(tx *gorm.DB, q *Question) (*validate.Errors, error) {
	verrs := q.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	q.IsActive = true
	q.IsClosed = false

	if db := tx.Create(q); db.Error != nil {
		return validate.NewErrors(), db.Error
	}

	for _, tag := range strings.Split(q.Tags, ",") {
		questionTag := QuestionTag{}
		questionTag.QuestionID = q.ID
		questionTag.TagID = tag

		if db := tx.Create(&questionTag); db.Error != nil {
			return validate.NewErrors(), db.Error
		}
	}

	return validate.NewErrors(), nil
}

func GetQuestionDetails(tx *gorm.DB, userID interface{}, id int64) (*Question, error) {
	question := new(Question)
	db := tx.
		Preload("QuestionComments").
		Preload("QuestionTags").
		Where("id = ?", id).
		Select(`*,
			(select case
				when count(id) > 5
					then 1
					else 0
				end from question_comments
				where question_id = questions.id) as has_more_comments,
			(select case
				when count(id) > 0
					then 1
					else 0
				end from answers
				where question_id = questions.id AND is_accepted = true) as has_accepted_answer,
			created_at as asked_at,
			(select points from users where id = questions.created_by) as author_points,
			(select vote from votes where post_id = questions.id AND voter_id = ? AND post_type = 1) as self_vote,
			(select case
				when count(question_id) > 0
					then 1 else 0
				end from bookmarks
				where question_id = questions.id AND user_id = ?) as self_bookmarked,
			(select count(question_id) from bookmarks where question_id = questions.id) as total_bookmarks
		`, userID, userID).
		First(&question)
	return question, db.Error
}

func GetActiveNonClosedQuestionById(tx *gorm.DB, id int64, postType PostType) (Post, error) {
	question := []Question{}

	if err := GetById(tx, id, &question); err != nil {
		return nil, errors.New(ERROR_IN_FETCHING)
	}

	if len(question) == 0 {
		return nil, errors.New(INVALID_POST_ID)
	}

	if !question[0].IsActive {
		return nil, errors.New(POST_INACTIVE)
	}

	if question[0].IsClosed {
		return nil, errors.New(POST_CLOSED)
	}

	return &question[0], nil
}

func GetQuestions(tx *gorm.DB, id string, timestamp string) (*Pagination, error) {
	q := make([]*Question, 0, 20)

	db := getQuestionsListQuery(tx)

	if len(id) != 0 && len(timestamp) != 0 {
		db = db.Where("id < ? AND updated_at < ?", id, timestamp)
	}

	params := new(PaginationParam)
	params.Query = db
	params.Result = &q
	params.Offset = false

	paginatedResults, err := Paginate(params)
	if err != nil {
		return nil, err
	}

	if len(q) > 0 {
		paginatedResults.Cursor = q[len(q)-1].StrID() + "_" + q[len(q)-1].StrUpdatedAt()
	} else {
		paginatedResults.Cursor = id + "_" + timestamp
	}

	return paginatedResults, nil
}

func getQuestionsListQuery(tx *gorm.DB) *gorm.DB {
	return tx.
		Preload("QuestionTags").
		Select(`*,
			(select case
				when count(id) > 0
					then 1
					else 0
				end from answers
			where question_id = questions.id AND is_accepted = true) as has_accepted_answer,
			(select count(*) from answers where question_id = questions.id) as total_answers,
			created_at as asked_at,
			updated_at as updated_at,
			(select points from users where id = questions.created_by) as author_points`).
		Order("updated_at desc, id desc")
}
