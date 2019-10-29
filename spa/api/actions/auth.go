package actions

import (
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/actions/response"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"github.com/shanmugharajk/qanet/spa/api/services"
)

func SignInHandler(c buffalo.Context) error {
	u := new(models.User)
	if err := c.Bind(u); err != nil {
		return errors.WithStack(err)
	}

	tx, _ := c.Value("tx").(*gorm.DB)

	existingUser, err := services.LoginUser(tx, u)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	res := map[string]string{
		"token":    existingUser.Token,
		"userId":   existingUser.ID,
		"userName": existingUser.DisplayName,
	}

	return c.Render(200, r.JSON(response.Success(res)))
}

func SignupHandler(c buffalo.Context) error {
	u := new(models.User)

	var err error
	if err = c.Bind(u); err != nil {
		return errors.WithStack(err)
	}

	tx, _ := c.Value("tx").(*gorm.DB)

	var verrs *validate.Errors
	verrs, err = services.CreateUser(tx, u)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	if verrs.HasAny() {
		return c.Render(200, r.JSON(response.Failure(verrs.Error())))
	}

	var token string
	if token, err = services.CreateTokenString(u.ID, u.RoleID); err != nil {
		return c.Render(200, r.JSON(response.Failure("error in generating token")))
	}

	res := map[string]string{
		"token":    token,
		"userId":   u.ID,
		"userName": u.DisplayName,
	}

	return c.Render(200, r.JSON(response.Success(res)))
}

// SetCurrentUser attempts to find a user based on the currentUserId
// in the cookie. If one is found it is set on the context.
func SetCurrentUser(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		claims := fetchClaimsFromCookie(c)
		if claims == nil {
			return next(c)
		}

		userId := claims.Subject
		u := new(models.User)
		tx, _ := c.Value("tx").(*gorm.DB)

		if err := services.GetById(tx, userId, u); err != nil {
			return next(c)
		}

		c.Set("currentUser", u)
		c.Set("userId", u.ID)
		c.Set("userRole", u.RoleID)

		return next(c)
	}
}

func Authenticate(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		// Token validation is already checked in a  middleware SetCurrentUser
		// and then the userId is taken from the token and set in the context
		// So just checking the userId in the context is sufficient for auth.
		if c.Value("userId") != nil {
			return next(c)
		}

		DeleteCookie("isSignedIn", c)
		DeleteCookie("token", c)
		DeleteCookie("userInfo", c)

		return c.Render(401, r.JSON(response.Failure("Please signin to continue")))
	}
}

func fetchClaimsFromCookie(c buffalo.Context) *services.TokenClaims {
	tokenCookie, err := c.Request().Cookie("token")

	if err != nil || tokenCookie == nil {
		return nil
	}

	token, err := jwt.ParseWithClaims(tokenCookie.Value, &services.TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("AUTH_KEY")), nil
	})

	if err != nil {
		return nil
	}

	// TODO: Revisit the token validity later
	if claims, ok := token.Claims.(*services.TokenClaims); ok && token.Valid {
		return claims
	} else {
		return nil
	}
}
