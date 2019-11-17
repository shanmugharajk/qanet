package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/models"
)

func AddAnswer(tx *gorm.DB, answer *models.Answer) (*validate.Errors, error) {
	verrs := answer.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if db := tx.Create(answer); db.Error != nil {
		return validate.NewErrors(), db.Error
	}

	return validate.NewErrors(), nil
}

func GetAnswers(tx *gorm.DB, userId interface{}, questionId int64, pageNo int, noOfRecords int) ([]*models.Answer, error) {
	answers := []*models.Answer{}
	db := tx.
		Preload("AnswerComments").
		Where("question_id = ?", questionId).
		Select(`*,
			(select points from users where id = answers.created_by) as author_points,
			(select vote from votes where
				post_id = answers.id AND voter_id = ? AND
				post_type = 0 AND vote NOT IN (5, 0)) as self_vote,
			(select vote from votes where
				post_id = answers.id AND voter_id = ? AND
				post_type = 0 AND vote IN (5, 0)) as self_is_accepted
		`, userId, userId).
		Find(&answers)

	return answers, db.Error
}

func UndoAcceptedAnswer(tx *gorm.DB, answerId int64, questionId int64) error {
	var db *gorm.DB

	db = tx.Exec(`
		UPDATE answers SET is_accepted = false
		WHERE question_id = ? AND is_accepted = true
	`, questionId)

	if db.Error != nil {
		return db.Error
	}

	return nil
}

func AcceptAnswer(tx *gorm.DB, answerId int64, questionId int64) error {
	if err := UndoAcceptedAnswer(tx, answerId, questionId); err != nil {
		return err
	}

	var db *gorm.DB

	db = tx.Exec(`
		UPDATE answers SET is_accepted = true
		WHERE id = ?
	`, answerId)

	if db.Error != nil {
		return db.Error
	}

	return nil
}

func GetPreviousAcceptedAnswer(tx *gorm.DB, questionId int64) (*models.Answer, error) {
	answers := []models.Answer{}

	if db := tx.Where("question_id = ? AND is_accepted = true", questionId).
		Find(&answers); db.Error != nil {
		return nil, db.Error
	}

	if len(answers) > 0 {
		return &answers[0], nil
	}

	return nil, nil
}

func GetActiveNonClosedAnswerById(tx *gorm.DB, id int64, postType models.PostType) (models.Post, error) {
	answers := []models.Answer{}

	if err := GetById(tx, id, &answers); err != nil {
		return nil, errors.New(ERROR_IN_FETCHING)
	}

	if len(answers) == 0 {
		return nil, errors.New(INVALID_POST_ID)
	}

	if !answers[0].IsActive {
		return nil, errors.New(POST_INACTIVE)
	}

	if answers[0].IsClosed {
		return nil, errors.New(POST_CLOSED)
	}

	return &answers[0], nil
}
