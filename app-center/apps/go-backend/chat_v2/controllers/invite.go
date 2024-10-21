package controllers

import (
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
	"go-backend/chat_v2/output"
	db_chat "go-backend/chat_v2/state/db"
)

func AcceptInvite(user *models.User, msg input.ParsedInviteAccept) error {
	invite, err := db_chat.FlagDeleteInvite(msg.InviteID)
	if err != nil {
		return err
	}
	channel, err := db_chat.AddUserToChannel(msg.InviteID, invite.UserID)
	if err != nil {
		return err
	}
	output.SendJoinChannel(channel, user.ID)
	output.SendInviteAccept(*invite, user.ID)
	return nil
}

func DeclineInvite(user *models.User, msg input.ParsedInviteDecline) error {
	invite, err := db_chat.FlagDeleteInvite(msg.InviteID)
	if err != nil {
		return err
	}
	output.SendInviteDecline(*invite, user.ID)
	return nil
}

func InviteUser(user *models.User, msg input.ParsedInviteSend) error {
	invite, err := db_chat.CreateInvite(user.ID, msg.UserID, msg.ChannelID, msg.Data)
	if err != nil {
		return err
	}
	output.SendInviteNew(*invite, invite.UserID)
	return nil
}

func GetInvitesForUser(user *models.User) error {
	invites, err := db_chat.GetInvitesForUser(user.ID)
	if err != nil {
		return err
	}
	output.SendInvitesGet(invites, user.ID)
	return nil
}
