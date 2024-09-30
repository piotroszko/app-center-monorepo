package messanger

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lxzan/gws"
)

var channelsMessages = make(map[string]Messages)
var channelsClients = make(map[string][]*gws.Conn)

type Handler struct{}

func (c *Handler) OnOpen(socket *gws.Conn) {
	channel, err := GetChannel(socket)
	if err != nil {
		code := uint16(1000)
		socket.WriteClose(code, []byte{})
		return
	}
	_, ok := channelsMessages[channel]
	if !ok {
		channelsMessages[channel] = Messages{}
	}

	_ = socket.SetDeadline(time.Now().Add(time.Minute * 20))
}

func (c *Handler) OnClose(socket *gws.Conn, err error) {
	fmt.Println("Connection closed:", err)
	channel, err := GetChannel(socket)
	id, _ := GetId(socket)
	if err != nil {
		return
	}
	indexToDelete := -1
	clients, ok := channelsClients[channel]
	if ok {
		for i, client := range clients {
			clientId, _ := GetId(client)
			if clientId == id {
				indexToDelete = i
				break
			}
		}
		if indexToDelete != -1 {
			channelsClients[channel] = append(clients[:indexToDelete], clients[indexToDelete+1:]...)
		}
	}

}

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
		if IsGetType(parsedData) {
			input := InputGet{}
			err := input.Parse(parsedData)

			if err != nil {
				SendInvalidRequest(socket, message)
				return
			}
			fmt.Println("Get message received", input.Token, input.Amount, input.FromMessageId, channel)
			// if there is no last message id in request then return "amount" of last messages
			messages, ok := channelsMessages[channel]
			if !ok {
				return
			}

			amount := input.Amount
			if amount == 0 {
				amount = 10
			}
			if amount > len(messages) {
				amount = len(messages)
			}
			if input.FromMessageId == "" {
				messagesToSend := messages.GetAmount(amount)
				jsonData, err := messagesToSend.ToJsonOutputGet()
				if err != nil {
					return
				}
				_ = socket.WriteMessage(message.Opcode, jsonData)
				return
			} else {
				messagesToSend, err := messages.GetAmountFromId(input.FromMessageId, amount)
				if err != nil {
					return
				}
				jsonData, errJson := messagesToSend.ToJsonOutputGet()
				if errJson != nil {
					return
				}

				_ = socket.WriteMessage(message.Opcode, jsonData)
			}
		}
		if IsMessageType(parsedData) {
			input := InputMessage{}
			err := input.Parse(parsedData)

			if err != nil {
				SendInvalidRequest(socket, message)
				return
			}

			var msg Message = Message{
				Id:        uuid.New().String(),
				User:      "user_id",
				Content:   input.Content,
				CreatedAt: time.Now().Format("2006-01-02T15:04:05.999Z"),
			}

			_, ok := channelsMessages[channel]
			if !ok {
				channelsMessages[channel] = Messages{}
			}
			channelsMessages[channel] = append(channelsMessages[channel], msg)

			clients, ok := channelsClients[channel]
			if ok {
				msgJson, err := json.Marshal(msg)
				if err != nil {
					return
				}
				for _, client := range clients {
					_ = client.WriteMessage(message.Opcode, msgJson)
				}
			}

		}
		if IsTypingType(parsedData) {
			input := InputTyping{}
			err := input.Parse(parsedData)

			if err != nil {
				SendInvalidRequest(socket, message)
				return
			}
			fmt.Println("Typing received", input.Token, channel)
			// TODO: implement typing
		}
	}
}

func (c *Handler) OnPing(socket *gws.Conn, payload []byte) {}

func (c *Handler) OnPong(socket *gws.Conn, payload []byte) {}
