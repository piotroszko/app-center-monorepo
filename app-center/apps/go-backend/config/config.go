package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	RedisHost string
	RedisPort string

	ServerPort string
	JwtSecret  string
}

var Config AppConfig

func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	Config = AppConfig{
		ServerPort: os.Getenv("SERVER_PORT"),
		RedisHost:  os.Getenv("REDIS_HOST"),
		RedisPort:  os.Getenv("REDIS_PORT"),
		JwtSecret:  os.Getenv("JWT_SECRET"),
	}

	if Config.RedisHost == "" {
		log.Fatal("Environment variables not set")
	}
}
