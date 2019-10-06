package services

import (
	"strings"

	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(tx *gorm.DB, u *models.User) (*validate.Errors, error) {
	u.Email = strings.ToLower(u.Email)

	ph, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return validate.NewErrors(), errors.WithStack(err)
	}

	u.PasswordHash = string(ph)

	verrs := u.Validate(tx)
	if verrs.HasAny() {
		return verrs, nil
	}

	userRole, err := firstOrCreateNormalUser(tx)
	if err != nil {
		return validate.NewErrors(), errors.WithStack(err)
	}

	u.RoleID = userRole.ID
	u.IsActive = true
	e := tx.Create(u)

	return validate.NewErrors(), e.Error
}

func firstOrCreateNormalUser(tx *gorm.DB) (*models.UserRole, error) {
	userRole := new(models.UserRole)
	userRole.ID = models.GetRole(models.NormalUser)
	userRole.Name = "NORMAL USER"
	db := tx.FirstOrCreate(&userRole)
	return userRole, db.Error
}
