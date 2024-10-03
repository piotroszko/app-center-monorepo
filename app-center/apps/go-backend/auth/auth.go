package auth

import (
	"context"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	db_chat "go-backend/chat/db"
	redis_chat "go-backend/chat/redis"
	"go-backend/prisma/db"

	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func VerifyToken(token string) (UserClaims, error) {
	jwtKeyName := "publicKey"
	ctx := context.Background()
	secret, err := redis_chat.RedisClient.Get(ctx, jwtKeyName).Result()

	if err != nil || secret == "" {
		secretDb, err := db_chat.DbConnection.Settings.FindFirst(
			db.Settings.Key.Equals(jwtKeyName),
		).Exec(ctx)
		if err != nil {
			return UserClaims{}, err
		}

		_, err = redis_chat.RedisClient.Set(ctx, jwtKeyName, secretDb.Value, 0).Result()
		if err != nil {
			return UserClaims{}, err
		}
		secret = secretDb.Value
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
