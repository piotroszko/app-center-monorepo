package auth

import (
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"go-backend/config"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func VerifyToken(token string) (UserClaims, error) {
	secret := config.Config.JwtPublicKey
	if secret == "" {
		return UserClaims{}, fmt.Errorf("jwt public key not found")
	}

	block, _ := pem.Decode([]byte(secret))
	tokenDecoded, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return x509.ParsePKIXPublicKey(block.Bytes)
	})
	if err != nil {
		return UserClaims{}, err
	}
	if !tokenDecoded.Valid {
		return UserClaims{}, fmt.Errorf("invalid token")
	}

	return UserClaims{
		ID:    tokenDecoded.Claims.(jwt.MapClaims)["id"].(string),
		Name:  tokenDecoded.Claims.(jwt.MapClaims)["name"].(string),
		Email: tokenDecoded.Claims.(jwt.MapClaims)["email"].(string),
	}, nil
}

func HTTPMiddleware(context *fiber.Ctx) error {
	token := string(context.Request().Header.Peek("Authorization"))
	if token == "" {
		return fiber.ErrUnauthorized
	}
	user, err := VerifyToken(token)
	if err != nil || user.ID == "" || user.Name == "" || user.Email == "" {
		return fiber.ErrUnauthorized
	}
	context.Locals("userId", user.ID)
	context.Locals("userName", user.Name)
	context.Locals("userEmail", user.Email)
	return context.Next()
}
