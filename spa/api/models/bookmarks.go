package models

type Bookmarks struct {
	UserID     string `json:"userId"`
	QuestionID int64  `json:"questionId"`

	Base
}
