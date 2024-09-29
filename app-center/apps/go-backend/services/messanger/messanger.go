package messanger

import (
	"fmt"
	"strings"
	"time"

	"github.com/lxzan/gws"
)

type Handler struct{}

func (c *Handler) OnOpen(socket *gws.Conn) {
	_ = socket.SetDeadline(time.Now().Add(time.Minute * 20))
}

func (c *Handler) OnClose(socket *gws.Conn, err error) {
	fmt.Println("Connection closed:", err)
}

func (c *Handler) OnPing(socket *gws.Conn, payload []byte) {}

func (c *Handler) OnPong(socket *gws.Conn, payload []byte) {}

func (c *Handler) OnMessage(socket *gws.Conn, message *gws.Message) {
	defer message.Close()
	channel, err := GetChannel(socket)
	if err != nil {
		return
	}

	parsedData, err := TrimAndPrepareData(message.Bytes())
	if err == nil {
		if !strings.Contains(parsedData, "\"type\":\"") {
			return
		}
		if IsInputInitType(parsedData) {
			input := InputInit{}
			err := input.Parse(parsedData)

			if err != nil {
				SendInvalidRequest(socket, message)
				return
			}
			fmt.Println("Init message received", input.Token, input.LastMessageId, channel)
		}
		if IsInputMessageType(parsedData) {
			input := InputMessage{}
			err := input.Parse(parsedData)

			if err != nil {
				SendInvalidRequest(socket, message)
				return
			}
			fmt.Println("Message received", input.Token, input.Content, channel)
		}
		if IsInputTypingType(parsedData) {
			input := InputTyping{}
			err := input.Parse(parsedData)

			if err != nil {
				SendInvalidRequest(socket, message)
				return
			}
			fmt.Println("Typing received", input.Token, channel)
		}
	}
}
