package main

import (
	"go-backend/chat/io"
	redis_chat "go-backend/chat/redis"
	"go-backend/config"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/google/uuid"
)

func main() {
	app := fiber.New()
	redis_chat.InitRedis()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "POST, OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Get("/api/health", func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"status": "healthy"})
	})

	// Secure websocket connection
	app.Use("/ws", upgradeToWebSocket)
	app.Get("/ws/chat", websocket.New(io.WebsocketHandler))

	port := ":" + config.Config.ServerPort
	log.Fatal(app.Listen(port))
}

// Authorize and Upgrate to websocket
func upgradeToWebSocket(context *fiber.Ctx) error {
	token := context.Query("token")
	if token == "" {
		log.Println("No token provided")
		return fiber.ErrUnauthorized
	}

	if websocket.IsWebSocketUpgrade(context) {
		context.Locals("userID", uuid.New().String()) // TODO: Implement user authentication
		context.Locals("userName", "User")
		return context.Next()
	}
	return fiber.ErrUpgradeRequired
}

// TODO: Dodac autoryzacje
// TODO: Dodac db
// TODO: Obsługe wiadomości
