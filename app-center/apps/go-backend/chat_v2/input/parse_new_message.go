package input

import "errors"

type parseNewMessageType struct{}

var ParseNewMessage parseNewMessageType

func (parseNewMessageType) ParseNewMessageType(raw RawPayload) MessageNewType {
	return MessageNewType(raw.NewMessage.Type)
}

type ParsedAddMessage struct {
	ChannelId string
	Data      string
}

type ParsedAnswerMessage struct {
	ChannelId  string
	Data       string
	AnswerToId string
}

func (parseNewMessageType) ParseNewMessageChannelId(raw RawPayload) (ParsedAddMessage, error) {
	if raw.NewMessage.ChannelId == "" {
		return ParsedAddMessage{}, errors.New("channel id is empty")
	}
	if raw.NewMessage.Data == "" {
		return ParsedAddMessage{}, errors.New("data is empty")
	}
	return ParsedAddMessage{
		ChannelId: raw.NewMessage.ChannelId,
		Data:      raw.NewMessage.Data,
	}, nil
}

func (parseNewMessageType) ParseAnswerMessage(raw RawPayload) (ParsedAnswerMessage, error) {
	if raw.NewMessage.ChannelId == "" {
		return ParsedAnswerMessage{}, errors.New("channel id is empty")
	}
	if raw.NewMessage.Data == "" {
		return ParsedAnswerMessage{}, errors.New("data is empty")
	}
	if raw.NewMessage.AnswerToId == "" {
		return ParsedAnswerMessage{}, errors.New("answer to id is empty")
	}
	return ParsedAnswerMessage{
		ChannelId:  raw.NewMessage.ChannelId,
		Data:       raw.NewMessage.Data,
		AnswerToId: raw.NewMessage.AnswerToId,
	}, nil
}
