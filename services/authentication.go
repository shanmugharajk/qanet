package services

import (
	"strings"

	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
	"golang.org/x/crypto/bcrypt"
)

// CreateUser creates a new user and also has the encryption logic.
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

	userRole, err := fetchNormalUserRole(tx)
	if err != nil {
		return validate.NewErrors(), errors.WithStack(err)
	}

	u.RoleID = userRole.ID
	u.IsActive = true
	e := tx.Create(u)

	return validate.NewErrors(), e.Error
}

// LoginUser checks the user credentails with database and returns if the
// matching records are there or error.
func LoginUser(tx *gorm.DB, u *models.User) (*models.User, error) {
	existing := models.User{}

	db := tx.Where("id = ?", u.ID).First(&existing)
	if db.Error != nil {
		return u, db.Error
	}

	// confirm that the given password matches the hashed password from the db
	err := bcrypt.CompareHashAndPassword([]byte(existing.PasswordHash), []byte(u.Password))
	if err != nil {
		return u, errors.New("invalid credentials")
	}

	return &existing, nil
}

// fetchNormalUserRole gets the details with role as 'NORMAL_USER'
// If there is no records available it will create a role.
func fetchNormalUserRole(tx *gorm.DB) (models.UserRole, error) {
	userRole := models.UserRole{}
	userRole.ID = models.Roles["normal_user"]
	userRole.Name = models.Roles["normal_user"]
	d := tx.FirstOrCreate(&userRole)
	return userRole, d.Error
}
