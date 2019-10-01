package models

type QuestionTag struct {
	QuestionID int64  `json:"questionId"`
	TagID      string `json:"tagId"`
}
