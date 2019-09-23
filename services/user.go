package services

import (
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
	m "github.com/shanmugharajk/qanet/models"
)

// FetchUserDetails gets the user details based on the id.
func FetchUserDetails(tx *gorm.DB, userID string) ([]models.User, error) {
	user := []m.User{}
	db := tx.Where("id = ?", userID).
		Find(&user)
	return user, db.Error
}

// AddUserPoints adds points to the user
func AddUserPoints(tx *gorm.DB, userID string, points int) error {
	db := tx.Model(m.User{}).
		Where("id = ?", userID).
		UpdateColumn("points", gorm.Expr("points + ?", points))

	return db.Error
}

// DeductUserPoints subtracts  points to the user
func DeductUserPoints(tx *gorm.DB, userID string, points int) error {
	db := tx.Exec(`
		UPDATE users SET points =
			CASE WHEN users.points > ? THEN users.points - ?
			ELSE 1 END
		WHERE id = ?`, points+1, points, userID)

	return db.Error
}
