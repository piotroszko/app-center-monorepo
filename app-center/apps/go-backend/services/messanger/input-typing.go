package messanger

import (
	"encoding/json"
	"strings"
)

type InputTyping struct {
	Type string `json:"type"`

	Token string
}

func IsInputTypingType(message string) bool {
	return strings.Contains(message, "\"type\":\"typing\"")
}

func (i *InputTyping) Parse(data string) error {
	jsonData := json.RawMessage(data)
	var input InputTyping = InputTyping{}
	err := json.Unmarshal(jsonData, &input)
	i.Token = input.Token
	i.Type = input.Type

	return err
}
