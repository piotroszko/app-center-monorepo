package logs

import (
	"fmt"
	app_db "go-backend/db"
	"go-backend/prisma/db"

	"github.com/google/uuid"
)

func sendLog(message string, category string, level int) {
	var lvl string
	switch level {
	case 0:
		lvl = "info"
	case 1:
		lvl = "warning"
	case 2:
		lvl = "error"
	default:
		lvl = "info"
	}
	if level == 0 {
		return
	}
	app_db.DbConnection.Log.CreateOne(
		db.Log.ID.Set(uuid.New().String()),
		db.Log.Server.Set("go-backend"),
		db.Log.Level.Set(lvl),
		db.Log.Category.Set(category),
		db.Log.Message.Set(message),
	)
}

func SendLogInfo(message string, category string) {
	fmt.Println("[INFO]:", message)
	sendLog(message, category, 0)
}

func SendLogWarning(message string, category string) {
	fmt.Println("[WARNING]:", message)
	sendLog(message, category, 1)
}

func SendLogError(message string, category string) {
	fmt.Println("[ERROR]:", message)
	sendLog(message, category, 2)
}
