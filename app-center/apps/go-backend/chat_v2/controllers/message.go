package controllers

import (
	"errors"
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
	"go-backend/chat_v2/output"
	"go-backend/chat_v2/state"
)

func GetMessagesNewest(user *models.User, msg input.ParsedGetNewMessages) error {
	msgs, err := state.Message.GetNewestMessagesForChannel(msg.ChannelId, msg.Amount)
	if err != nil {
		return err
	}
	output.SendMessagesHistory(msg.ChannelId, msgs, user.ID)
	return nil
}

func GetMessagesHistory(user *models.User, msg input.ParsedGetOlderMessages) error {
	msgs, err := state.Message.GetOlderMessagesForChannel(msg.ChannelId, msg.Amount, msg.MessageId)
	if err != nil {
		return err
	}
	output.SendMessagesHistory(msg.ChannelId, msgs, user.ID)
	return nil
}

func AddMessage(user *models.User, msg input.ParsedAddMessage) error {
	message, err := state.Message.CreateMessage(msg.ChannelId, user.ID, msg.Data)
	if err != nil {
		return err
	}
	channel, err := state.Channel.GetChannel(msg.ChannelId)
	if err != nil {
		return err
	}
	output.SendMessage(channel, message)
	return nil
}

func AnswerMessage(user *models.User, msg input.ParsedAnswerMessage) error {
	message, err := state.Message.CreateAnswer(msg.ChannelId, user.ID, msg.Data, msg.AnswerToId)
	if err != nil {
		return err
	}
	channel, err := state.Channel.GetChannel(msg.ChannelId)
	if err != nil {
		return err
	}
	output.SendMessage(channel, message)
	return nil
}

func EditMessage(user *models.User, msg input.ParsedActionEditMessage) error {
	isUserOwnerOfMessage, err := state.Message.IsUserOwnerOfMessage(user.ID, msg.MessageID)
	if err != nil {
		return err
	}
	if !isUserOwnerOfMessage {
		return errors.New("user is not owner of message")
	}
	message, err := state.Message.EditMessage(msg.MessageID, msg.Data)
	if err != nil {
		return err
	}
	channel, err := state.Channel.GetChannel(message.ChannelID)
	if err != nil {
		return err
	}
	output.SendEditMessage(channel, message)
	return nil
}

func DeleteMessage(user *models.User, msg input.ParsedActionDeleteMessage) error {
	isUserOwnerOfMessage, err := state.Message.IsUserOwnerOfMessage(user.ID, msg.MessageID)
	if err != nil {
		return err
	}
	if !isUserOwnerOfMessage {
		return errors.New("user is not owner of message")
	}
	err = state.Message.DeleteMessage(msg.MessageID)
	if err != nil {
		return err
	}
	channel, err := state.Channel.GetChannel(msg.ChannelId)
	if err != nil {
		return err
	}
	output.SendDeleteMessage(channel, msg.MessageID)
	return nil
}
