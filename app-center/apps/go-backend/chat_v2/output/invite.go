package output

import "go-backend/prisma/db"

type InviteAction string

const (
	ActionGetInvite     InviteAction = "get"
	ActionNewInvite     InviteAction = "new"
	ActionDeclineInvite InviteAction = "deleted"
	ActionAcceptInvite  InviteAction = "accepted"
)

type OutputInvite struct {
	ID      string        `json:"id"`
	Channel OutputChannel `json:"channel"`
	User    OutputUser    `json:"user"`
	Data    string        `json:"data"`
}

type OutputInvites struct {
	Type    InviteAction   `json:"type"`
	Invites []OutputInvite `json:"invites"`
}

func parseInvite(invite db.ChannelInviteModel) OutputInvite {
	message, _ := invite.Message()
	return OutputInvite{
		ID: invite.ID,
		Channel: OutputChannel{
			ID: invite.ChannelID,
		},
		User: OutputUser{
			ID: invite.UserID,
		},
		Data: message,
	}
}

func SendInvitesGet(invites []db.ChannelInviteModel, userID string) {
	outputObject := OutputInvites{
		Type:    ActionGetInvite,
		Invites: []OutputInvite{},
	}
	for _, invite := range invites {
		outputObject.Invites = append(outputObject.Invites, parseInvite(invite))
	}
	sendMessage(outputObject, userID)
}

func SendInviteNew(invite db.ChannelInviteModel, userID string) {
	outputObject := OutputInvites{
		Type:    ActionNewInvite,
		Invites: []OutputInvite{parseInvite(invite)},
	}
	sendMessage(outputObject, userID)
}

func SendInviteDecline(invite db.ChannelInviteModel, userID string) {
	outputObject := OutputInvites{
		Type:    ActionDeclineInvite,
		Invites: []OutputInvite{parseInvite(invite)},
	}
	sendMessage(outputObject, userID)
}

func SendInviteAccept(invite db.ChannelInviteModel, userID string) {
	outputObject := OutputInvites{
		Type:    ActionAcceptInvite,
		Invites: []OutputInvite{parseInvite(invite)},
	}
	sendMessage(outputObject, userID)
}
