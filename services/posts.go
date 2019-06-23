package services

import (
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
)

// Post - Details of a post
type Post struct {
	Question models.Question
}

// GetPostByID gets the post details - question, answers (1st 5)
// with top 5 comments.
func GetPostByID(tx *gorm.DB, id int64) (Post, error) {
	question := models.Question{}
	if e := tx.Where("id = ?", id).First(&question); e.Error != nil {
		return Post{}, e.Error
	}

	return Post{Question: question}, nil
}
