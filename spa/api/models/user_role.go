package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
)

type Role int

type UserRole struct {
	ID   Role `json:"id"`
	Name string   `json:"name"`
}

// Validate - validates the user details.
func (u *UserRole) Validate(tx *gorm.DB) *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: u.Name, Name: "Name"},
		&validators.StringLengthInRange{Field: u.Name, Name: "Name", Min: 6},
	)
}

// FirstOrCreateNormalUser gets the details with role as 'NormalUser'
// If there is no records available it will create a role.
func FirstOrCreateNormalUser(tx *gorm.DB) (*UserRole, error) {
	userRole := new(UserRole)
	userRole.ID = NormalUser
	userRole.Name = "NORMAL USER"
	db := tx.FirstOrCreate(&userRole)
	return userRole, db.Error
}
