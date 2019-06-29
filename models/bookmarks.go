package models

// Bookmarks is the model for bookmarks table.
type Bookmarks struct {
	UserID     string `json:"userId"`
	QuestionID int64  `json:"questionId"`

	Base
}
