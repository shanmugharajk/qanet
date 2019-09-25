package actions

import (
	"log"
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	forcessl "github.com/gobuffalo/mw-forcessl"
	paramlogger "github.com/gobuffalo/mw-paramlogger"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/unrolled/secure"

	csrf "github.com/gobuffalo/mw-csrf"
	i18n "github.com/gobuffalo/mw-i18n"
	"github.com/gobuffalo/packr/v2"
	"github.com/shanmugharajk/qanet/models"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")

var app *buffalo.App

// T is the translator object.
var T *i18n.Translator

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
	if app != nil {
		return app
	}

	app = buffalo.New(buffalo.Options{
		Env:         ENV,
		SessionName: "_qanet_session",
	})

	if app.Env != "development" {
		// TODO: Create a custom error page.
		app.ErrorHandlers[500] = func(status int, origErr error, c buffalo.Context) error {
			_, err := c.Response().Write([]byte("OOPS, Internal server error."))
			return err
		}
	}

	// Automatically redirect to SSL
	app.Use(forceSSL())

	// Log request parameters (filters apply).
	app.Use(paramlogger.ParameterLogger)

	// Protect against CSRF attacks. https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
	// Remove to disable this.
	app.Use(csrf.New)

	app.Use(GormTransaction(models.DbConnection))

	// Setup and use translations:
	app.Use(translations())

	app.Use(SetCurrentUser)

	app.GET("/", HomeHandler)
	app.GET("/login", LoginIndex)
	app.POST("/login", LoginNew)
	app.GET("/logout", Logout)
	app.GET("/signup", SignupIndex)
	app.POST("/signup", SignupNew)

	// Question
	questions := app.Group("/questions")
	questions.GET("/ask", authenticate(AskQuestionIndex))
	questions.POST("/ask", authenticate(AskQuestion))
	questions.POST("/{questionID}/answer/submit", authenticate(SubmitAnswer))
	questions.GET("/{questionID}", QuestionDetail)

	// Bookmark
	app.POST("/posts/{postID}/bookmarks", authenticate(UpdateBookmark))
	app.DELETE("/posts/{postID}/bookmarks", authenticate(UpdateBookmark))

	// Vote
	app.POST("/posts/{postID}/vote/{vote}", authenticate(VoteHandler))

	// Comments
	app.POST("/posts/{postID}/comments", authenticate(AddComment))
	app.PUT("/posts/{postID}/comments/{commentID}", authenticate(UpdateComment))
	app.DELETE("/posts/{type}/comments/{commentID}", authenticate(DeleteComment))

	app.ServeFiles("/", assetsBox) // serve files from the public directory

	return app
}

func authenticate(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		if c.Value("userId") != nil {
			return next(c)
		}

		u := &models.User{}
		c.Set("user", u)
		c.Session().Clear()
		DeleteCookie("qaid", c)

		url := "/login?returnUrl=" + c.Request().URL.String()
		return c.Redirect(302, url)
	}
}

// translations will load locale files, set up the translator `actions.T`,
// and will return a middleware to use to load the correct locale for each
// request.
// for more information: https://gobuffalo.io/en/docs/localization
func translations() buffalo.MiddlewareFunc {
	var err error
	if T, err = i18n.New(packr.New("app:locales", "../locales"), "en-US"); err != nil {
		// Check to make go-lint happy
		// TODO: any other way??
		if err2 := app.Stop(err); err2 != nil {
			log.Println(err2)
		}
	}
	return T.Middleware()
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

var errNonSuccess = errors.New("non success status code")
