package output

import (
	"go-backend/chat_v2/models"
	"go-backend/prisma/db"
	"slices"
)

type ChannelAction string

const (
	ActionEditChannel    ChannelAction = "edit"
	ActionGetChannel     ChannelAction = "get"
	ActionNewChannel     ChannelAction = "new"
	ActionDeleteChannel  ChannelAction = "delete"
	ActionLeaveChannel   ChannelAction = "leave"
	ActionJoinChannel    ChannelAction = "join"
	ActionPublicsChannel ChannelAction = "publics"
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

func getAllUsersToSendMessage(channel *db.ChannelModel) []string {
	var usersIdsToSend []string
	for _, user := range channel.User() {
		usersIdsToSend = append(usersIdsToSend, user.ID)
	}
	for _, owner := range channel.UserOwners() {
		if !slices.Contains(usersIdsToSend, owner.ID) {
			usersIdsToSend = append(usersIdsToSend, owner.ID)
		}
	}
	return usersIdsToSend
}

func SendNewChannel(channel *db.ChannelModel) {
	var outputUsers []OutputUser
	var outputOwners []OutputUser
	for _, user := range channel.User() {
		outputUsers = append(outputUsers, OutputUser{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
	}
	for _, owner := range channel.UserOwners() {
		outputOwners = append(outputOwners, OutputUser{
			ID:    owner.ID,
			Name:  owner.Name,
			Email: owner.Email,
		})
	}

	outputChannel := OutputChannel{
		ID:          channel.ID,
		Name:        channel.Name,
		Description: channel.Description,
		ChannelType: models.ChannelTypes(channel.Type),
		Users:       outputUsers,
		Owners:      outputOwners,
		CreatedAt:   channel.CreatedAt.String(),
		UpdateAt:    channel.UpdatedAt.String(),
	}
	outputObject := OutputChannels{
		Type:     ActionNewChannel,
		Channels: []OutputChannel{outputChannel},
	}

	SendMessage(outputObject, getAllUsersToSendMessage(channel)...)
}

func SendDeletedChannel(channel *db.ChannelModel) {
	outputChannel := OutputChannel{
		ID: channel.ID,
	}
	outputObject := OutputChannels{
		Type:     ActionDeleteChannel,
		Channels: []OutputChannel{outputChannel},
	}

	SendMessage(outputObject, getAllUsersToSendMessage(channel)...)
}

func SendEditedChannel(channel *db.ChannelModel) {
	outputChannel := OutputChannel{
		ID:          channel.ID,
		Name:        channel.Name,
		Description: channel.Description,
		ChannelType: models.ChannelTypes(channel.Type),
		CreatedAt:   channel.CreatedAt.String(),
		UpdateAt:    channel.UpdatedAt.String(),
	}
	outputObject := OutputChannels{
		Type:     ActionEditChannel,
		Channels: []OutputChannel{outputChannel},
	}

	SendMessage(outputObject, getAllUsersToSendMessage(channel)...)
}

func SendLeftChannel(channel *db.ChannelModel, userId string) {
	outputChannel := OutputChannel{
		ID: channel.ID,
	}
	outputObject := OutputChannels{
		Type:     ActionLeaveChannel,
		Channels: []OutputChannel{outputChannel},
	}

	SendMessage(outputObject, userId)
}

func SendChannelsToUser(channels []db.ChannelModel, userId string, isPublics bool) {
	var outputChannels []OutputChannel
	for _, channel := range channels {
		var outputUsers []OutputUser
		var outputOwners []OutputUser
		for _, user := range channel.User() {
			outputUsers = append(outputUsers, OutputUser{
				ID:    user.ID,
				Name:  user.Name,
				Email: user.Email,
			})
		}
		for _, owner := range channel.UserOwners() {
			outputOwners = append(outputOwners, OutputUser{
				ID:    owner.ID,
				Name:  owner.Name,
				Email: owner.Email,
			})
		}
		outputChannels = append(outputChannels, OutputChannel{
			ID:          channel.ID,
			Name:        channel.Name,
			Description: channel.Description,
			ChannelType: models.ChannelTypes(channel.Type),
			Users:       outputUsers,
			Owners:      outputOwners,
			CreatedAt:   channel.CreatedAt.String(),
			UpdateAt:    channel.UpdatedAt.String(),
		})
	}

	var outputObject OutputChannels
	if isPublics {
		outputObject = OutputChannels{
			Type:     ActionPublicsChannel,
			Channels: outputChannels,
		}
	} else {
		outputObject = OutputChannels{
			Type:     ActionGetChannel,
			Channels: outputChannels,
		}
	}

	SendMessage(outputObject, userId)
}

func SendJoinChannel(channel *db.ChannelModel, userId string) {
	var outputUsers []OutputUser
	var outputOwners []OutputUser
	for _, user := range channel.User() {
		outputUsers = append(outputUsers, OutputUser{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		})
	}
	for _, owner := range channel.UserOwners() {
		outputOwners = append(outputOwners, OutputUser{
			ID:    owner.ID,
			Name:  owner.Name,
			Email: owner.Email,
		})
	}

	outputChannel := OutputChannel{
		ID:          channel.ID,
		Name:        channel.Name,
		Description: channel.Description,
		ChannelType: models.ChannelTypes(channel.Type),
		Users:       outputUsers,
		Owners:      outputOwners,
		CreatedAt:   channel.CreatedAt.String(),
		UpdateAt:    channel.UpdatedAt.String(),
	}
	outputObject := OutputChannels{
		Type:     ActionJoinChannel,
		Channels: []OutputChannel{outputChannel},
	}

	SendMessage(outputObject, userId)
}
