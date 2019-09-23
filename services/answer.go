package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	m "github.com/shanmugharajk/qanet/models"
)

// AddAnswer validates and adds the answer to the question id passed.
func AddAnswer(tx *gorm.DB, a *m.Answer) (*validate.Errors, error) {
	verrs := a.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if db := tx.Create(a); db.Error != nil {
		return validate.NewErrors(), db.Error
	}

	return validate.NewErrors(), nil
}

// GetAnswers returns the answers for the question along with 5 comments in each
func GetAnswers(tx *gorm.DB, userID interface{}, questionID int64, pageNo int, noOfRecords int) ([]m.Answer, error) {
	answers := []m.Answer{}
	db := tx.
		Preload("AnswerComments", func(tx *gorm.DB) *gorm.DB {
			return tx.Offset(0).Limit(5)
		}).
		Where("question_id = ?", questionID).
		Select(`*,
			(select points from users where id = answers.created_by) as author_points,
			(select vote from votes where post_id = answers.id AND voter_id = ? AND is_question = false AND vote != 5) as self_vote,
			(select vote from votes where post_id = answers.id AND voter_id = ? AND is_question = false AND vote = 5) as self_is_accepted
		`, userID, userID).
		Find(&answers)

	return answers, db.Error
}
