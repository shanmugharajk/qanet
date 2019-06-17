package actions

import "github.com/gobuffalo/buffalo"

// QuestionsIndex returns all posts.
func QuestionsIndex(c buffalo.Context) error {
	return c.Render(200, r.HTML("posts/login.html"))
}

// QuestionsAsk returns the form for creating new post.
func QuestionsAsk(c buffalo.Context) error {
	return c.Render(200, r.HTML("posts/questions/ask.html"))
}
