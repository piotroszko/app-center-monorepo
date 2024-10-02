package store_chat

import (
	"fmt"
	db_chat "go-backend/chat/db"
	"go-backend/prisma/db"
)

type storeChannel struct{}

var Channel storeChannel

func (storeChannel) GetChannels(userId string) ([]db.ChannelModel, error) {
	fmt.Println("GetChannels")
	channels, err := db_chat.Channel.GetChannelsForUser(userId)
	fmt.Println("Channels:", channels)
	if err != nil {
		return nil, err
	}
	fmt.Println("Channels2:", channels)
	return channels, nil
}

func (storeChannel) CreateRoom(name string, userId string) (*db.ChannelModel, error) {
	fmt.Println("CreateRoom")
	channel, err := db_chat.Channel.CreateRoomChannel(name, userId)
	if err != nil {
		return nil, err
	}
	return channel, nil
}
