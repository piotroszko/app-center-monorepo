package controllers

import (
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
)

func CreateChannel(user *models.User, msg input.ParsedActionCreateChannel) error {
	channelType := string(msg.ChannelType)
	if channelType == string(models.PrivateChannel) {

	} else {

	}
	return nil
}

func DeleteChannel(user *models.User, msg input.ParsedActionDeleteChannel) error {
	return nil
}

func EditChannel(user *models.User, msg input.ParsedActionEditChannel) error {
	return nil
}

func LeaveChannel(user *models.User, msg input.ParsedActionLeaveChannel) error {
	return nil
}

func GetChannels(user *models.User) error {
	return nil
}

func GetPublicChannels(user *models.User) error {
	return nil
}

func JoinPublicChannel(user *models.User, msg input.ParsedActionJoinPublicChannel) error {
	return nil
}
