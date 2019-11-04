package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	forcessl "github.com/gobuffalo/mw-forcessl"
	paramlogger "github.com/gobuffalo/mw-paramlogger"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/unrolled/secure"

	contenttype "github.com/gobuffalo/mw-contenttype"
	"github.com/gobuffalo/x/sessions"
	"github.com/rs/cors"
	"github.com/shanmugharajk/qanet/spa/api/models"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
//
// Routing, middleware, groups, etc... are declared TOP -> DOWN.
// This means if you add a middleware to `app` *after* declaring a
// group, that group will NOT have that new middleware. The same
// is true of resource declarations as well.
//
// It also means that routes are checked in the order they are declared.
// `ServeFiles` is a CATCH-ALL route, so it should always be
// placed last in the route declarations, as it will prevent routes
// declared after it to never be called.
func App() *buffalo.App {
	// TODO: modify origin
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
			PreWares: []buffalo.PreWare{
				c.Handler,
			},
			SessionName: "_api_session",
		})

		// Automatically redirect to SSL
		app.Use(forceSSL())

		// Log request parameters (filters apply).
		app.Use(paramlogger.ParameterLogger)

		// GormTransaction - wraps the gorm transaction logic in the middleware
		app.Use(GormTransaction(models.DbConnection))

		// Set the request content type to JSON
		app.Use(contenttype.Set("application/json"))

		app.Use(SetCurrentUser)

		api := app.Group("/api")
		api.GET("/", GetQuestions)
		api.POST("/signin", SignInHandler)
		api.POST("/signup", SignupHandler)

		questions := api.Group("/questions")
		questions.GET("/", GetQuestions)
		questions.GET("/tags", GetAllTagHandler)
		questions.POST("/ask", Authenticate(AskQuestion))
		questions.GET("/{questionID}", QuestionDetail)
	}

	return app
}

// forceSSL will return a middleware that will redirect an incoming request
// if it is not HTTPS. "http://example.com" => "https://example.com".
// This middleware does **not** enable SSL. for your application. To do that
// we recommend using a proxy: https://gobuffalo.io/en/docs/proxy
// for more information: https://github.com/unrolled/secure/
func forceSSL() buffalo.MiddlewareFunc {
	return forcessl.Middleware(secure.Options{
		SSLRedirect:     ENV == "production",
		SSLProxyHeaders: map[string]string{"X-Forwarded-Proto": "https"},
	})
}

// DeleteCookie sets the response header to adds a Set-Cookie header to the
// provided ResponseWriter's header and instructs browser to expire it.
var DeleteCookie = func(name string, c buffalo.Context) {
	ck := http.Cookie{
		Name:   name,
		Path:   "/",
		MaxAge: -1,
	}

	http.SetCookie(c.Response(), &ck)
}

var errNonSuccess = errors.New("internal server error")

// GormTransaction - wraps the gorm transaction logic in the middleware
var GormTransaction = func(db *gorm.DB) buffalo.MiddlewareFunc {
	return func(h buffalo.Handler) buffalo.Handler {
		return func(c buffalo.Context) error {

			ef := func() error {
				if err := h(c); err != nil {
					return err
				}
				if res, ok := c.Response().(*buffalo.Response); ok {
					if res.Status < 200 || res.Status >= 400 {
						return errNonSuccess
					}
				}
				return nil
			}

			// wrap all requests in a transaction and set the length
			// of time doing things in the db to the log.
			tx := db.Begin()
			if tx.Error != nil {
				return errors.WithStack(tx.Error)
			}
			defer tx.Commit()

			c.Set("tx", tx)
			err := ef()
			if err != nil && errors.Cause(err) != errNonSuccess {
				tx.Rollback()
				return err
			}
			return nil
		}
	}
}
