package services

import (
	"strings"

	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// CreateQuestion validates and adds a new question.
func CreateQuestion(tx *gorm.DB, q *models.Question) (*validate.Errors, error) {
	verrs := q.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if e := tx.Create(q); e.Error != nil {
		return validate.NewErrors(), e.Error
	}

	for _, tag := range strings.Split(q.Tags, ",") {
		questionTag := models.QuestionTag{}
		questionTag.QuestionID = q.ID
		questionTag.TagID = tag

		if e := tx.Create(&questionTag); e.Error != nil {
			return validate.NewErrors(), e.Error
		}
	}

	return validate.NewErrors(), nil
}

// GetQuestionDetails fetches the question by id.
func GetQuestionDetails(tx *gorm.DB, userID interface{}, id int64) (models.Question, error) {
	question := models.Question{}
	e := tx.
		Preload("QuestionComments", func(tx *gorm.DB) *gorm.DB {
			return tx.Offset(0).Limit(5)
		}).
		Preload("QuestionTags").
		Where("id = ?", id).
		Select(`*,
			(select case when count(id) > 5 then 1 else 0 end from question_comments where question_id = questions.id) as has_more_comments,
			(select case when count(id) > 0 then 1 else 0 end from answers where question_id = questions.id AND is_accepted = true) as has_accepted_answer,
			created_at as asked_at,
			(select points from users where id = questions.created_by) as author_points,
			(select vote from voters_list where post_id = questions.id AND voter_id = ?) as self_vote,
			(select case when count(question_id) > 0 then 1 else 0 end from bookmarks where question_id = questions.id AND user_id = ?) as self_bookmarked,
			(select count(question_id) from bookmarks where question_id = questions.id) as total_bookmarks
		`, userID, userID).
		First(&question)
	return question, e.Error
}

// GetQuestions fetches the list of question with pagination.
func GetQuestions(tx *gorm.DB) ([]models.Question, error) {
	questions := []models.Question{}
	e := tx.
		Preload("QuestionTags").
		Select(`*,
			(select case when count(id) > 0 then 1 else 0 end from answers where question_id = questions.id AND is_accepted = true) as has_accepted_answer,
			(select count(*) from answers where question_id = questions.id) as total_answers,
			created_at as asked_at,
			(select points from users where id = questions.created_by) as author_points
		`).
		Find(&questions).
		Offset(0).Limit(5)
	return questions, e.Error
}
