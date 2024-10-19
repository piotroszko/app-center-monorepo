package state

import (
	"errors"
	db_chat "go-backend/chat_v2/state/db"
	"go-backend/prisma/db"
)

type channelType struct{}

var Channel = channelType{}

// TODO: Add cache for checking against

func (channelType) CreatePrivateChannel(name string, firstUserId string, secondUserId string) (*db.ChannelModel, error) {
	exist, err := db_chat.GetIfPrivateChannelExists(firstUserId, secondUserId)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	if exist {
		return &db.ChannelModel{}, errors.New("private channel already exists")
	}

	channel, err := db_chat.CreatePrivateChannel(name, firstUserId, secondUserId)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) CreateGroupChannel(name string, userId string, usersIds ...string) (*db.ChannelModel, error) {
	channel, err := db_chat.CreateGroupChannel(name, userId, usersIds...)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) CreatePublicChannel(name string, userId string, usersIds ...string) (*db.ChannelModel, error) {
	channel, err := db_chat.CreatePublicChannel(name, userId, usersIds...)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}
func (channelType) JoinPublicChannel(channelId string, userId string) (*db.ChannelModel, error) {
	channel, err := db_chat.AddUserToChannel(channelId, userId)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) DeleteChannel(channelId string) (*db.ChannelModel, error) {
	channel, err := db_chat.DeleteChannel(channelId)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) EditChannel(channelId string, name string, description string, userId string) (*db.ChannelModel, error) {
	channel, err := db_chat.EditChannel(channelId, name, description, userId)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) LeaveChannel(channelId string, userId string) (*db.ChannelModel, error) {
	channel, err := db_chat.LeaveChannel(channelId, userId)
	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) GetChannels(userId string) ([]db.ChannelModel, error) {
	channel, err := db_chat.GetChannels(userId)
	if err != nil {
		return []db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) GetPublicChannels(userId string) ([]db.ChannelModel, error) {
	channel, err := db_chat.GetPublicChannels(userId)
	if err != nil {
		return []db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelType) IsUserOwnerOfChannel(channelId string, userId string) (bool, error) {
	isOwner, _, err := db_chat.IsUserOwnerOfChannel(channelId, userId)
	if err != nil {
		return false, err
	}
	return isOwner, nil
}
