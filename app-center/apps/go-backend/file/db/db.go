package db_file

import (
	"context"
	"errors"
	app_db "go-backend/db"
	"go-backend/prisma/db"
	"time"

	"github.com/google/uuid"
)

func IsDirectoryExists(userId string, id string) (bool, error) {
	ctx := context.Background()
	directory, err := app_db.DbConnection.Directory.FindUnique(
		db.Directory.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return false, err
	}
	if directory.UserID != userId {
		return false, nil
	}
	return true, nil
}

func CreateDirectory(userId string, name string, parentId string, shareType string) (*db.DirectoryModel, error) {
	ctx := context.Background()
	file, err := app_db.DbConnection.Directory.CreateOne(
		db.Directory.ID.Set(uuid.New().String()),
		db.Directory.Name.Set(name),
		db.Directory.UpdatedAt.Set(time.Now()),
		db.Directory.ShareType.Set(shareType),
		db.Directory.User.Link(
			db.User.ID.Equals(userId),
		),
		db.Directory.Directory.Link(
			db.Directory.ID.Equals(parentId),
		),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return file, nil
}

func CreateRootDirectory(userId string) (*db.DirectoryModel, error) {
	ctx := context.Background()
	file, err := app_db.DbConnection.Directory.CreateOne(
		db.Directory.ID.Set(uuid.New().String()),
		db.Directory.Name.Set("root"),
		db.Directory.UpdatedAt.Set(time.Now()),
		db.Directory.ShareType.Set("PRIVATE"),
		db.Directory.User.Link(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return file, nil
}

func UploadFile(id string, fullname string, mimetype string, format string, userId string, directoryId string) (*db.FileModel, error) {
	ctx := context.Background()
	file, err := app_db.DbConnection.File.CreateOne(
		db.File.ID.Set(id),
		db.File.Filename.Set(fullname),
		db.File.Mimetype.Set(mimetype),
		db.File.Format.Set(format),
		db.File.ShareType.Set("PRIVATE"),
		db.File.UpdatedAt.Set(time.Now()),
		db.File.Directory.Link(
			db.Directory.ID.Equals(directoryId),
		),
		db.File.User.Link(
			db.User.ID.Equals(id),
		),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return file, nil
}

func GetIfUserCanDownloadFile(id string, userId string) (*db.FileModel, error) {
	ctx := context.Background()
	file, err := app_db.DbConnection.File.FindFirst(
		db.File.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	if file.ShareType == "PRIVATE" && file.UserID != userId {
		return nil, errors.New("file is private")
	} else if file.ShareType == "PRIVATE" && file.UserID == userId {
		return file, nil
	} else {
		return file, nil
	}
}

func GetPublicFilesForUser(userId string) ([]db.FileModel, error) {
	ctx := context.Background()
	files, err := app_db.DbConnection.File.FindMany(
		db.File.UserID.Equals(userId),
		db.File.ShareType.Equals("PUBLIC"),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}
	return files, nil
}

func ChangeShareTypeOfFile(userId string, id string, shareType string) (*db.FileModel, error) {
	ctx := context.Background()
	file, err := app_db.DbConnection.File.UpsertOne(
		db.File.ID.Equals(id),
	).Update(
		db.File.ShareType.Set(shareType),
	).Exec(ctx)

	if err != nil {
		return nil, err
	}
	return file, nil
}

func DeleteFile(userId string, id string) error {
	ctx := context.Background()
	// find if the file exists
	file, err := app_db.DbConnection.File.FindUnique(
		db.File.ID.Equals(id),
	).Exec(ctx)

	if err != nil {
		return err
	}
	if file.UserID != userId {
		return errors.New("file not found")
	}

	_, err = app_db.DbConnection.File.FindUnique(
		db.File.ID.Equals(id),
	).Delete().Exec(ctx)

	if err != nil {
		return err
	}

	return nil
}
