package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	RedisHost string
	RedisPort string

	ServerPort    string
	JwtPrivateKey string
	JwtPublicKey  string
}

var Config AppConfig

func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	Config = AppConfig{
		ServerPort:    os.Getenv("SERVER_PORT"),
		RedisHost:     os.Getenv("REDIS_HOST"),
		RedisPort:     os.Getenv("REDIS_PORT"),
		JwtPrivateKey: os.Getenv("JWT_PRIVATE"),
		JwtPublicKey:  os.Getenv("JWT_PUBLIC"),
	}

	if Config.RedisHost == "" {
		log.Fatal("Environment variables not set")
	}
}
