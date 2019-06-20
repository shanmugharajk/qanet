package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
)

// Tag is the model for tags table.
type Tag struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	CreatedBy  string `json:"createdBy"`
	ModifiedBy string `json:"modifiedBy"`

	Base
}

// Validate - validates the tag details
func (t *Tag) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: t.ID, Name: "Id"},
		&validators.StringIsPresent{Field: t.Name, Name: "Name"},
	)
}
