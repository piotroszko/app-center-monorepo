package controllers

import (
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
)

func AcceptInvite(user *models.User, msg input.ParsedInviteAccept) error {
	return nil
}

func DeclineInvite(user *models.User, msg input.ParsedInviteDecline) error {
	return nil
}

func InviteUser(user *models.User, msg input.ParsedInviteSend) error {
	return nil
}

func GetInvitesForUser(user *models.User) error {
	return nil
}
