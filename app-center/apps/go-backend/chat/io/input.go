package io

import (
	"fmt"
	"go-backend/chat/models"
	"log"

	"github.com/gofiber/contrib/websocket"
)

func WebsocketHandler(conn *websocket.Conn) {
	userID := conn.Locals("userID").(string)
	userName := conn.Locals("userName").(string)

	user := &models.User{
		ID:         userID,
		Name:       userName,
		Connection: conn,
	}
	fmt.Println("User connected:", user)

	AddConnection(userID, conn)

	for {
		var message models.Message
		if err := conn.ReadJSON(&message); err != nil {
			log.Println("Error reading message from websocket:", err)
			break
		}

		log.Printf("Received message: %v\n", message)
		message.SenderID = userID
		message.SenderName = userName

		switch models.MessageType(message.Type) {
		case models.ChatMessageType:
			{
			}
		}
	}

	RemoveConnection(userID)
}
