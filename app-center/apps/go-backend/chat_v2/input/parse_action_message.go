package input

import "errors"

type parseActionMessageType struct{}

var ParseActionMessage parseActionMessageType

func (parseActionMessageType) ParseActionMessageType(raw RawPayload) MessageActionType {
	return MessageActionType(raw.ActionMessage.Type)
}

type ParsedActionEditMessage struct {
	MessageID int    `json:"messageId"`
	Data      string `json:"data"`
}

type ParsedActionDeleteMessage struct {
	MessageID   int    `json:"messageId"`
	MessagesIds []int  `json:"messagesIds"`
	ChannelId   string `json:"channelId"`
}

func (parseActionMessageType) ParseEditMessage(raw RawPayload) (ParsedActionEditMessage, error) {
	if raw.ActionMessage.MessageId == 0 {
		return ParsedActionEditMessage{}, errors.New("message id is required")
	}
	if raw.ActionMessage.Data == "" {
		return ParsedActionEditMessage{}, errors.New("data is required")
	}
	return ParsedActionEditMessage{
		MessageID: raw.ActionMessage.MessageId,
		Data:      raw.ActionMessage.Data,
	}, nil
}

func (parseActionMessageType) ParseDeleteMessage(raw RawPayload) (ParsedActionDeleteMessage, error) {
	if raw.ActionMessage.MessageId == 0 && len(raw.ActionMessage.MessagesIds) == 0 {
		return ParsedActionDeleteMessage{}, errors.New("message id or messages ids are required")
	}
	if raw.ActionMessage.ChannelId == "" {
		return ParsedActionDeleteMessage{}, errors.New("channel id is required")
	}
	return ParsedActionDeleteMessage{
		MessageID:   raw.ActionMessage.MessageId,
		MessagesIds: raw.ActionMessage.MessagesIds,
		ChannelId:   raw.ActionMessage.ChannelId,
	}, nil
}
