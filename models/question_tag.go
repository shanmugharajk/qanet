package models

// QuestionTag is the model for question_tags table.
type QuestionTag struct {
	QuestionID int64  `json:"questionId"`
	TagID      string `json:"tagId"`
}
