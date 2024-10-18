package handler

import (
	"fmt"
	"go-backend/chat_v2/controllers"
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
	"go-backend/chat_v2/output"

	"github.com/gofiber/contrib/websocket"
)

func WSHandler(conn *websocket.Conn) {
	id := conn.Locals("userID").(string)
	name := conn.Locals("userName").(string)
	user := &models.User{
		ID:         id,
		Name:       name,
		Connection: conn,
		SendJson: func(message interface{}) {
			output.SendMessage(message, id)
		},
	}
	output.AddConnection(*user, conn)
	for {
		var message input.RawPayload
		if err := conn.ReadJSON(&message); err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
				fmt.Printf("User disconnected: %v\n", user)
				break
			}
			fmt.Printf("Error reading message from websocket: %v\n", err)
			break
		}
		err := controllers.RawHandler(user, message)
		if err != nil {
			fmt.Printf("Error handling message: %v\n", err)
			break
		}
	}
	output.RemoveConnection(*user)

}
