package actions

import (
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/services"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
)

// SubmitAnswer accepts the posted answer, validates and
// adds the answer to the corresponding question.
func SubmitAnswer(c buffalo.Context) error {
	a := &models.Answer{}
	if err := c.Bind(a); err != nil {
		return errors.WithStack(err)
	}

	a.CreatedBy = c.Value("userId").(string)
	a.UpdatedBy = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := services.AddAnswer(tx, a)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrors.HasAny() {
		c.Set("errorMessage", "Invalid data has been entered. Please check and try again.")
		return c.Render(400, r.Template("text/html", "shared/_error"))
	}

	authorDetail, err := services.FetchUserDetails(tx, a.CreatedBy)
	if err != nil {
		return errors.WithStack(err)
	}

	// This here always will be return one record.
	// While inserting in answers table if the user is invalid it would
	// have been thrown error and we are catching that above.
	a.AuthorPoints = authorDetail[0].Points
	a.SelfVote = 0
	a.AnswerComments = []models.AnswerComment{}

	c.Set("Answer", a)
	c.Set("type", "answer")
	return c.Render(200, r.Template("text/html", "questions/_answer"))
}
