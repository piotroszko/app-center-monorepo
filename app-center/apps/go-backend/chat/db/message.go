package db_chat

import (
	"context"
	"go-backend/chat/models"
	"go-backend/prisma/db"
)

type messageFuncs struct{}

var Message = messageFuncs{}

func (messageFuncs) AddMessage(msg models.Message) (*db.MessageModel, error) {
	ctx := context.Background()
	var msgDb *db.MessageModel
	var err error
	msgDb, err = DbConnection.Message.CreateOne(
		db.Message.ID.Set(msg.ID),
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
