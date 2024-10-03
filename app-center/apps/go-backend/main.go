package main

import (
	"go-backend/auth"
	db_chat "go-backend/chat/db"
	"go-backend/chat/io"
	redis_chat "go-backend/chat/redis"
	"go-backend/config"
	"go-backend/logs"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	redis_chat.InitRedis()
	db_chat.InitDb()

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
	token := string(context.Request().Header.Peek("Authorization"))
	if token == "" {
		logs.SendLogWarning("No token provided, connection ip:"+context.IP(), "ws-upgrader")
		return fiber.ErrUnauthorized
	}
	user, err := auth.VerifyToken(token)
	if err != nil || user.ID == "" || user.Name == "" || user.Email == "" {
		logs.SendLogWarning("Invalid token provided, connection ip:"+context.IP()+", token:"+token, "ws-upgrader")
		return fiber.ErrUnauthorized
	}

	if websocket.IsWebSocketUpgrade(context) {
		context.Locals("userID", user.ID)
		context.Locals("userName", user.Name)
		context.Locals("userEmail", user.Email)
		return context.Next()
	}
	return fiber.ErrUpgradeRequired
}
