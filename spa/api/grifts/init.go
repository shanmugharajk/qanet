package grifts

import (
	"github.com/gobuffalo/buffalo"
	"github.com/shanmugharajk/qanet/spa/api/actions"
)

func init() {
	buffalo.Grifts(actions.App())
}
