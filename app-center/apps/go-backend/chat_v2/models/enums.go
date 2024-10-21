package models

type ChannelTypes string

const (
	PrivateChannel ChannelTypes = "private"
	GroupChannel   ChannelTypes = "group"
	PublicChannel  ChannelTypes = "public"
)
