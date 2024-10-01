package store_chat

import (
	"errors"
	db_chat "go-backend/chat/db"
	"go-backend/chat/models"
	"go-backend/prisma/db"
)

type storeMessage struct{}

var Message storeMessage

func (storeMessage) AddMessage(msg models.Message) ([]db.UserModel, error) {
	channelId := msg.ChannelID
	users, err := db_chat.Channel.GetUsersForChannel(channelId)
	if err != nil {
		return nil, err
	}
	userFound := false
	for _, user := range users {
		if user.ID == msg.SenderID {
			userFound = true
			break
		}
	}
	if !userFound {
		return nil, errors.New("user not in channel")
	}

	db_chat.Message.AddMessage(msg)

	return users, nil
}
