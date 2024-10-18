package db_chat

import (
	"context"
	"errors"
	"go-backend/chat_v2/models"
	app_db "go-backend/db"
	"go-backend/prisma/db"
	"time"

	"github.com/google/uuid"
	"github.com/steebchen/prisma-client-go/runtime/transaction"
)

func CreatePrivateChannel(name string, firstUserId string, secondUserId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.CreateOne(
		db.Channel.ID.Set(uuid.New().String()),
		db.Channel.Name.Set(name),
		db.Channel.UpdatedAt.Set(time.Now()),
		db.Channel.Type.Set(string(models.PrivateChannel)),
		db.Channel.User.Link(
			db.User.ID.Equals(firstUserId),
			db.User.ID.Equals(secondUserId),
		),
		db.Channel.UserOwners.Link(
			db.User.ID.Equals(firstUserId),
			db.User.ID.Equals(secondUserId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.ChannelModel{}, err
	}

	return channel, nil
}

func createChannelWithOwner(name string, creatorUserId string, channelType string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.CreateOne(
		db.Channel.ID.Set(uuid.New().String()),
		db.Channel.Name.Set(name),
		db.Channel.UpdatedAt.Set(time.Now()),
		db.Channel.Type.Set(channelType),
		db.Channel.UserOwners.Link(
			db.User.ID.Equals(creatorUserId),
		),
		db.Channel.User.Link(
			db.User.ID.Equals(creatorUserId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.ChannelModel{}, err
	}

	return channel, nil
}

func addAllUsersToChannel(channelId string, usersIds ...string) error {
	ctx := context.Background()
	var tx []transaction.Transaction
	for _, userId := range usersIds {
		tx = append(tx, app_db.DbConnection.Channel.FindUnique(
			db.Channel.ID.Equals(channelId),
		).Update(
			db.Channel.User.Link(
				db.User.ID.Equals(userId),
			),
		).Tx())
	}
	if err := app_db.DbConnection.Prisma.Transaction(tx...).Exec(ctx); err != nil {
		return err
	}

	return nil
}

func CreateGroupChannel(name string, creatorUserId string, usersIds ...string) (*db.ChannelModel, error) {
	channel, err := createChannelWithOwner(name, creatorUserId, string(models.GroupChannel))
	if err != nil {
		return &db.ChannelModel{}, err
	}
	err = addAllUsersToChannel(channel.ID, usersIds...)
	if err != nil {
		return &db.ChannelModel{}, err
	}

	return channel, nil
}

func CreatePublicChannel(name string, creatorUserId string, usersIds ...string) (*db.ChannelModel, error) {
	channel, err := createChannelWithOwner(name, creatorUserId, string(models.PublicChannel))
	if err != nil {
		return &db.ChannelModel{}, err
	}
	err = addAllUsersToChannel(channel.ID, usersIds...)
	if err != nil {
		return &db.ChannelModel{}, err
	}

	return channel, nil
}

func DeleteChannel(channelId string) error {
	ctx := context.Background()
	_, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Delete().Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}

func EditChannel(channelId string, name string, description string) error {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Exec(ctx)
	if err != nil {
		return err
	}
	if name == channel.Name && description == channel.Description {
		return errors.New("nothing to update")
	}

	if name != "" {
		channel.Name = name
	}
	if description != "" {
		channel.Description = description
	}

	_, err = app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channel.ID),
	).Update(
		db.Channel.Name.Set(channel.Name),
		db.Channel.Description.Set(channel.Description),
	).Exec(ctx)

	if err != nil {
		return err
	}

	return nil
}

func LeaveChannel(channelId string, userId string) error {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Update(
		db.Channel.User.Unlink(
			db.User.ID.Equals(userId),
		),
		db.Channel.UserOwners.Unlink(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)
	if err != nil {
		return err
	}
	if len(channel.User()) == 0 && len(channel.UserOwners()) == 0 {
		err = DeleteChannel(channelId)
		if err != nil {
			return err
		}
	}

	return nil
}

func GetChannels(userId string) ([]db.ChannelModel, error) {
	ctx := context.Background()
	channels, err := app_db.DbConnection.Channel.FindMany(
		db.Channel.User.Some(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)
	if err != nil {
		return []db.ChannelModel{}, err
	}

	return channels, nil
}

func GetPublicChannels(userId string) ([]db.ChannelModel, error) {
	ctx := context.Background()
	channels, err := app_db.DbConnection.Channel.FindMany(
		db.Channel.User.None(
			db.User.ID.Equals(userId),
		),
		db.Channel.UserOwners.None(
			db.User.ID.Equals(userId),
		),
		db.Channel.Type.Equals(string(models.PublicChannel)),
	).Exec(ctx)
	if err != nil {
		return []db.ChannelModel{}, err
	}

	return channels, nil
}

func IsUserOwnerOfChannel(channelId string, userId string) (bool, error) {
	ctx := context.Background()
	channel, err := app_db.DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Exec(ctx)
	if err != nil {
		return false, err
	}

	for _, user := range channel.UserOwners() {
		if user.ID == userId {
			return true, nil
		}
	}

	return false, nil
}
