package io_chat

import (
	"errors"
	"go-backend/logs"
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
		logs.SendLogError("User not connected, ID:"+userID, "go-redis")
		return errors.New("user not connected")
	}
	err := c.UserConnections[userID].WriteJSON(message)
	c.Mutex.RUnlock()
	return err
}

func (c *ConnectionsType) SendMessageToUsers(message interface{}, usersIds ...string) {
	c.Mutex.RLock()
	for _, user := range usersIds {
		if c.UserConnections[user] != nil {
			c.UserConnections[user].WriteJSON(message)
		}
	}
	c.Mutex.RUnlock()
}
