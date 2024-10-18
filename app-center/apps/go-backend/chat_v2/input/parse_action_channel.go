package input

import (
	"errors"
	"go-backend/chat_v2/models"
)

type parseActionChannelType struct{}

var ParseActionChannel parseActionChannelType

func (parseActionChannelType) ParseActionChannelType(raw RawPayload) ChannelActionType {
	return ChannelActionType(raw.ActionChannel.Type)
}

type ParsedActionCreateChannel struct {
	Name        string              `json:"name"`
	Description string              `json:"description"`
	ChannelType models.ChannelTypes `json:"channelType"`
	UsersIds    []string            `json:"usersIds"`
}

type ParsedActionEditChannel struct {
	ChannelId   string `json:"channelId"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ParsedActionLeaveChannel struct {
	ChannelId string `json:"channelId"`
}

type ParsedActionDeleteChannel struct {
	ChannelId string `json:"channelId"`
}

func (parseActionChannelType) ParseCreateChannel(raw RawPayload) (ParsedActionCreateChannel, error) {
	if raw.ActionChannel.Name == "" {
		return ParsedActionCreateChannel{}, errors.New("name is required")
	}
	if raw.ActionChannel.Description == "" {
		return ParsedActionCreateChannel{}, errors.New("description is required")
	}
	if raw.ActionChannel.ChannelType == "" {
		return ParsedActionCreateChannel{}, errors.New("channel type is required")
	}
	if models.ChannelTypes(raw.ActionChannel.ChannelType) == models.PrivateChannel && len(raw.ActionChannel.UsersIds) != 1 {
		return ParsedActionCreateChannel{}, errors.New("private channel should have 2 users")
	}
	return ParsedActionCreateChannel{
		Name:        raw.ActionChannel.Name,
		Description: raw.ActionChannel.Description,
		ChannelType: models.ChannelTypes(raw.ActionChannel.ChannelType),
		UsersIds:    raw.ActionChannel.UsersIds,
	}, nil
}

func (parseActionChannelType) ParseEditChannel(raw RawPayload) (ParsedActionEditChannel, error) {
	if raw.ActionChannel.ChannelId == "" {
		return ParsedActionEditChannel{}, errors.New("channel id is required")
	}
	if raw.ActionChannel.Name == "" {
		return ParsedActionEditChannel{}, errors.New("name is required")
	}
	if raw.ActionChannel.Description == "" {
		return ParsedActionEditChannel{}, errors.New("description is required")
	}
	return ParsedActionEditChannel{
		ChannelId:   raw.ActionChannel.ChannelId,
		Name:        raw.ActionChannel.Name,
		Description: raw.ActionChannel.Description,
	}, nil
}

func (parseActionChannelType) ParseLeaveChannel(raw RawPayload) (ParsedActionLeaveChannel, error) {
	if raw.ActionChannel.ChannelId == "" {
		return ParsedActionLeaveChannel{}, errors.New("channel id is required")
	}
	return ParsedActionLeaveChannel{
		ChannelId: raw.ActionChannel.ChannelId,
	}, nil
}

func (parseActionChannelType) ParseDeleteChannel(raw RawPayload) (ParsedActionDeleteChannel, error) {
	if raw.ActionChannel.ChannelId == "" {
		return ParsedActionDeleteChannel{}, errors.New("channel id is required")
	}
	return ParsedActionDeleteChannel{
		ChannelId: raw.ActionChannel.ChannelId,
	}, nil
}
