package actions

import (
	"strconv"

	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"
	"github.com/shanmugharajk/qanet/services"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
)

const question = "question"
const answer = "answer"

type commentForm struct {
	Type       string
	Comment    string
	QuestionID int64
}

// AddComment returns the response of comment HTML
// once successfully added to database.
func AddComment(c buffalo.Context) error {
	commentForm := &commentForm{}
	if err := c.Bind(commentForm); err != nil {
		return errors.WithStack(err)
	}

	postID := c.Param("postID")

	questionID, err := strconv.ParseInt(postID, 10, 64)
	if err != nil {
		return errors.WithStack(err)
	}

	commentForm.QuestionID = questionID

	if commentForm.Type == question {
		return saveAndRenderQuestionComment(c, commentForm)
	}

	if commentForm.Type == answer {
		// TODO:
	}

	return errors.New("internal error occurred")
}

func saveAndRenderQuestionComment(c buffalo.Context, commentForm *commentForm) error {
	comment := &models.QuestionComment{}
	comment.Comment = commentForm.Comment
	comment.QuestionID = commentForm.QuestionID
	comment.CreatedBy = c.Value("userId").(string)
	comment.UpdatedBy = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := services.AddQuestionComment(tx, comment)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrors.HasAny() {
		c.Set("errorMessage", "Invalid data has been entered. Please check and try again.")
		return c.Render(400, r.Template("text/html", "shared/_error"))
	}

	c.Set("id", comment.ID)
	c.Set("type", question)
	c.Set("closeVotes", comment.CloseVotes)
	c.Set("comment", comment.Comment)
	c.Set("author", comment.CreatedBy)
	c.Set("at", comment.CreatedAt)

	return c.Render(200, r.Template("text/html", "shared/_comment"))
}
