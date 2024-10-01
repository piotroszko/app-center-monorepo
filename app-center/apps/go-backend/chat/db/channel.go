package db_chat

import (
	"context"
	"go-backend/prisma/db"
	"time"

	"github.com/google/uuid"
)

func CreateChannel(name string, userId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := DbConnection.Channel.CreateOne(
		db.Channel.ID.Set(uuid.New().String()),
		db.Channel.Name.Set(name),
		db.Channel.UpdatedAt.Set(time.Now()),
		db.Channel.UserChannelOwnerIdtoUser.Link(
			db.User.ID.Equals(userId),
		),
		db.Channel.User.Link(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)

	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func DeleteChannel(channelId string) (*db.ChannelModel, error) {
	ctx := context.Background()
	channel, err := DbConnection.Channel.FindUnique(
		db.Channel.ID.Equals(channelId),
	).Delete().Exec(ctx)

	if err != nil {
		return &db.ChannelModel{}, err
	}
	return channel, nil
}

func AddUserToChannel(channelId string, userId string) (*db.ChannelModel, error) {
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
func RemoveUserFromChannel(channelId string, userId string) (*db.ChannelModel, error) {
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

func GetUsersForChannel(channelId string) ([]db.UserModel, error) {
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
