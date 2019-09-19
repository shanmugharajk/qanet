package services

import (
	"github.com/jinzhu/gorm"
	m "github.com/shanmugharajk/qanet/models"
)

// AddBookmark adds the post id and user id in bookmarks table, returns
// no of rows affected and the error.
func AddBookmark(tx *gorm.DB, userID string, postID int64) (int64, error) {
	bookmark := &m.Bookmarks{
		UserID:     userID,
		QuestionID: postID,
	}

	var e *gorm.DB
	var existing int64

	// Check whether it already exists and return it it is.
	e = tx.Model(bookmark).Where("user_id = ? and question_id = ?", userID, postID).Count(&existing)

	if e.Error != nil {
		return 0, e.Error
	}

	// Fetching the total no of bookmarks
	var total int64

	e = tx.Model(bookmark).Where("question_id = ?", postID).Count(&total)

	if e.Error != nil {
		return 0, e.Error
	}

	if existing > 0 {
		return total, nil
	}

	if e = tx.Save(bookmark); e.Error != nil {
		return 0, e.Error
	}

	return total + 1, nil
}
