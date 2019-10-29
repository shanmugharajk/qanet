package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
)

type Tag struct {
	ID          string `json:"id"`
	Description string `json:"description"`
	CreatedBy   string `json:"-"`
	UpdatedBy   string `json:"-"`

	Base
}

// Validate - validates the tag details
func (t *Tag) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: t.ID, Name: "Id"},
		&validators.StringIsPresent{Field: t.Description, Name: "Description"},
	)
}
