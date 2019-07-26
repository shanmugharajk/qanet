package actions

import (
	"html/template"
	"strings"

	"github.com/gobuffalo/buffalo/render"
	"github.com/gobuffalo/packr/v2"
)

var r *render.Engine
var assetsBox = packr.New("app:assets", "../public")

// SUCCESS constant
var SUCCESS = "SUCCESS"

// ERROR constant
var ERROR = "ERROR"

// Response structure for REST calls.
type Response struct {
	Code string      `json:"type"`
	Data interface{} `json:"data"`
}

func init() {
	r = render.New(render.Options{
		// HTML layout to be used for all HTML requests:
		HTMLLayout: "application.html",

		// Box containing all of the templates:
		TemplatesBox: packr.New("app:templates", "../templates"),
		AssetsBox:    assetsBox,

		// Add template helpers here:
		Helpers: render.Helpers{
			// uncomment for non-Bootstrap form helpers:
			// "form":     plush.FormHelper,
			// "form_for": plush.FormForHelper,
			"quil_for": func(content string) template.HTML {
				content = strings.ReplaceAll(content, "<script>", "&lt;script&gt;")
				content = strings.ReplaceAll(content, "<a", "&lt;a")
				content = strings.ReplaceAll(content, "<a>", "&lt;a&gt;")
				content = strings.ReplaceAll(content, "</a>", "&lt;/a&gt;")
				content = strings.ReplaceAll(content, "</script>", "&lt;/script&gt;")
				return template.HTML(content)
			},
		},
	})
}
