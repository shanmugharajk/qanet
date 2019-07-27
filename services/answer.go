package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// AddAnswer validates and adds the answer to the question id passed.
func AddAnswer(tx *gorm.DB, a *models.Answers) (*validate.Errors, error) {
	verrs := a.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if e := tx.Create(a); e.Error != nil {
		return validate.NewErrors(), e.Error
	}

	return validate.NewErrors(), nil
}

// GetAnswers returns the answers for the question along with 5 comments in each
func GetAnswers(tx *gorm.DB, userID string, questionID int64, pageNo int, noOfRecords int) ([]models.Answers, error) {
	answwers := []models.Answers{}
	e := tx.
		Where("question_id = ?", questionID).
		Select(`*,
			(select points from users where id = answers.author) as author_points,
			(select vote from voters_list where id = answers.question_id AND voter_id = ?) as self_vote
		`, userID).
		Find(&answwers)
	return answwers, e.Error
}
