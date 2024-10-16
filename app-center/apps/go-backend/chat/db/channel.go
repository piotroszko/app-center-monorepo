package db_chat

import (
	"context"
	"errors"
	"go-backend/chat/models"
	app_db "go-backend/db"
	"go-backend/prisma/db"
	"time"

	"github.com/google/uuid"
	"github.com/steebchen/prisma-client-go/runtime/transaction"
)

type channelFuncs struct{}

var Channel = channelFuncs{}

func (channelFuncs) CreatePrivateChannel(name string, firstUserId string, secondUserId string) (*db.ChannelModel, error) {
	return Channel.createChannel(name, firstUserId, string(models.PrivateType), firstUserId, secondUserId)
}
func (channelFuncs) CreateGroupChannel(name string, creatorUserId string, usersIds ...string) (*db.ChannelModel, error) {
	return Channel.createChannel(name, creatorUserId, string(models.GroupType), usersIds...)
}
func (channelFuncs) CreateRoomChannel(name string, creatorUserId string, usersIds ...string) (*db.ChannelModel, error) {
	return Channel.createChannel(name, creatorUserId, string(models.RoomType), usersIds...)
}

// channelType = "private", usersIds should be 2 (two users), creatorUserId will skiped
//
// channelType = "group", usersIds will be the users in the group (not owners)
//
// channelType = "room", usersIds will be the users in the room (not owners)
func (channelFuncs) createChannel(name string, creatorUserId string, channelType string, usersIds ...string) (*db.ChannelModel, error) {
	ctx := context.Background()

	if channelType == string(models.PrivateType) {
		if len(usersIds) != 2 {
			return &db.ChannelModel{}, errors.New("private channel should have 2 users")
		}
	}

	channel, err := app_db.DbConnection.Channel.CreateOne(
		db.Channel.ID.Set(uuid.New().String()),
		db.Channel.Name.Set(name),
		db.Channel.UpdatedAt.Set(time.Now()),
		db.Channel.Type.Set(channelType),
	).Exec(ctx)
	if err != nil {
		return &db.ChannelModel{}, err
	}

	switch channelType {
	case string(models.PrivateType):
		users := app_db.DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.User.Link(
				db.User.ID.Equals(usersIds[0]),
				db.User.ID.Equals(usersIds[1]),
			),
		).Tx()
		owners := app_db.DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.UserOwners.Link(
				db.User.ID.Equals(usersIds[0]),
				db.User.ID.Equals(usersIds[1]),
			),
		).Tx()
		if err := app_db.DbConnection.Prisma.Transaction(users, owners).Exec(ctx); err != nil {
			return &db.ChannelModel{}, err
		}
	case string(models.GroupType), string(models.RoomType):
		var tx []transaction.Transaction

		tx = append(tx, app_db.DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.UserOwners.Link(
				db.User.ID.Equals(creatorUserId),
			),
		).Tx())

		tx = append(tx, app_db.DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.User.Link(
				db.User.ID.Equals(creatorUserId),
			),
		).Tx())

		for _, userId := range usersIds {
			tx = append(tx, app_db.DbConnection.Channel.FindUnique(
				db.Channel.ID.Equals(channel.ID),
			).Update(
				db.Channel.User.Link(
					db.User.ID.Equals(userId),
				),
			).Tx())
		}
		if err := app_db.DbConnection.Prisma.Transaction(tx...).Exec(ctx); err != nil {
			return &db.ChannelModel{}, err
		}
	}

	return channel, nil
}

func (channelFuncs) DeleteChannel(channelId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Delete().Exec(ctx)

	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelFuncs) AddUserToChannel(channelId string, userId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Update(
		db.Channel.User.Link(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)

	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}
func (channelFuncs) RemoveUserFromChannel(channelId string, userId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Update(
		db.Channel.User.Unlink(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)

	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelFuncs) GetUsersForChannel(channelId string) ([]db.UserModel, error) {
	ctx := context.Background()
	users, err := app_db.DbConnection.User.FindMany(
		db.User.Channel.Some(
			db.Channel.ID.Equals(channelId),
		),
	).Exec(ctx)

	if err != nil {
		return []db.UserModel{}, err
	}
	return users, nil
}

func (channelFuncs) GetChannelsForUser(userId string) ([]models.ParsedChannel, error) {
	ctx := context.Background()
	channels, err := app_db.DbConnection.Channel.FindMany(
		db.Channel.User.Some(
			db.User.ID.Equals(userId),
		),
	).With(
		db.Channel.User.Fetch(),
		db.Channel.UserOwners.Fetch(),
	).Exec(ctx)
	if err != nil {
		return []models.ParsedChannel{}, err
	}
	channelsParsed := models.ParseDbChannels(channels)

	return channelsParsed, nil
}

func (channelFuncs) CreateInvite(channelId string, inviterId string, invitedId string) (*db.ChannelInviteModel, error) {
	ctx := context.Background()
	// find if the invite already exists
	invite, err := app_db.DbConnection.ChannelInvite.FindFirst(
		db.ChannelInvite.ChannelID.Equals(channelId),
		db.ChannelInvite.InviterID.Equals(inviterId),
		db.ChannelInvite.UserID.Equals(invitedId),
	).Exec(ctx)
	if err != nil {
		return &db.ChannelInviteModel{}, err
	}
	if invite != nil {
		return invite, nil
	}
	invite, err = app_db.DbConnection.ChannelInvite.CreateOne(
		db.ChannelInvite.ID.Set(uuid.New().String()),
		db.ChannelInvite.Channel.Link(
			db.Channel.ID.Equals(channelId),
		),
		db.ChannelInvite.UserChannelInviteInviterIdtoUser.Link(
			db.User.ID.Equals(invitedId),
		),
		db.ChannelInvite.UserChannelInviteUserIdtoUser.Link(
			db.User.ID.Equals(inviterId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.ChannelInviteModel{}, err
	}
	return invite, nil
}

func (channelFuncs) GetInvitesForUser(userId string) ([]models.ParsedChannelInvite, error) {
	ctx := context.Background()
	invites, err := app_db.DbConnection.ChannelInvite.FindMany(
		db.ChannelInvite.UserID.Equals(userId),
	).With(
		db.ChannelInvite.Channel.Fetch(),
		db.ChannelInvite.UserChannelInviteInviterIdtoUser.Fetch(),
	).Exec(ctx)
	if err != nil {
		return []models.ParsedChannelInvite{}, err
	}
	var invitesParsed []models.ParsedChannelInvite
	for _, invite := range invites {
		invitesParsed = append(invitesParsed, models.ParseChannelInvite(invite))
	}

	return invitesParsed, nil
}
