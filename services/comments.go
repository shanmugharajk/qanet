package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// AddQuestionComment returns the response of comment HTML
// once successfully added to database.
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
