package models

// Answers is the model for answers table
type Answers struct {
	ID            int64  `json:"id"`
	AnswerContent string `json:"answerContent"`
	Votes         int    `json:"votes"`
	CloseVotes    int    `json:"closeVotes"`
	IsClosed      bool   `json:"isClosed"`
	IsActive      bool   `json:"isActive"`
	IsAccepted    bool   `json:"isAccepted"`
	Author        string `json:"author"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`
	DeactivatedBy string `json:"deactivatedBy"`
	QuestionID    string `json:"questionId"`

	Base
}
