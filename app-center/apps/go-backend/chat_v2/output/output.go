package output

import (
	"fmt"
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
	if connections.UserConnections[user.ID] != nil {
		fmt.Println("Closing connection for user", user.ID)
		err := connections.UserConnections[user.ID].Close()
		if err != nil {
			fmt.Println("Error closing connection for user", user.ID)
		}
		connections.UserConnections[user.ID] = conn
	} else {
		connections.UserConnections[user.ID] = conn
	}
	connections.Mutex.Unlock()
}

func sendMessage(message interface{}, usersIds ...string) {
	connections.Mutex.RLock()
	for _, user := range usersIds {
		if connections.UserConnections[user] != nil {
			err := connections.UserConnections[user].WriteJSON(message)
			if err != nil {
				fmt.Println("Error sending message to user", user)
			}
		}
	}
	connections.Mutex.RUnlock()
}

func RemoveConnection(user models.User) {
	connections.Mutex.Lock()
	if connections.UserConnections[user.ID] == nil {
		connections.Mutex.Unlock()
		fmt.Println("Connection for user", user.ID, "not found")
		return
	}

	err := connections.UserConnections[user.ID].Close()
	if err != nil {
		fmt.Println("Error closing connection for user", user.ID)
	}
	delete(connections.UserConnections, user.ID)

	connections.Mutex.Unlock()
}
