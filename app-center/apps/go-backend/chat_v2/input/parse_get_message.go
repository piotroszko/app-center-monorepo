package input

import "errors"

type parseGetMessageType struct{}

var ParseGetMessage parseGetMessageType

func (parseGetMessageType) ParseGetMessageType(raw RawPayload) MessageHistoryType {
	return MessageHistoryType(raw.GetMessage.Type)
}

type ParsedGetNewMessages struct {
	ChannelId string `json:"channelId"`
	Amount    int    `json:"amount"`
}

type ParsedGetOlderMessages struct {
	ChannelId string `json:"channelId"`
	MessageId string `json:"messageId"`
	Amount    int    `json:"amount"`
}

func (parseGetMessageType) ParseNewGetMessage(raw RawPayload) (ParsedGetNewMessages, error) {
	if raw.GetMessage.Amount <= 0 {
		raw.GetMessage.Amount = 10
	}

	return ParsedGetNewMessages{
		ChannelId: raw.GetMessage.ChannelId,
		Amount:    raw.GetMessage.Amount,
	}, nil
}

func (parseGetMessageType) ParseOlderGetMessage(raw RawPayload) (ParsedGetOlderMessages, error) {
	if raw.GetMessage.MessageId == "" {
		return ParsedGetOlderMessages{}, errors.New("invalid message id")
	}
	if raw.GetMessage.Amount <= 0 {
		raw.GetMessage.Amount = 10
	}

	return ParsedGetOlderMessages{
		ChannelId: raw.GetMessage.ChannelId,
		MessageId: raw.GetMessage.MessageId,
		Amount:    raw.GetMessage.Amount,
	}, nil
}
