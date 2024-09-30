package messanger

import (
	"encoding/json"
	"errors"
)

type Messages []Message

type OutputGet struct {
	Type     string   `json:"type"`
	Messages Messages `json:"messages"`
}

func (ms *Messages) Find(id string) int {
	for i, m := range *ms {
		if m.Id == id {
			return i
		}
	}
	return -1
}

func (ms *Messages) GetAmount(amount int) Messages {
	if amount > len(*ms) {
		amount = len(*ms)
	}
	return (*ms)[len(*ms)-amount:]
}

func (ms *Messages) GetAmountFromId(id string, amount int) (Messages, error) {
	index := ms.Find(id)
	if index == -1 {
		return nil, errors.New("message not found")
	}
	if index < amount {
		amount = index
	}
	return (*ms)[index-amount : index], nil
}

func (ms *Messages) ToJson() ([]byte, error) {
	return json.Marshal(ms)
}

func (ms *Messages) ToJsonOutputGet() ([]byte, error) {
	return json.Marshal(&OutputGet{
		Type:     "messages",
		Messages: *ms,
	})
}

type Message struct {
	Id        string `json:"id"`
	User      string `json:"user"` // user id
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}
