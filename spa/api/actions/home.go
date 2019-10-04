package actions

import "github.com/gobuffalo/buffalo"

func HomeHandler(c buffalo.Context) error {
	return c.Render(200, r.JSON(map[string]string{"message": "Welcome to Buffalo!"}))
}
