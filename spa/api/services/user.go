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

func LoginUser(tx *gorm.DB, u *models.User) (*models.User, error) {
	existing := make([]*models.User, 0, 1)

	if err := GetById(tx, u.ID, &existing); err != nil {
		return u, err
	}

	if len(existing) == 0 {
		return u, errors.New("invalid credentials")
	}

	// confirm that the given password matches the hashed password from the db
	if err := bcrypt.CompareHashAndPassword([]byte(existing[0].PasswordHash), []byte(u.Password)); err != nil {
		return u, errors.New("invalid credentials")
	}

	var err error
	var token string

	if token, err = CreateTokenString(existing[0].ID, existing[0].RoleID); err != nil {
		return u, errors.New("error in generating token")
	}

	existing[0].Token = token

	return existing[0], nil
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
	db := tx.Model(models.User{}).
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

func firstOrCreateNormalUser(tx *gorm.DB) (*models.UserRole, error) {
	userRole := new(models.UserRole)
	userRole.ID = models.GetRole(models.NormalUser)
	userRole.Name = "NORMAL USER"
	db := tx.FirstOrCreate(&userRole)
	return userRole, db.Error
}
