package db_chat

import "go-backend/prisma/db"

var DbConnection *db.PrismaClient

func InitDb() error {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}
	DbConnection = client
	return nil
}
