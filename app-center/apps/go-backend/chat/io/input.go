package io

import (
	"encoding/json"
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

	Connections.AddConnection(userID, conn)

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

		if message.Amount == 0 {
			message.Amount = 10
		}
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
		case models.GetNewestType:
			{
				msgs, err := store_chat.Message.GetMessages(message.ChannelID, message.Amount)
				if err != nil {
					log.Println("Error getting messages from store:", err)
					continue
				}
				// send to player in one message
				jsonData, err := json.Marshal(msgs)
				if err != nil {
					log.Println("Error marshalling messages:", err)
					continue
				}
				err = Connections.SendMessage(userID, jsonData)
				if err != nil {
					log.Println("Error writing messages to websocket:", err)
					break
				}
			}
		case models.GetHistoryType:
			{
				if message.TargetMessageId == "" {
					continue
				}
				msgs, err := store_chat.Message.GetMessagesAfter(message.ChannelID, message.TargetMessageId, message.Amount)
				if err != nil {
					log.Println("Error getting messages from store:", err)
					continue
				}
				jsonData, err := json.Marshal(msgs)
				if err != nil {
					log.Println("Error marshalling messages:", err)
					continue
				}
				err = Connections.SendMessage(userID, jsonData)
				if err != nil {
					log.Println("Error writing messages to websocket:", err)
					break
				}
			}
		case models.GetChannelsType:
			{
				channels, err := store_chat.Channel.GetChannels(userID)
				if err != nil {
					log.Println("Error getting channels from store:", err)
					continue
				}
				err = Connections.SendMessage(userID, channels)
				if err != nil {
					log.Println("Error writing channels to websocket:", err)
					break
				}
			}
		case models.CreateRoomType:
			{
				channel, err := store_chat.Channel.CreateRoom(message.Content, userID)
				if err != nil {
					log.Println("Error creating room:", err)
					continue
				}
				err = Connections.SendMessage(userID, channel)
				if err != nil {
					log.Println("Error writing channel to websocket:", err)
					break
				}
			}
		}
	}

	Connections.RemoveConnection(userID)
}
