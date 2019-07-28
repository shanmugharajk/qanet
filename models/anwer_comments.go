package models

// AnswerComments is the model for answer_comments table.
type AnswerComments struct {
	ID            int64  `json:"id"`
	Comment       string `json:"comment"`
	AnswerID      int64  `json:"answerId"`
	CloseVotes    int    `json:"closeVotes"`
	IsClosed      bool   `json:"isClosed"`
	IsActive      bool   `json:"isActive"`
	DeactivatedBy string `json:"deactivatedBy" gorm:"default:'NULL'" sql:"default:null"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`

	Base
}
