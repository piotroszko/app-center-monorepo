package db_chat

import (
	"context"
	"errors"
	"go-backend/chat/models"
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

	channel, err := DbConnection.Channel.CreateOne(
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
		users := DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.User.Link(
				db.User.ID.Equals(usersIds[0]),
				db.User.ID.Equals(usersIds[1]),
			),
		).Tx()
		owners := DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.UserOwners.Link(
				db.User.ID.Equals(usersIds[0]),
				db.User.ID.Equals(usersIds[1]),
			),
		).Tx()
		if err := DbConnection.Prisma.Transaction(users, owners).Exec(ctx); err != nil {
			return &db.ChannelModel{}, err
		}
	case string(models.GroupType), string(models.RoomType):
		var tx []transaction.Transaction

		tx = append(tx, DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.UserOwners.Link(
				db.User.ID.Equals(creatorUserId),
			),
		).Tx())

		tx = append(tx, DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channel.ID),
		).Update(
			db.Channel.User.Link(
				db.User.ID.Equals(creatorUserId),
			),
		).Tx())

		for _, userId := range usersIds {
			tx = append(tx, DbConnection.Channel.FindUnique(
				db.Channel.ID.Equals(channel.ID),
			).Update(
				db.Channel.User.Link(
					db.User.ID.Equals(userId),
				),
			).Tx())
		}
		if err := DbConnection.Prisma.Transaction(tx...).Exec(ctx); err != nil {
			return &db.ChannelModel{}, err
		}
	}

	return channel, nil
}

func (channelFuncs) DeleteChannel(channelId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Delete().Exec(ctx)

	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func (channelFuncs) AddUserToChannel(channelId string, userId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := DbConnection.Channel.FindUnique(
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
	channel, err := DbConnection.Channel.FindUnique(
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
	users, err := DbConnection.User.FindMany(
		db.User.Channel.Some(
			db.Channel.ID.Equals(channelId),
		),
	).Exec(ctx)

	if err != nil {
		return []db.UserModel{}, err
	}
	return users, nil
}

func (channelFuncs) GetChannelsForUser(userId string) ([]db.ChannelModel, error) {
	ctx := context.Background()
	channels, err := DbConnection.Channel.FindMany(
		db.Channel.User.Some(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)

	if err != nil {
		return []db.ChannelModel{}, err
	}
	return channels, nil
}