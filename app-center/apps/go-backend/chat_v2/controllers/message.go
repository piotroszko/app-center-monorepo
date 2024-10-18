package controllers

import (
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
)

func GetMessagesNewest(user *models.User, msg input.ParsedGetNewMessages) error {
	return nil
}

func GetMessagesHistory(user *models.User, msg input.ParsedGetOlderMessages) error {
	return nil
}

func AddMessage(user *models.User, msg input.ParsedAddMessage) error {
	return nil
}

func AnswerMessage(user *models.User, msg input.ParsedAnswerMessage) error {
	return nil
}

func EditMessage(user *models.User, msg input.ParsedActionEditMessage) error {
	return nil
}

func DeleteMessage(user *models.User, msg input.ParsedActionDeleteMessage) error {
	return nil
}
