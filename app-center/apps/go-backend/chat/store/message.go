package store_chat

import (
	"errors"
	db_chat "go-backend/chat/db"
	"go-backend/chat/models"
	"go-backend/prisma/db"
)

type storeMessage struct{}

var Message storeMessage

func (storeMessage) AddMessage(msg models.Message) ([]db.UserModel, *db.MessageModel, error) {
	channelId := msg.ChannelID
	users, err := db_chat.Channel.GetUsersForChannel(channelId)
	if err != nil {
		return nil, &db.MessageModel{}, err
	}
	userFound := false
	for _, user := range users {
		if user.ID == msg.SenderID {
			userFound = true
			break
		}
	}
	if !userFound {
		return nil, &db.MessageModel{}, errors.New("user not in channel")
	}

	msgDb, err := db_chat.Message.AddMessage(msg)
	if err != nil {
		return nil, &db.MessageModel{}, err
	}

	return users, msgDb, nil
}

func (storeMessage) GetMessages(channelID string, amount int) ([]db.MessageModel, error) {
	return db_chat.Message.GetMessages(channelID, amount)
}

func (storeMessage) GetMessagesAfter(channelID string, messageID string, amount int) ([]db.MessageModel, error) {
	return db_chat.Message.GetMessagesAfter(channelID, messageID, amount)
}
