package state

import (
	db_chat "go-backend/chat_v2/state/db"
	"go-backend/prisma/db"
)

type messageType struct{}

var Message = messageType{}

// TODO: Add cache for checking against

func (messageType) CreateMessage(channelId string, userId string, message string) (*db.MessageModel, error) {
	msg, err := db_chat.AddMessage(channelId, userId, message)
	if err != nil {
		return &db.MessageModel{}, err
	}
	return msg, nil
}

func (messageType) CreateAnswer(channelId string, userId string, message string, parentId int) (*db.MessageModel, error) {
	msg, err := db_chat.AnswerMessage(channelId, userId, message, parentId)
	if err != nil {
		return &db.MessageModel{}, err
	}
	return msg, nil
}

func (messageType) GetNewestMessagesForChannel(channelId string, limit int) ([]db.MessageModel, error) {
	messages, err := db_chat.GetNewestMessages(channelId, limit)
	if err != nil {
		return []db.MessageModel{}, err
	}
	return messages, nil
}

func (messageType) GetOlderMessagesForChannel(channelId string, limit int, before int) ([]db.MessageModel, error) {
	messages, err := db_chat.GetOlderMessages(channelId, before, limit)
	if err != nil {
		return []db.MessageModel{}, err
	}
	return messages, nil
}

func (messageType) DeleteMessage(userId string, messageId int) error {
	_, err := db_chat.FlagDeleteMessage(userId, messageId)
	if err != nil {
		return err
	}
	return nil
}

func (messageType) EditMessage(messageId int, message string) error {
	_, err := db_chat.EditMessage(messageId, message)
	if err != nil {
		return err
	}
	return nil
}
