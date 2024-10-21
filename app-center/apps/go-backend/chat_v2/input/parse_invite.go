package input

import "errors"

type parseInviteType struct{}

var ParseInvite parseInviteType

func (parseInviteType) ParseInviteType(raw RawPayload) InviteType {
	return InviteType(raw.InviteChannel.Type)
}

type ParsedInviteAccept struct {
	InviteID string `json:"inviteId"`
}

type ParsedInviteDecline struct {
	InviteID string `json:"inviteId"`
}

type ParsedInviteSend struct {
	ChannelID string `json:"channelId"`
	UserID    string `json:"userId"`
	Data      string `json:"data"`
}

func (parseInviteType) ParseAcceptInvite(raw RawPayload) (ParsedInviteAccept, error) {
	if raw.InviteChannel.InviteId == "" {
		return ParsedInviteAccept{}, errors.New("invite id is required")
	}
	return ParsedInviteAccept{
		InviteID: raw.InviteChannel.InviteId,
	}, nil
}

func (parseInviteType) ParseDeclineInvite(raw RawPayload) (ParsedInviteDecline, error) {
	if raw.InviteChannel.InviteId == "" {
		return ParsedInviteDecline{}, errors.New("invite id is required")
	}
	return ParsedInviteDecline{
		InviteID: raw.InviteChannel.InviteId,
	}, nil
}

func (parseInviteType) ParseSendInvite(raw RawPayload) (ParsedInviteSend, error) {
	if raw.InviteChannel.ChannelId == "" {
		return ParsedInviteSend{}, errors.New("channel id is required")
	}
	if raw.InviteChannel.UserId == "" {
		return ParsedInviteSend{}, errors.New("user id is required")
	}
	return ParsedInviteSend{
		ChannelID: raw.InviteChannel.ChannelId,
		UserID:    raw.InviteChannel.UserId,
		Data:      raw.InviteChannel.Data,
	}, nil
}
