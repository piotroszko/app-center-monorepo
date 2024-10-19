package controllers

import (
	"errors"
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
	"go-backend/chat_v2/output"
	"go-backend/chat_v2/state"
)

func CreateChannel(user *models.User, msg input.ParsedActionCreateChannel) error {
	channelType := string(msg.ChannelType)
	switch channelType {
	case string(models.PrivateChannel):
		{
			createdChannel, err := state.Channel.CreatePrivateChannel(msg.Name, user.ID, msg.UsersIds[0])
			if err != nil {
				return err
			}
			output.SendNewChannel(createdChannel)
		}
	case string(models.GroupChannel):
		{
			createdChannel, err := state.Channel.CreateGroupChannel(msg.Name, user.ID, msg.UsersIds...)
			if err != nil {
				return err
			}
			output.SendNewChannel(createdChannel)
		}
	case string(models.PublicChannel):
		{
			createdChannel, err := state.Channel.CreatePublicChannel(msg.Name, user.ID)
			if err != nil {
				return err
			}
			output.SendNewChannel(createdChannel)
		}
	default:
		{
			return errors.New("unknown channel type")
		}
	}
	return nil
}

func DeleteChannel(user *models.User, msg input.ParsedActionDeleteChannel) error {
	isOwner, err := state.Channel.IsUserOwnerOfChannel(user.ID, msg.ChannelId)
	if err != nil {
		return err
	}
	if !isOwner {
		return errors.New("user is not owner of channel")
	}
	channel, err := state.Channel.DeleteChannel(msg.ChannelId)
	if err != nil {
		return err
	}
	output.SendDeletedChannel(channel)
	return nil
}

func EditChannel(user *models.User, msg input.ParsedActionEditChannel) error {
	isOwner, err := state.Channel.IsUserOwnerOfChannel(user.ID, msg.ChannelId)
	if err != nil {
		return err
	}
	if !isOwner {
		return errors.New("user is not owner of channel")
	}
	channel, err := state.Channel.EditChannel(msg.ChannelId, msg.Name, msg.Description, user.ID)
	if err != nil {
		return err
	}
	output.SendEditedChannel(channel)
	return nil
}

func LeaveChannel(user *models.User, msg input.ParsedActionLeaveChannel) error {
	channel, err := state.Channel.LeaveChannel(msg.ChannelId, user.ID)
	if err != nil {
		return err
	}
	output.SendLeftChannel(channel, user.ID)
	return nil
}

func GetChannels(user *models.User) error {
	channels, err := state.Channel.GetChannels(user.ID)
	if err != nil {
		return err
	}
	output.SendChannelsToUser(channels, user.ID, false)
	return nil
}

func GetPublicChannels(user *models.User) error {
	channels, err := state.Channel.GetPublicChannels(user.ID)
	if err != nil {
		return err
	}
	output.SendChannelsToUser(channels, user.ID, true)
	return nil
}

func JoinPublicChannel(user *models.User, msg input.ParsedActionJoinPublicChannel) error {
	channel, err := state.Channel.JoinPublicChannel(msg.ChannelId, user.ID)
	if err != nil {
		return err
	}
	output.SendJoinChannel(channel, user.ID)
	return nil
}
