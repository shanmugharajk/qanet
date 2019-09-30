package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	customvalidators "github.com/shanmugharajk/qanet/models/validators"
)

// Answer is the model for answers table
type Answer struct {
	ID            int64  `json:"id"`
	AnswerContent string `json:"answerContent"`
	Votes         int    `json:"votes"`
	CloseVotes    int    `json:"closeVotes"`
	IsClosed      bool   `json:"isClosed"`
	IsActive      bool   `json:"isActive"`
	IsAccepted    bool   `json:"isAccepted"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`
	DeactivatedBy string `json:"deactivatedBy" gorm:"default:'NULL'" sql:"default:null"`
	QuestionID    int64  `json:"questionId"`

	Base

	// Associations
	AnswerComments []AnswerComment `json:"comments"`

	// Dto purpose
	AuthorPoints   int `json:"authorPoints" gorm:"-"`
	SelfVote       int `json:"selfVote" gorm:"-"`
	SelfIsAccepted int `json:"selfIsAccepted" gorm:"-"`
}

// Validate - validates the question details.
func (a *Answer) Validate() *validate.Errors {
	return validate.Validate(
		&customvalidators.Int64IsPresent{Field: a.QuestionID, Name: "QuestionId"},
		&validators.StringIsPresent{Field: a.AnswerContent, Name: "AnswerContent"},
	)
}

// Post interface implemenation
func (a *Answer) PostId() int64 {
	return a.ID
}

func (a *Answer) QuestionId() int64 {
	return a.QuestionID
}

func (a *Answer) TotalVote() int {
	return a.Votes
}

func (a *Answer) Author() string {
	return a.CreatedBy
}

func (a *Answer) UpdateVoteById(tx *gorm.DB, points int) error {
	db := tx.Model(Answer{}).
		Where("id = ?", a.ID).
		UpdateColumn("votes", gorm.Expr("votes + ?", points))

	return db.Error
}

// GetAnswers returns the answers for the question along with 5 comments in each
func GetAnswers(tx *gorm.DB, userId interface{}, questionId int64, pageNo int, noOfRecords int) ([]*Answer, error) {
	answers := []*Answer{}
	db := tx.
		Preload("AnswerComments", func(tx *gorm.DB) *gorm.DB {
			return tx.Offset(0).Limit(5)
		}).
		Where("question_id = ?", questionId).
		Select(`*,
			(select points from users where id = answers.created_by) as author_points,
			(select vote from votes where post_id = answers.id AND voter_id = ? AND post_type = 0 AND vote != 5) as self_vote,
			(select vote from votes where post_id = answers.id AND voter_id = ? AND post_type = 0 AND vote = 5) as self_is_accepted
		`, userId, userId).
		Find(&answers)

	return answers, db.Error
}

func AcceptTheAnswer(tx *gorm.DB, answerId int64, questionId int64) error {
	var db *gorm.DB

	db = tx.Exec(`
		UPDATE answers SET is_accepted = false
		WHERE question_id = ? AND is_accepted = true
	`, questionId)

	if db.Error != nil {
		return db.Error
	}

	db = tx.Exec(`
		UPDATE answers SET is_accepted = true
		WHERE id = ?
	`, answerId)

	if db.Error != nil {
		return db.Error
	}

	return nil
}

func GetActiveNonClosedAnswerById(tx *gorm.DB, id int64, postType PostType) (Post, error) {
	answers := []Answer{}

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
