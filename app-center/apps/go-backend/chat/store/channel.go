package store_chat

import (
	db_chat "go-backend/chat/db"
	"go-backend/chat/models"
	"go-backend/prisma/db"
)

type storeChannel struct{}

var Channel storeChannel

func (storeChannel) GetChannels(userId string) ([]models.ParsedChannel, error) {
	channels, err := db_chat.Channel.GetChannelsForUser(userId)
	if err != nil {
		return nil, err
	}
	return channels, nil
}

func (storeChannel) CreateRoom(name string, userId string) (*db.ChannelModel, error) {
	channel, err := db_chat.Channel.CreateRoomChannel(name, userId)
	if err != nil {
		return nil, err
	}
	return channel, nil
}

func (storeChannel) GetInvites(userId string) ([]models.ParsedChannelInvite, error) {
	channels, err := db_chat.Channel.GetInvitesForUser(userId)
	if err != nil {
		return nil, err
	}
	return channels, nil
}

func (storeChannel) SendInvite(channelId string, inviterId string, userId string) error {
	_, err := db_chat.Channel.CreateInvite(channelId, inviterId, userId)
	if err != nil {
		return err
	}
	return nil
}
