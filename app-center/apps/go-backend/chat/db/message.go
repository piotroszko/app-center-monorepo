package db_chat

import (
	"context"
	"errors"
	"go-backend/chat/models"
	"go-backend/prisma/db"
)

func AddMessage(msg models.Message) (*db.MessageModel, error) {
	ctx := context.Background()
	var msgDb *db.MessageModel
	var err error
	switch models.ChannelType(msg.ChannelType) {
	case models.GroupType:
		{
			msgDb, err = DbConnection.Message.CreateOne(
				db.Message.ID.Set(msg.ID),
				db.Message.Content.Set(msg.Content),
				db.Message.Channel.Link(
					db.Channel.ID.Equals(msg.GroupID),
				),
				db.Message.PrivateChannel.Link(nil),
				db.Message.User.Link(
					db.User.ID.Equals(msg.SenderID),
				),
			).Exec(ctx)
			break
		}
	case models.PrivateType:
		{
			channelName, err2 := msg.GetStreamName()
			if err2 != nil {
				return nil, err2
			}
			msgDb, err = DbConnection.Message.CreateOne(
				db.Message.ID.Set(msg.ID),
				db.Message.Content.Set(msg.Content),
				db.Message.Channel.Link(nil),
				db.Message.PrivateChannel.Link(
					db.PrivateChannel.ID.Equals(channelName),
				),
				db.Message.User.Link(
					db.User.ID.Equals(msg.SenderID),
				),
			).Exec(ctx)
			break
		}
	case models.RoomType:
		{
			msgDb, err = DbConnection.Message.CreateOne(
				db.Message.ID.Set(msg.ID),
				db.Message.Content.Set(msg.Content),
				db.Message.Channel.Link(
					db.Channel.ID.Equals(msg.RoomID),
				),
				db.Message.PrivateChannel.Link(nil),
				db.Message.User.Link(
					db.User.ID.Equals(msg.SenderID),
				),
			).Exec(ctx)
			break
		}
	default:
		{
			return nil, errors.New("invalid channel type")
		}
	}
	if err != nil {
		return nil, err
	}

	return msgDb, nil
}
