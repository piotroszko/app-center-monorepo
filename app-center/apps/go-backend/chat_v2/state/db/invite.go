package db_chat

import (
	"context"
	"errors"
	app_db "go-backend/db"
	"go-backend/prisma/db"

	"github.com/google/uuid"
)

func FlagDeleteInvite(inviteId string) (*db.ChannelInviteModel, error) {
	ctx := context.Background()
	return app_db.DbConnection.ChannelInvite.FindUnique(
		db.ChannelInvite.ID.Equals(inviteId),
	).Update(
		db.ChannelInvite.IsDeleted.Set(true),
	).Exec(ctx)
}

func FlagUnDeleteInvite(inviteId string) (*db.ChannelInviteModel, error) {
	ctx := context.Background()
	return app_db.DbConnection.ChannelInvite.FindUnique(
		db.ChannelInvite.ID.Equals(inviteId),
	).Update(
		db.ChannelInvite.IsDeleted.Set(false),
	).Exec(ctx)
}

func GetInvite(inviteId string) error {
	ctx := context.Background()
	_, err := app_db.DbConnection.ChannelInvite.FindUnique(
		db.ChannelInvite.ID.Equals(inviteId),
	).Exec(ctx)
	return err
}

func IsInviteAlreadySent(userId, inviterId, channelId string) (bool, db.ChannelInviteModel, error) {
	ctx := context.Background()
	invites, err := app_db.DbConnection.ChannelInvite.FindMany(
		db.ChannelInvite.UserChannelInviteUserIdtoUser.Where(
			db.User.ID.Equals(userId),
		),
		db.ChannelInvite.UserChannelInviteInviterIdtoUser.Where(
			db.User.ID.Equals(inviterId),
		),
		db.ChannelInvite.Channel.Where(
			db.Channel.ID.Equals(channelId),
		),
	).Exec(ctx)
	if err != nil {
		return false, db.ChannelInviteModel{}, err
	}
	if len(invites) == 0 {
		return false, db.ChannelInviteModel{}, errors.New("invite not found")
	}
	return true, invites[0], nil
}

func GetInvitesForUser(userId string) ([]db.ChannelInviteModel, error) {
	ctx := context.Background()

	invites, err := app_db.DbConnection.ChannelInvite.FindMany(
		db.ChannelInvite.UserChannelInviteUserIdtoUser.Where(
			db.User.ID.Equals(userId),
		),
		db.ChannelInvite.IsDeleted.Equals(false),
	).Exec(ctx)

	if err != nil {
		return []db.ChannelInviteModel{}, err
	}

	return invites, nil
}

func CreateInvite(inviterId, userId string, channelId string, text string) (*db.ChannelInviteModel, error) {
	ctx := context.Background()
	invite, err := app_db.DbConnection.ChannelInvite.CreateOne(
		db.ChannelInvite.ID.Set(uuid.New().String()),
		db.ChannelInvite.Channel.Link(
			db.Channel.ID.Equals(channelId),
		),
		db.ChannelInvite.UserChannelInviteInviterIdtoUser.Link(
			db.User.ID.Equals(inviterId),
		),
		db.ChannelInvite.UserChannelInviteUserIdtoUser.Link(
			db.User.ID.Equals(userId),
		),
		db.ChannelInvite.Message.Set(text),
	).Exec(ctx)
	if err != nil {
		return &db.ChannelInviteModel{}, err
	}

	return invite, nil
}
