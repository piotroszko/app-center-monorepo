package input

import "go-backend/chat_v2/models"

type RawPayload struct {
	Type          PayloadType   `json:"type"`
	GetMessage    GetMessage    `json:"getMessage"`
	NewMessage    NewMessage    `json:"newMessage"`
	ActionMessage ActionMessage `json:"actionMessage"`

	InviteChannel InviteChannel `json:"inviteChannel"`
	ActionChannel ActionChannel `json:"actionChannel"`
	GetChannel    GetChannel    `json:"getChannel"`
}

// Struct for the payload of the request that gets messages for channel.
//
// Either:
//
// - Newest: MessageId is empty, Amount is the number of messages to get from the newest.
//
// - Older: MessageId is the id of the message to start from, Amount is the number of messages to get from that message.
type GetMessage struct {
	Type      MessageHistoryType `json:"type"`
	ChannelId string             `json:"channelId"`
	MessageId int                `json:"messageId"`
	Amount    int                `json:"amount"`
}

// Struct for the payload of the request that sends a new message to a channel.
//
// AnswerToId is the id of the message that this message is an answer to = empty if it's not an answer.
type NewMessage struct {
	Type       MessageNewType `json:"type"`
	ChannelId  string         `json:"channelId"`
	Data       string         `json:"data"`
	AnswerToId int            `json:"answerToId"`
}

// Struct for the payload of the request that sends an action to a message.
//
// - Edit: MessageId is the id of the message to edit, Data is the new data.
//
// - Delete: MessageId is the id of the message to delete or ids of the messages to delete.
type ActionMessage struct {
	Type        MessageActionType `json:"actionType"`
	MessageId   int               `json:"messageId"`
	MessagesIds []int             `json:"messagesIds"`
	Data        string            `json:"data"`
	ChannelId   string            `json:"channelId"`
}

// Struct for the payload of the request that sends an invite to a channel.
//
// - Accept: InviteId is the id of the invite to accept.
//
// - Decline: InviteId is the id of the invite to decline.
//
// - Send: ChannelId is the id of the channel to send the invite to, UserId is the id of the user to send the invite to, Data is an optional message to the user.
type InviteChannel struct {
	Type      InviteType `json:"type"`
	InviteId  string     `json:"inviteId"`  // used for accepting and declining invites
	ChannelId string     `json:"channelId"` // used for sending invites
	UserId    string     `json:"userId"`    // used for sending invites
	Data      string     `json:"data"`      // used for sending invites - optional message to the user that is invited

}

// Struct for the payload of the request that sends an action to a channel.
//
// - Create: Private, Group and Public channels have different fields.
//
// - Delete: ChannelId is the id of the channel to delete.
//
// - Edit: ChannelId is the id of the channel to edit, Name and Description are the new name and description.
//
// - Leave: ChannelId is the id of the channel to leave.
type ActionChannel struct {
	Type        ChannelActionType   `json:"type"`
	ChannelType models.ChannelTypes `json:"channelType"`
	ChannelId   string              `json:"channelId"`   // used for delete, edit and leave
	Name        string              `json:"name"`        // used for create and edit
	Description string              `json:"description"` // used for create and edit
	UsersIds    []string            `json:"usersIds"`    // used for create-group as automative invite for users
}

// Struct for the payload of the request that gets channels.
type GetChannel struct {
	Type ChannelGetType `json:"type"`
}
