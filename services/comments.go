package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	m "github.com/shanmugharajk/qanet/models"
)

// FetchAnswerComment fetches the answer comment based on the id
func FetchAnswerComment(tx *gorm.DB, id int64) (*m.AnswerComment, error) {
	c := &m.AnswerComment{}

	db := tx.First(c, id)
	if db.Error != nil {
		return c, nil
	}

	return c, db.Error
}

// FetchQuestionComment fetches the question comment based on the id
func FetchQuestionComment(tx *gorm.DB, id int64) (*m.QuestionComment, error) {
	c := &m.QuestionComment{}

	db := tx.First(c, id)
	if db.Error != nil {
		return c, nil
	}

	return c, db.Error
}

// SaveQuestionComment adds the comments to question_comments table.
func SaveQuestionComment(tx *gorm.DB, c *m.QuestionComment, isNew bool) (*validate.Errors, error) {
	verrs := c.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	var db *gorm.DB

	if isNew == true {
		db = tx.Create(c)
	} else {
		db = tx.Model(&c).Update(c).Where("id = ?", c.ID)
	}

	if db.Error != nil {
		return validate.NewErrors(), db.Error
	}

	return validate.NewErrors(), nil
}

// SaveAnswerComment adds the comments to answer_comments table.
func SaveAnswerComment(tx *gorm.DB, c *m.AnswerComment, isNew bool) (*validate.Errors, error) {
	verrs := c.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	var db *gorm.DB

	if isNew == true {
		db = tx.Create(c)
	} else {
		db = tx.Model(&c).Update(c).Where("id = ?", c.ID)
	}

	if db.Error != nil {
		return validate.NewErrors(), db.Error
	}

	return validate.NewErrors(), nil
}

// DeleteQuestionComment deletes the matching answer comment by id.
func DeleteQuestionComment(tx *gorm.DB, id int64) error {
	return DeleteByID(tx, m.QuestionComment{ID: id})
}

// DeleteAnswerComment deletes the matching answer comment by id.
func DeleteAnswerComment(tx *gorm.DB, id int64) error {
	return DeleteByID(tx, m.AnswerComment{ID: id})
}
