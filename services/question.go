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
func GetQuestionDetails(tx *gorm.DB, userDetails interface{}, id int64) (models.Question, error) {
	question := models.Question{}
	e := tx.
		Preload("Comments", func(tx *gorm.DB) *gorm.DB {
			return tx.Offset(0).Limit(5)
		}).
		Preload("QuestionTags").
		Where("id = ?", id).
		Find(&question)
	return question, e.Error
}
