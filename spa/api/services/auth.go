package services

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"github.com/shanmugharajk/qanet/spa/api/utils"
)

const AuthTokenValidTime = time.Hour * 24 * 30

type TokenClaims struct {
	jwt.StandardClaims
	Role *models.Role `json:"role"`
	Csrf string       `json:"csrf"`
}

type UserToken struct {
	AuthToken string `json:"authToken"`
	Csrf      string `json:"csrf"`
}

func CreateNewTokens(userid string, role *models.Role) (token UserToken, err error) {
	csrfSecret, err := utils.GenerateRandomString(32)
	if err != nil {
		return
	}

	authTokenString, err := createTokenString(userid, role)
	if err != nil {
		return
	}

	token = UserToken{
		AuthToken: authTokenString,
		Csrf:      csrfSecret,
	}

	return
}

func createTokenString(userid string, role *models.Role) (tokenString string, err error) {
	tokenString = ""

	var csrf string
	if csrf, err = utils.GenerateRandomString(32); err != nil {
		return
	}

	authClaims := TokenClaims{
		StandardClaims: jwt.StandardClaims{
			Subject:   userid,
			ExpiresAt: time.Now().Add(AuthTokenValidTime).Unix(),
		},
		Role: role,
		Csrf: csrf,
	}
	// create a signer for rsa 256
	authJwt := jwt.NewWithClaims(jwt.SigningMethodHS256, authClaims)

	signinKey := os.Getenv("AUTH_KEY")

	// generate the auth token string
	tokenString, err = authJwt.SignedString([]byte(signinKey))

	return
}
