package models

import (
	"strings"
	"time"

	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

// Roles - different user roles
var Roles = map[string]string{
	"admin_user":  "ADMIN_USER",
	"normal_user": "NORMAL_USER",
}

// User is the gorm model representation of table users.
type User struct {
	ID           string    `json:"id"`
	DisplayName  string    `json:"display_name"`
	About        string    `json:"about"`
	Points       int       `json:"points"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	RoleID       string    `json:"role_id"`
	IsActive     bool      `json:"is_active"`
	LastLoggedIn time.Time `json:"last_logged_in"`
	UpdatedAt    time.Time `json:"updatedAt" gorm:"not null"`
	CreatedAt    time.Time `json:"createdAt" gorm:"not null"`

	Password string `json:"password" gorm:"-"`
}

// Validate - validates the user details.
func (u *User) Validate(tx *gorm.DB) *validate.Errors {
	verrs := validate.Validate(
		&validators.StringIsPresent{Field: u.ID, Name: "Id"},
		&validators.StringLengthInRange{Field: u.ID, Name: "Id", Min: 6},

		&validators.StringIsPresent{Field: u.DisplayName, Name: "DisplayName"},
		&validators.StringLengthInRange{Field: u.DisplayName, Name: "DisplayName", Min: 6},

		&validators.StringIsPresent{Field: u.Email, Name: "Email"},
		&validators.StringIsPresent{Field: u.PasswordHash, Name: "PasswordHash"},
	)

	var existingUser User

	if len(verrs.Get("id")) == 0 || len(verrs.Get("id")) == 0 {
		tx.Table("users").Where("id = ? or email=?", u.ID, u.Email).First(&existingUser)

		// check to see if the ID is already taken:
		if len(verrs.Get("id")) == 0 {
			if existingUser.ID == u.ID {
				verrs.Add("id", "UserID already taken.")
			}
		}

		// check to see if the email address is already taken:
		if len(verrs.Get("email")) == 0 {
			if existingUser.Email == u.Email {
				verrs.Add("email", "Email already taken.")
			}
		}
	}

	return verrs
}

// CreateUser creates a new user and also has the encryption logic.
func CreateUser(tx *gorm.DB, u *User) (*validate.Errors, error) {
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

	userRole, err := FirstOrCreateNormalUser(tx)
	if err != nil {
		return validate.NewErrors(), errors.WithStack(err)
	}

	u.RoleID = userRole.ID
	u.IsActive = true
	e := tx.Create(u)

	return validate.NewErrors(), e.Error
}

func UpdateUserPointsById(tx *gorm.DB, userId string, points int) error {
	if points == 0 {
		return nil
	}

	if points < 0 {
		return DeductUserPointsById(tx, userId, points)
	}

	if points > 0 {
		return AddUserPointsById(tx, userId, points)
	}

	return nil
}

func AddUserPointsById(tx *gorm.DB, userId string, points int) error {
	db := tx.Model(User{}).
		Where("id = ?", userId).
		UpdateColumn("points", gorm.Expr("points + ?", points))

	return db.Error
}

func DeductUserPointsById(tx *gorm.DB, userId string, points int) error {
	db := tx.Exec(`
		UPDATE users SET points =
			CASE WHEN users.points > ? THEN users.points + ?
			ELSE 1 END
		WHERE id = ?`, points+1, points, userId)

	return db.Error
}
