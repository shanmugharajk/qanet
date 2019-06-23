package actions

import (
	"html/template"
	"strconv"

	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/services"
)

// PostsIndex returns all posts.
func PostsIndex(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, _ := c.Value("tx").(*gorm.DB)
	questionID := c.Param("questionID")

	qid, err := strconv.ParseInt(questionID, 10, 64)
	if err != nil {
		return errors.WithStack(err)
	}

	posts, err := services.GetPostByID(tx, qid)
	if err != nil {
		return errors.WithStack(err)
	}

	c.Set("Posts", posts)
	c.Set("getContent", func(content string) template.HTML {
		return template.HTML(template.JSEscapeString(content))
	})
	return c.Render(200, r.HTML("posts/index.html"))
}
