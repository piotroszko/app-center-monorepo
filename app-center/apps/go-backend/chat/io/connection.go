package io

import (
	"context"
	redis_chat "go-backend/chat/redis"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
)

var connectionMutex = &sync.RWMutex{}
var UserConnections = make(map[string]*websocket.Conn)

func AddConnection(userID string, conn *websocket.Conn) {
	connectionMutex.Lock()
	UserConnections[userID] = conn
	connectionMutex.Unlock()

	go func() {
		sub, close := redis_chat.SubscribeToChannelForUser(userID)
		defer close()
		for {
			msg, err := sub.ReceiveMessage(context.Background())
			if err != nil {
				log.Println("Error receiving message from redis:", err)
				continue
			}
			connectionMutex.RLock()
			err = conn.WriteJSON(msg.Payload)
			connectionMutex.RUnlock()
			if err != nil {
				log.Println("Error sending message to user:", err)
				break
			}

		}
	}()
}

func RemoveConnection(userID string) {
	connectionMutex.Lock()
	defer connectionMutex.Unlock()
	delete(UserConnections, userID)
}

func GetConnection(userID string) (*websocket.Conn, bool) {
	connectionMutex.RLock()
	defer connectionMutex.RUnlock()
	conn, ok := UserConnections[userID]
	return conn, ok
}
