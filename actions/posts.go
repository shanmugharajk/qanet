package actions

import "github.com/gobuffalo/buffalo"

// PostsIndex returns all posts.
func PostsIndex(c buffalo.Context) error {
	return c.Render(200, r.HTML("posts/index.html"))
}
