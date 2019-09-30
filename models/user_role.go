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

// FirstOrCreateNormalUser gets the details with role as 'NORMAL_USER'
// If there is no records available it will create a role.
func FirstOrCreateNormalUser(tx *gorm.DB) (*UserRole, error) {
	userRole := new(UserRole)
	userRole.ID = Roles["normal_user"]
	userRole.Name = Roles["normal_user"]
	db := tx.FirstOrCreate(&userRole)
	return userRole, db.Error
}
