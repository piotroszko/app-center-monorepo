package db_chat

import (
	"context"
	app_db "go-backend/db"
	"go-backend/prisma/db"
	"time"
)

func GetNewestMessages(channelId string, limit int) ([]db.MessageModel, error) {
	ctx := context.Background()
	messages, err := app_db.DbConnection.Message.FindMany(
		db.Message.ChannelID.Equals(channelId),
		db.Message.IsDeleted.Equals(false),
	).OrderBy(
		db.Message.ID.Order(db.DESC),
	).Take(limit).With(
		db.Message.User.Fetch(),
		db.Message.Message.Fetch(),
	).Exec(ctx)
	if err != nil {
		return []db.MessageModel{}, err
	}

	return messages, nil
}

func GetOlderMessages(channelId string, messageId int, limit int) ([]db.MessageModel, error) {
	ctx := context.Background()
	messages, err := app_db.DbConnection.Message.FindMany(
		db.Message.ChannelID.Equals(channelId),
		db.Message.IsDeleted.Equals(false),
		db.Message.ID.Lt(messageId),
		db.Message.ID.Order(db.DESC),
	).Take(limit).With(
		db.Message.User.Fetch(),
		db.Message.Message.Fetch(),
	).Exec(ctx)
	if err != nil {
		return []db.MessageModel{}, err
	}

	return messages, nil
}

func AddMessage(channelId string, userId string, text string) (*db.MessageModel, error) {
	ctx := context.Background()
	message, err := app_db.DbConnection.Message.CreateOne(
		db.Message.Content.Set(text),
		db.Message.UpdatedAt.Set(time.Now()),
		db.Message.Channel.Link(
			db.Channel.ID.Equals(channelId),
		),
		db.Message.User.Link(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.MessageModel{}, err
	}

	return message, nil
}

func AnswerMessage(channelId string, userId string, text string, replyToMessageId int) (*db.MessageModel, error) {
	ctx := context.Background()
	message, err := app_db.DbConnection.Message.CreateOne(
		db.Message.Content.Set(text),
		db.Message.UpdatedAt.Set(time.Now()),
		db.Message.Channel.Link(
			db.Channel.ID.Equals(channelId),
		),
		db.Message.User.Link(
			db.User.ID.Equals(userId),
		),
		db.Message.Message.Link(
			db.Message.ID.Equals(replyToMessageId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.MessageModel{}, err
	}

	return message, nil
}

func EditMessage(messageId int, text string) (*db.MessageModel, error) {
	ctx := context.Background()
	message, err := app_db.DbConnection.Message.FindUnique(
		db.Message.ID.Equals(messageId),
	).Update(
		db.Message.Content.Set(text),
		db.Message.UpdatedAt.Set(time.Now()),
	).Exec(ctx)
	if err != nil {
		return &db.MessageModel{}, err
	}

	return message, nil
}

func FlagDeleteMessage(messageId int) (*db.MessageModel, error) {
	ctx := context.Background()
	message, err := app_db.DbConnection.Message.FindUnique(
		db.Message.ID.Equals(messageId),
	).Update(
		db.Message.IsDeleted.Set(true),
		db.Message.UpdatedAt.Set(time.Now()),
	).Exec(ctx)
	if err != nil {
		return &db.MessageModel{}, err
	}

	return message, nil
}

func IsUserOwnerOfMessage(userId string, messageId int) (bool, error) {
	ctx := context.Background()
	message, err := app_db.DbConnection.Message.FindUnique(
		db.Message.ID.Equals(messageId),
	).Exec(ctx)
	if err != nil {
		return false, err
	}

	return message.UserID == userId, nil
}
