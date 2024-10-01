package io

import (
	"fmt"
	"go-backend/chat/models"
	redis_chat "go-backend/chat/redis"
	store_chat "go-backend/chat/store"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
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
		message.ID = uuid.New().String()

		switch models.MessageType(message.Type) {
		case models.ChatMessageType:
			{
				users, err := store_chat.Message.AddMessage(message)
				if err != nil {
					log.Println("Error adding message to store:", err)
					continue
				}
				// message to string
				messageStr, err := message.ToString()
				if err != nil {
					log.Println("Error converting message to string:", err)
					continue
				}
				var usersToSend []string
				for _, user := range users {
					usersToSend = append(usersToSend, user.ID)
				}

				redis_chat.PublishMessageToAllActiveUsers(messageStr, usersToSend...)
			}
		}
	}

	RemoveConnection(userID)
}
