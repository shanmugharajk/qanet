package models

// QuestionComment is the model for question_comments table.
type QuestionComment struct {
	ID            int64  `json:"id"`
	Comment       string `json:"comments"`
	AuthorID      string `json:"authorId"`
	QuestionID    int64  `json:"questionId"`
	CloseVotes    int    `json:"closeVotes"`
	IsActive      bool   `json:"isActive"`
	DeactivatedBy string `json:"deactivatedBy"`

	Base
}
