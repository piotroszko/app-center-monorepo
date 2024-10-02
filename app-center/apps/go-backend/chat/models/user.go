package models

import (
	"sync"

	"github.com/gofiber/contrib/websocket"
)

type User struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Connection      *websocket.Conn
	ConnectionMutex *sync.Mutex
}
