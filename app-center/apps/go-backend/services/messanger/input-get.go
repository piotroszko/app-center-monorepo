package messanger

import (
	"encoding/json"
	"errors"
	"strings"
)

type InputGet struct {
	Type string `json:"type"`

	Token         string `json:"token"`
	Amount        int    `json:"amount"`
	FromMessageId string `json:"from_message_id"` // optional
}

func IsGetType(message string) bool {
	return strings.Contains(message, "\"type\":\"get\"")
}

func (i *InputGet) Parse(data string) error {
	jsonData := json.RawMessage(data)
	var input InputGet = InputGet{}
	err := json.Unmarshal(jsonData, &input)
	if err != nil {
		return err
	}
	if input.Token == "" || input.Amount < 0 {
		return errors.New("invalid request")
	}
	i.Token = input.Token
	i.Amount = input.Amount
	i.Type = input.Type
	i.FromMessageId = input.FromMessageId
	return nil
}
