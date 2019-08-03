package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// AddQuestionComment adds the comments to question_comments table.
func AddQuestionComment(tx *gorm.DB, c *models.QuestionComment) (*validate.Errors, error) {
	verrs := c.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if e := tx.Create(c); e.Error != nil {
		return validate.NewErrors(), e.Error
	}

	return validate.NewErrors(), nil
}

// AddAnswerComment adds the comments to answer_comments table.
func AddAnswerComment(tx *gorm.DB, c *models.AnswerComment) (*validate.Errors, error) {
	verrs := c.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if e := tx.Create(c); e.Error != nil {
		return validate.NewErrors(), e.Error
	}

	return validate.NewErrors(), nil
}
