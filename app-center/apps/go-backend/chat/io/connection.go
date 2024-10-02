package io

import (
	"context"
	"errors"
	redis_chat "go-backend/chat/redis"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
)

var Connections = &ConnectionsType{
	Mutex:           &sync.RWMutex{},
	UserConnections: make(map[string]*websocket.Conn),
}

type ConnectionsType struct {
	Mutex           *sync.RWMutex
	UserConnections map[string]*websocket.Conn
}

func (c *ConnectionsType) AddConnection(userID string, conn *websocket.Conn) {
	c.Mutex.Lock()
	c.UserConnections[userID] = conn
	c.Mutex.Unlock()

	go func() {
		sub, close := redis_chat.SubscribeToChannelForUser(userID)
		defer close()
		for {
			msg, err := sub.ReceiveMessage(context.Background())
			if err != nil {
				log.Println("Error receiving message from redis:", err)
				continue
			}
			c.Mutex.RLock()
			_, ok := c.UserConnections[userID]
			if !ok {
				log.Println("User not connected")
				break
			}
			err = c.UserConnections[userID].WriteJSON(msg.Payload)
			c.Mutex.RUnlock()
			if err != nil {
				log.Println("Error sending message to user:", err)
				break
			}

		}
	}()
}

func (c *ConnectionsType) RemoveConnection(userID string) {
	c.Mutex.Lock()

	delete(c.UserConnections, userID)

	c.Mutex.Unlock()
}

func (c *ConnectionsType) SendMessage(userID string, message interface{}) error {
	c.Mutex.RLock()
	_, ok := c.UserConnections[userID]
	if !ok {
		log.Println("User not connected")
		return errors.New("user not connected")
	}
	err := c.UserConnections[userID].WriteJSON(message)
	c.Mutex.RUnlock()
	return err
}
