package db_chat

import (
	"context"
	"go-backend/chat/models"
	app_db "go-backend/db"
	"go-backend/prisma/db"
)

type messageFuncs struct{}

var Message = messageFuncs{}

func (messageFuncs) AddMessage(msg models.Message) (*db.MessageModel, error) {
	ctx := context.Background()
	var msgDb *db.MessageModel
	var err error
	msgDb, err = app_db.DbConnection.Message.CreateOne(
		db.Message.Content.Set(msg.Content),
		db.Message.Channel.Link(
			db.Channel.ID.Equals(msg.ChannelID),
		),
		db.Message.User.Link(
			db.User.ID.Equals(msg.SenderID),
		),
	).Exec(ctx)

	if err != nil {
		return nil, err
	}

	return msgDb, nil
}

func (messageFuncs) GetMessages(channelID string, amount int) ([]db.MessageModel, error) {
	ctx := context.Background()
	msgs, err := app_db.DbConnection.Message.FindMany(
		db.Message.ChannelID.Equals(channelID),
	).OrderBy(
		db.Message.CreatedAt.Order(db.SortOrderDesc),
	).Take(amount).Exec(ctx)

	if err != nil {
		return nil, err
	}

	return msgs, nil
}

func (messageFuncs) GetMessagesAfter(channelID string, messageID int, amount int) ([]db.MessageModel, error) {
	ctx := context.Background()

	messageWithId, err := app_db.DbConnection.Message.FindFirst(
		db.Message.ID.Equals(messageID),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	msgs, err := app_db.DbConnection.Message.FindMany(
		db.Message.ChannelID.Equals(channelID),
		db.Message.CreatedAt.Gt(messageWithId.CreatedAt),
	).OrderBy(
		db.Message.CreatedAt.Order(db.SortOrderDesc),
	).Take(amount).Exec(ctx)

	if err != nil {
		return nil, err
	}

	return msgs, nil
}
