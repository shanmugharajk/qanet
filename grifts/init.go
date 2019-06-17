package grifts

import (
	"github.com/gobuffalo/buffalo"
	"github.com/shanmugharajk/qanet/actions"
)

func init() {
	buffalo.Grifts(actions.App())
}
