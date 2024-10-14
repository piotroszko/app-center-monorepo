package helpers_chat

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

type ParsedUsers struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type ParsedChannel struct {
	ID        string        `json:"id"`
	Name      string        `json:"name"`
	CreatedAt time.Time     `json:"createdAt"`
	Type      string        `json:"type"`
	Users     []ParsedUsers `json:"users"`
	Owners    []ParsedUsers `json:"owners"`
}

func ParseDbUser(user db.UserModel) ParsedUsers {
	return ParsedUsers{
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
	parsedUsers := make([]ParsedUsers, 0)
	for _, user := range channel.User() {
		parsedUsers = append(parsedUsers, ParseDbUser(user))
	}
	obj.Users = parsedUsers

	parsedOwners := make([]ParsedUsers, 0)
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
