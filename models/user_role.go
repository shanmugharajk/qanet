package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
)

// UserRole - user_role table.
type UserRole struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// Validate - validates the user details.
func (u *UserRole) Validate(tx *gorm.DB) *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: u.ID, Name: "Id"},
		&validators.StringLengthInRange{Field: u.ID, Name: "Id", Min: 6},

		&validators.StringIsPresent{Field: u.Name, Name: "Name"},
		&validators.StringLengthInRange{Field: u.Name, Name: "Name", Min: 6},
	)
}
