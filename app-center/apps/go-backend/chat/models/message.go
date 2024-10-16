package models

import (
	"encoding/json"
)

type MessageRaw struct {
	ID   int         `json:"id"`
	Type MessageType `json:"type"`

	SenderID   string `json:"senderID"`
	SenderName string `json:"senderName"`

	ChannelID       string `json:"channelID"`
	TargetID        string `json:"targetID"`
	TargetMessageId int    `json:"targetMessageID"`

	Amount  int    `json:"amount"`
	Content string `json:"content"`
}

func (m *MessageRaw) FromJSON(data []byte) error {
	return json.Unmarshal(data, m)
}
func (m *MessageRaw) ToString() (string, error) {
	data, err := json.Marshal(m)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

type MessageType string

const (
	JoinRoomType   MessageType = "join"
	LeaveRoomType  MessageType = "leave"
	InviteType     MessageType = "invite"
	GetInvitesType MessageType = "get-invites"

	ChatMessageType MessageType = "message"
	GetNewestType   MessageType = "get-newest"
	GetHistoryType  MessageType = "get-history"

	GetChannelsType MessageType = "get-channels"

	DeleteMessageType MessageType = "delete"
	DeleteRoomType    MessageType = "delete-room"

	CreateRoomType     MessageType = "create-room"
	CreateGroupType    MessageType = "create-group"
	PrivateMessageType MessageType = "create-private"
)
