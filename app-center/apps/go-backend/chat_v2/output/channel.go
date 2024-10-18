package output

import "go-backend/chat_v2/models"

type ChannelAction string

const (
	ActionEditChannel ChannelAction = "edit"
	ActuinGetChannel  ChannelAction = "get"
)

type OutputChannel struct {
	ID          string              `json:"id"`
	Name        string              `json:"name"`
	Description string              `json:"description"`
	ChannelType models.ChannelTypes `json:"channelType"`
	Users       []OutputUser        `json:"users"`
	Owners      []OutputUser        `json:"owners"`
	CreatedAt   string              `json:"createdAt"`
	UpdateAt    string              `json:"updateAt"`
}

type OutputChannels struct {
	Type     ChannelAction   `json:"type"`
	Channels []OutputChannel `json:"channels"`
}
