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
type InvitesType string

const (
	AcceptInvite  InvitesType = "accept"
	DeclineInvite InvitesType = "decline"
	SendInvite    InvitesType = "send"
	GetInvites    InvitesType = "get"
)

// Channels actions

type ChannelActionType string

const (
	CreatePrivateChannel ChannelActionType = "create-private"
	CreateGroupChannel   ChannelActionType = "create-group"
	CreatePublicChannel  ChannelActionType = "create-public"
	DeleteChannel        ChannelActionType = "delete"
	EditChannel          ChannelActionType = "edit"
	LeaveChannel         ChannelActionType = "leave"
)

// Channel get types

type ChannelGetType string

const (
	GetChannelsForMe ChannelGetType = "get-channels-for-me"
	GetPublic        ChannelGetType = "get-public"
)
