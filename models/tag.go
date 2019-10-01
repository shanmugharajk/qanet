package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
)

type Tag struct {
	ID          string `json:"id"`
	Description string `json:"description"`
	CreatedBy   string `json:"createdBy"`
	UpdatedBy   string `json:"updatedBy"`

	Base
}

// Validate - validates the tag details
func (t *Tag) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: t.ID, Name: "Id"},
		&validators.StringIsPresent{Field: t.Description, Name: "Description"},
	)
}

func GetAllTags(tx *gorm.DB) ([]*Tag, error) {
	var t []*Tag
	db := tx.Find(&t)
	return t, db.Error
}
