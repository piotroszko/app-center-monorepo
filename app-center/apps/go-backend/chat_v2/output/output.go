package output

import (
	"go-backend/chat_v2/models"
	"sync"

	"github.com/gofiber/contrib/websocket"
)

type connectionsType struct {
	Mutex           *sync.RWMutex
	UserConnections map[string]*websocket.Conn
}

var connections = &connectionsType{
	Mutex:           &sync.RWMutex{},
	UserConnections: make(map[string]*websocket.Conn),
}

func AddConnection(user models.User, conn *websocket.Conn) {
	connections.Mutex.Lock()
	connections.UserConnections[user.ID] = conn
	connections.Mutex.Unlock()
}

func sendMessage(message interface{}, usersIds ...string) {
	connections.Mutex.RLock()
	for _, user := range usersIds {
		if connections.UserConnections[user] != nil {
			connections.UserConnections[user].WriteJSON(message)
		}
	}
	connections.Mutex.RUnlock()
}

func RemoveConnection(user models.User) {
	connections.Mutex.Lock()

	_ = connections.UserConnections[user.ID].Close()
	delete(connections.UserConnections, user.ID)

	connections.Mutex.Unlock()
}
