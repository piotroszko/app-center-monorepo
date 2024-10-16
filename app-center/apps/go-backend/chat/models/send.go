package models

import (
	"go-backend/prisma/db"
	"sort"
	"time"
)

func SortMessages(msgs []db.MessageModel) []db.MessageModel {
	sort.Slice(msgs, func(i, j int) bool {
		return msgs[i].CreatedAt.Unix() > msgs[j].CreatedAt.Unix()
	})
	return msgs
}

type ParsedMessage struct {
	ID        int       `json:"id"`
	ChannelID string    `json:"channelId"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	User      ParsedUser
}

type ParsedMessages struct {
	ChannelID string          `json:"channelId"`
	Messages  []ParsedMessage `json:"messages"`
}

func ParseMessage(message *db.MessageModel) ParsedMessage {
	return ParsedMessage{
		ID:        message.ID,
		Content:   message.Content,
		CreatedAt: message.CreatedAt,
		User:      ParseDbUser(*message.User()),
		ChannelID: message.ChannelID,
	}
}

func ParseMessages(channelId string, messages []db.MessageModel) ParsedMessages {
	messages = SortMessages(messages)
	parsedMessages := make([]ParsedMessage, 0)
	for _, message := range messages {
		parsedMessages = append(parsedMessages, ParseMessage(&message))
	}
	return ParsedMessages{
		ChannelID: channelId,
		Messages:  parsedMessages,
	}
}

type ParsedUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type ParsedChannel struct {
	ID        string       `json:"id"`
	Name      string       `json:"name"`
	CreatedAt time.Time    `json:"createdAt"`
	Type      string       `json:"type"`
	Users     []ParsedUser `json:"users"`
	Owners    []ParsedUser `json:"owners"`
}

func ParseDbUser(user db.UserModel) ParsedUser {
	return ParsedUser{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}
}
func ParseDbChannel(channel db.ChannelModel) ParsedChannel {
	obj := ParsedChannel{
		ID:        channel.ID,
		Name:      channel.Name,
		CreatedAt: channel.CreatedAt,
		Type:      channel.Type,
	}
	parsedUsers := make([]ParsedUser, 0)
	for _, user := range channel.User() {
		parsedUsers = append(parsedUsers, ParseDbUser(user))
	}
	obj.Users = parsedUsers

	parsedOwners := make([]ParsedUser, 0)
	for _, owner := range channel.UserOwners() {
		parsedOwners = append(parsedOwners, ParseDbUser(owner))
	}
	obj.Owners = parsedOwners

	return obj
}

func ParseDbChannels(channels []db.ChannelModel) []ParsedChannel {
	parsedChannels := make([]ParsedChannel, 0)
	for _, channel := range channels {
		parsedChannels = append(parsedChannels, ParseDbChannel(channel))
	}
	return parsedChannels
}
