package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/services"
)

// QuestionsIndex returns all posts.
func QuestionsIndex(c buffalo.Context) error {
	return c.Render(200, r.HTML("posts/login.html"))
}

// QuestionsAsk returns the form for creating new post.
func QuestionsAsk(c buffalo.Context) error {
	tx, _ := c.Value("tx").(*gorm.DB)

	tags, err := services.FetchAllTags(tx)
	if err != nil {
		return err
	}

	c.Set("tags", tags)

	return c.Render(200, r.HTML("posts/questions/ask.html"))
}
