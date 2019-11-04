package services

import (
	"strings"

	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/models"
)

const ERROR_IN_FETCHING = "Error in fetching the details"

const INVALID_POST_ID = "Invalid post id"

const POST_INACTIVE = "Inactive post"

const POST_CLOSED = "Closed post"

func AddQuestion(tx *gorm.DB, q *models.Question) (*validate.Errors, error) {
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
		questionTag := models.QuestionTag{}
		questionTag.QuestionID = q.ID
		questionTag.TagID = tag

		if db := tx.Create(&questionTag); db.Error != nil {
			return validate.NewErrors(), db.Error
		}
	}

	return validate.NewErrors(), nil
}

func GetQuestionDetails(tx *gorm.DB, userID interface{}, id int64) (*models.Question, error) {
	questions := make([]*models.Question, 0, 1)

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
			updated_at as modified_at,
			(select points from users where id = questions.created_by) as author_points,
			(select vote from votes where post_id = questions.id AND voter_id = ? AND post_type = 1) as self_vote,
			(select case
				when count(question_id) > 0
					then 1 else 0
				end from bookmarks
				where question_id = questions.id AND user_id = ?) as self_bookmarked,
			(select count(question_id) from bookmarks where question_id = questions.id) as total_bookmarks
		`, userID, userID).
		Find(&questions)

	if len(questions) == 0 {
		return nil, nil
	}

	return questions[0], db.Error
}

func GetActiveNonClosedQuestionById(tx *gorm.DB, id int64, postType models.PostType) (models.Post, error) {
	question := []models.Question{}

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
	q := make([]*models.Question, 0, 20)

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
			updated_at as modified_at,
			(select points from users where id = questions.created_by) as author_points`).
		Order("updated_at desc, id desc")
}
