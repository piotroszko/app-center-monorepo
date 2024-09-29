package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/lxzan/gws"
)

func main() {
	upgrader := gws.NewUpgrader(&Handler{}, &gws.ServerOption{
		ParallelEnabled: true,
		Recovery:        gws.Recovery,
	})
	http.HandleFunc("/connect", func(writer http.ResponseWriter, request *http.Request) {
		channel := request.URL.Query().Get("channel")

		writer.Header().Set("Access-Control-Allow-Origin", "*")
		fmt.Println("New connection")
		socket, err := upgrader.Upgrade(writer, request)

		socket.Session().Store("channel", channel)
		if err != nil {
			return
		}
		go func() {
			socket.ReadLoop()
		}()
	})
	http.ListenAndServe(":4000", nil)
}

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
	channel, exist := socket.Session().Load("channel")
	if !exist {
		return
	}

	parsedData := strings.TrimSpace(strings.Replace(string(message.Bytes()), "\x00", "", -1))
	// check what type of message it is
	if strings.HasPrefix(parsedData, "{") && strings.HasSuffix(parsedData, "}") {
		if !strings.Contains(parsedData, "\"type\":\"") {
			return
		}
		// parse the message
		if strings.Contains(parsedData, "\"type\":\"init\"") {
			jsonData := json.RawMessage(parsedData)
			var input InputInit = InputInit{}
			err := json.Unmarshal(jsonData, &input)

			if err != nil || input.Token == "" || input.LastMessageId == "" {
				errorMsg := OutputError{Code: 400, Error: "Invalid request"}
				socket.WriteMessage(message.Opcode, []byte(fmt.Sprintf(`{"code":%d,"error":"%s"}`, errorMsg.Code, errorMsg.Error)))
				return
			}
			fmt.Println("Init message received", input.Token, input.LastMessageId, channel)
		}
		if strings.Contains(parsedData, "\"type\":\"message\"") {
			jsonData := json.RawMessage(parsedData)
			var input InputMessage = InputMessage{}
			err := json.Unmarshal(jsonData, &input)

			if err != nil || input.Token == "" || input.Content == "" {
				errorMsg := OutputError{Code: 400, Error: "Invalid request"}
				socket.WriteMessage(message.Opcode, []byte(fmt.Sprintf(`{"code":%d,"error":"%s"}`, errorMsg.Code, errorMsg.Error)))
				return
			}
			fmt.Println("Message received", input.Token, input.Content, channel)
		}
		if strings.Contains(parsedData, "\"type\":\"typing\"") {
			jsonData := json.RawMessage(parsedData)
			var input InputTyping = InputTyping{}
			err := json.Unmarshal(jsonData, &input)

			if err != nil || input.Token == "" {
				errorMsg := OutputError{Code: 400, Error: "Invalid request"}
				socket.WriteMessage(message.Opcode, []byte(fmt.Sprintf(`{"code":%d,"error":"%s"}`, errorMsg.Code, errorMsg.Error)))
				return
			}
			fmt.Println("Typing received", input.Token, channel)
		}
	}
	socket.WriteMessage(message.Opcode, message.Bytes())
}

type InputInit struct {
	Type string `json:"type"`

	Token         string `json:"token"`
	LastMessageId string `json:"last_message_id"`
}
type InputMessage struct {
	Type string `json:"type"`

	Token   string `json:"token"`
	Content string `json:"content"`
}
type InputTyping struct {
	Type string `json:"type"`

	Token string
}

// /
type OutputInit struct {
	Messages []OutputMessage `json:"messages"`
}
type OutputMessage struct {
	UserId    string `json:"user"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}

type OutputError struct {
	Code  int    `json:"code"`
	Error string `json:"error"`
}
