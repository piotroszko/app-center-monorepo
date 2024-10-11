package io_chat

import (
	"encoding/json"
	"fmt"
	"go-backend/chat/models"
	redis_chat "go-backend/chat/redis"
	store_chat "go-backend/chat/store"
	"go-backend/logs"
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
	logs.SendLogInfo(fmt.Sprintf("User connected: %v", user), "ws-connection")

	Connections.AddConnection(userID, conn)

	for {
		var message models.Message
		if err := conn.ReadJSON(&message); err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
				logs.SendLogInfo(fmt.Sprintf("User disconnected: %v", user), "ws-connection")
				break
			}
			logs.SendLogError(fmt.Sprintf("Error reading message from websocket: %v", err), "ws-connection")
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
					logs.SendLogError(fmt.Sprintf("Error adding message to store: %v", err), "ws-connection")
					continue
				}
				// message to string
				messageStr, err := message.ToString()
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error converting message to string: %v", err), "ws-connection")
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
					logs.SendLogError(fmt.Sprintf("Error getting messages from store: %v", err), "ws-connection")
					continue
				}
				// send to player in one message
				jsonData, err := json.Marshal(msgs)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error marshalling messages: %v", err), "ws-connection")
					continue
				}
				err = Connections.SendMessage(userID, jsonData)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error writing messages to websocket: %v", err), "ws-connection")
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
					logs.SendLogError(fmt.Sprintf("Error getting messages from store: %v", err), "ws-connection")
					continue
				}
				jsonData, err := json.Marshal(msgs)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error marshalling messages: %v", err), "ws-connection")
					continue
				}
				err = Connections.SendMessage(userID, jsonData)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error writing messages to websocket: %v", err), "ws-connection")
					break
				}
			}
		case models.GetChannelsType:
			{
				channels, err := store_chat.Channel.GetChannels(userID)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error getting channels from store: %v", err), "ws-connection")
					continue
				}
				err = Connections.SendMessage(userID, channels)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error writing channels to websocket: %v", err), "ws-connection")
					break
				}
			}
		case models.CreateRoomType:
			{
				channel, err := store_chat.Channel.CreateRoom(message.Content, userID)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error creating room: %v", err), "ws-connection")
					continue
				}
				err = Connections.SendMessage(userID, channel)
				if err != nil {
					logs.SendLogError(fmt.Sprintf("Error writing channel to websocket: %v", err), "ws-connection")
					break
				}
			}
		}
	}

	Connections.RemoveConnection(userID)
}
