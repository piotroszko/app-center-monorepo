package store_chat

import (
	db_chat "go-backend/chat/db"
	helpers_chat "go-backend/chat/helpers"
	"go-backend/prisma/db"
)

type storeChannel struct{}

var Channel storeChannel

func (storeChannel) GetChannels(userId string) ([]helpers_chat.ParsedChannel, error) {
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
