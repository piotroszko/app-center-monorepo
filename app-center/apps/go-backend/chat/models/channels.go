package models

type ChannelType string

const (
	PrivateType ChannelType = "private"
	GroupType   ChannelType = "group"
	RoomType    ChannelType = "room"
)
