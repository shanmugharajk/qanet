package actions

import (
	"strconv"

	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
	"github.com/shanmugharajk/qanet/services"
)

// QuestionsAskIndex returns the form for creating new post.
func QuestionsAskIndex(c buffalo.Context) error {
	tx, _ := c.Value("tx").(*gorm.DB)

	tags, err := services.FetchAllTags(tx)
	if err != nil {
		return err
	}

	c.Set("tags", tags)

	return c.Render(200, r.HTML("posts/questions/ask.html"))
}

// QuestionsAskNew returns the form for creating new post.
func QuestionsAskNew(c buffalo.Context) error {
	q := &models.Question{}
	if err := c.Bind(q); err != nil {
		return errors.WithStack(err)
	}

	q.CreatedBy = c.Value("userId").(string)
	q.UpdatedBy = c.Value("userId").(string)
	q.Author = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := services.CreateQuestion(tx, q)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrors.HasAny() {
		c.Set("question", q)
		c.Set("verrors", verrors)
		return c.Render(200, r.HTML("posts/questions/ask.html"))
	}

	return c.Redirect(302, "/posts/"+strconv.FormatInt(q.ID, 10))
}
