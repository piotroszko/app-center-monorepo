package input

type PayloadType string

const (
	GetMessagePayload    PayloadType = "getMessage"
	NewMessagePayload    PayloadType = "newMessage"
	ActionMessagePayload PayloadType = "actionMessage"
	InviteMessagePayload PayloadType = "inviteMessage"
	ChannelActionPayload PayloadType = "channelAction"
	ChannelGetPayload    PayloadType = "channelGet"
)

// History types
type MessageHistoryType string

const (
	NewestMessages MessageHistoryType = "newest"
	OlderMessages  MessageHistoryType = "history"
)

// New message types
type MessageNewType string

const (
	AddMessage    MessageNewType = "new"
	AnswerMessage MessageNewType = "answer"
)

// Message action types
type MessageActionType string

const (
	EditMessage   MessageActionType = "edit"
	DeleteMessage MessageActionType = "delete"
)

// Invites types for channels
type InviteType string

const (
	AcceptInvite  InviteType = "accept"
	DeclineInvite InviteType = "decline"
	SendInvite    InviteType = "send"
	GetInvites    InviteType = "get"
)

// Channels actions

type ChannelActionType string

const (
	CreateChannel ChannelActionType = "create"
	DeleteChannel ChannelActionType = "delete"
	EditChannel   ChannelActionType = "edit"
	LeaveChannel  ChannelActionType = "leave"
)

// Channel get types

type ChannelGetType string

const (
	GetChannelsForMe ChannelGetType = "get-for-me"
	GetPublic        ChannelGetType = "get-public"
)
