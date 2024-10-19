package state

import (
	"errors"
	db_chat "go-backend/chat_v2/state/db"
	"go-backend/prisma/db"
)

type inviteType struct{}

var Invite = inviteType{}

// TODO: Add cache for checking against

func (inviteType) CreateInvite(channelId string, inviterId string, userId string, message string) error {
	isExist, invite, err := db_chat.IsInviteAlreadySent(inviterId, userId, channelId)
	if err == nil || isExist || !invite.IsDeleted {
		return errors.New("invite already sent")
	}
	if invite.IsDeleted {
		_, err = db_chat.FlagUnDeleteInvite(invite.ID)
		if err != nil {
			return err
		}
		return nil
	}

	_, err = db_chat.CreateInvite(userId, userId, channelId, message)
	if err != nil {
		return err
	}
	return nil
}

func (inviteType) GetInvitesForUser(userId string) ([]db.ChannelInviteModel, error) {
	invites, err := db_chat.GetInvitesForUser(userId)
	if err != nil {
		return nil, err
	}
	return invites, nil
}

func (inviteType) AcceptInvite(inviteId string) error {
	invite, err := db_chat.FlagDeleteInvite(inviteId)
	if err != nil {
		return err
	}
	_, err = db_chat.AddUserToChannel(invite.ChannelID, invite.UserID)
	if err != nil {
		return err
	}
	return nil
}

func (inviteType) DeclineInvite(inviteId string) error {
	_, err := db_chat.FlagDeleteInvite(inviteId)
	if err != nil {
		return err
	}
	return nil
}
