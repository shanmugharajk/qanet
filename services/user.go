package services

import (
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// FetchVoteDetails gets the question, answers, comments vote/flag details.
func FetchVoteDetails(tx *gorm.DB, userID string, questionID int64) ([]models.VotersList, error) {
	voteDetails := []models.VotersList{}
	e := tx.Where("question_id = ? AND voter_id = ?", questionID, userID).
		Find(&voteDetails)
	return voteDetails, e.Error
}

// FetchUserDetails gets the user details based on the id.
func FetchUserDetails(tx *gorm.DB, UserID string) ([]models.User, error) {
	user := []models.User{}
	e := tx.Where("id = ?", UserID).
		Find(&user)
	return user, e.Error
}
