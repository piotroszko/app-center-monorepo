package models

import "encoding/json"

type Message struct {
	ID   string      `json:"id"`
	Type MessageType `json:"type"`

	SenderID   string `json:"senderID"`
	SenderName string `json:"senderName"`

	ChannelID string `json:"receiverID"`

	TargetMessageId string `json:"targetMessageId"`
	Amount          int    `json:"amount"`
	Content         string `json:"content"`
	Timestamp       int64  `json:"timestamp"`
}

func (m *Message) FromJSON(data []byte) error {
	return json.Unmarshal(data, m)
}
func (m *Message) ToString() (string, error) {
	data, err := json.Marshal(m)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

type MessageType string

const (
	JoinRoomType       MessageType = "join"
	LeaveRoomType      MessageType = "leave"
	ChatMessageType    MessageType = "message"
	GetNewestType      MessageType = "get-newest"
	GetHistoryType     MessageType = "get-history"
	GetChannelsType    MessageType = "get-channels"
	DeleteMessageType  MessageType = "delete"
	DeleteRoomType     MessageType = "delete-room"
	CreateRoomType     MessageType = "create-room"
	CreateGroupType    MessageType = "create-group"
	PrivateMessageType MessageType = "create-private"
)
