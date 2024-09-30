package models

import "encoding/json"

type Message struct {
	ID          string      `json:"id"`
	Type        MessageType `json:"type"`
	ChannelType string      `json:"channelType"` // type of channel: private message, group message, public room

	SenderID   string `json:"senderID"`
	SenderName string `json:"senderName"`

	ReceiverID   string `json:"receiverID"`
	ReceiverName string `json:"receiverName"`
	GroupID      string `json:"groupID"`
	GroupName    string `json:"groupName"`
	RoomID       string `json:"roomID"`
	RoomName     string `json:"roomName"`

	TargetMessageId string `json:"targetMessageId"`
	Content         string `json:"content"`
	Timestamp       int64  `json:"timestamp"`
}

func (m *Message) FromJSON(data []byte) error {
	return json.Unmarshal(data, m)
}

type MessageType string

const (
	JoinRoomType      MessageType = "join"
	LeaveRoomType     MessageType = "leave"
	ChatMessageType   MessageType = "message"
	GetNewestType     MessageType = "get-newest"
	GetHistoryType    MessageType = "get-history"
	DeleteMessageType MessageType = "delete"
	DeleteRoomType    MessageType = "delete-room"
)
