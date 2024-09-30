package messanger

import (
	"encoding/json"
	"errors"
	"strings"
)

type InputMessage struct {
	Type string `json:"type"`

	Token   string `json:"token"`
	Content string `json:"content"`
}

func IsMessageType(message string) bool {
	return strings.Contains(message, "\"type\":\"message\"")
}

func (i *InputMessage) Parse(data string) error {
	jsonData := json.RawMessage(data)
	var input InputMessage = InputMessage{}
	err := json.Unmarshal(jsonData, &input)
	if err != nil {
		return err
	}
	if input.Token == "" || input.Content == "" {
		return errors.New("invalid request")
	}
	i.Token = input.Token
	i.Content = input.Content
	i.Type = input.Type
	return nil
}
