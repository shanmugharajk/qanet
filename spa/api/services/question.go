package services

import (
	"strings"

	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/spa/api/models"
)

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
