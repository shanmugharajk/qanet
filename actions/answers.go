package actions

import (
	"strconv"

	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/services"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
)

// SubmitAnswer accepts the posted answer, validates and
// adds the answer to the corresponding question.
func SubmitAnswer(c buffalo.Context) error {
	a := &models.Answers{}
	if err := c.Bind(a); err != nil {
		return errors.WithStack(err)
	}

	a.CreatedBy = c.Value("userId").(string)
	a.UpdatedBy = c.Value("userId").(string)
	a.Author = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := services.AddAnswer(tx, a)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrors.HasAny() {
		c.Set("Answer", a)
		c.Set("verrors", verrors)
	}

	return c.Redirect(302, "/questions/"+strconv.FormatInt(a.QuestionID, 10))
}
