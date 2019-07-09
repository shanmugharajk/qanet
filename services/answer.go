package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// AddAnswer validates and adds the answer to the question id passed.
func AddAnswer(tx *gorm.DB, a *models.Answers) (*validate.Errors, error) {
	verrs := a.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if e := tx.Create(a); e.Error != nil {
		return validate.NewErrors(), e.Error
	}

	return validate.NewErrors(), nil
}
