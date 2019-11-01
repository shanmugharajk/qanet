package models

import (
	"strconv"
	"strings"
	"time"

	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
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
