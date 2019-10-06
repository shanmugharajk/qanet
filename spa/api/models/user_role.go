package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
)

type Role int

type UserRole struct {
	ID   *Role  `json:"id" gorm:"default:0" sql:"default: 0"`
	Name string `json:"name"`
}

// Validate - validates the user details.
func (u *UserRole) Validate(tx *gorm.DB) *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: u.Name, Name: "Name"},
		&validators.StringLengthInRange{Field: u.Name, Name: "Name", Min: 6},
	)
}

func GetRole(role Role) *Role {
	r := new(Role)
	*r = role
	return r
}
