package store_chat

import (
	"errors"
	db_chat "go-backend/chat/db"
	"go-backend/chat/models"
	"go-backend/prisma/db"
)

type storeMessage struct{}

var Message storeMessage

func (storeMessage) AddMessage(msg models.MessageRaw) ([]db.UserModel, models.ParsedMessage, error) {
	channelId := msg.ChannelID
	users, err := db_chat.Channel.GetUsersForChannel(channelId)
	if err != nil {
		return nil, models.ParsedMessage{}, err
	}
	userFound := false
	for _, user := range users {
		if user.ID == msg.SenderID {
			userFound = true
			break
		}
	}
	if !userFound {
		return nil, models.ParsedMessage{}, errors.New("user not in channel")
	}

	msgDb, err := db_chat.Message.AddMessage(msg)
	if err != nil {
		return nil, models.ParsedMessage{}, err
	}

	return users, models.ParseMessage(msgDb), nil
}

func (storeMessage) GetMessages(channelID string, amount int) (models.ParsedMessages, error) {
	msgs, err := db_chat.Message.GetMessages(channelID, amount)
	if err != nil {
		return models.ParsedMessages{}, err
	}
	return models.ParseMessages(channelID, msgs), nil
}

func (storeMessage) GetMessagesAfter(channelID string, messageID int, amount int) (models.ParsedMessages, error) {
	msgs, err := db_chat.Message.GetMessagesAfter(channelID, messageID, amount)
	if err != nil {
		return models.ParsedMessages{}, err
	}
	return models.ParseMessages(channelID, msgs), nil
}
