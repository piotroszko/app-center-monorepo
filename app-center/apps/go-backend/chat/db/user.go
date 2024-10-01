package db_chat

import (
	"context"
	"go-backend/prisma/db"
)

type userFuncs struct{}

var User = userFuncs{}

func (userFuncs) GetUserById(id string) (*db.UserModel, error) {
	user, err := DbConnection.User.FindUnique(
		db.User.ID.Equals(id),
	).Exec(context.Background())
	if err != nil {
		return &db.UserModel{}, err
	}
	return user, nil
}
