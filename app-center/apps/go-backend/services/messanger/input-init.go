package messanger

import (
	"encoding/json"
	"errors"
	"strings"
)

type InputInit struct {
	Type string `json:"type"`

	Token         string `json:"token"`
	LastMessageId string `json:"last_message_id"`
}

func IsInputInitType(message string) bool {
	return strings.Contains(message, "\"type\":\"init\"")
}

func (i *InputInit) Parse(data string) error {
	jsonData := json.RawMessage(data)
	var input InputInit = InputInit{}
	err := json.Unmarshal(jsonData, &input)
	if err != nil {
		return err
	}
	if input.Token == "" || input.LastMessageId == "" {
		return errors.New("invalid request")
	}
	i.Token = input.Token
	i.LastMessageId = input.LastMessageId
	i.Type = input.Type
	return nil
}
