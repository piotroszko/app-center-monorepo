package db_file

import (
	"context"
	"errors"
	app_db "go-backend/db"
	"go-backend/prisma/db"
	"strings"
	"time"

	"github.com/google/uuid"
)

// TODO: Do not allow deleting default directories or editing them

// Path of file does not contain the filename, and end with a slash "/" and start with a slash "/" e.g. /Chat/

var DefaultDirectories = []string{"Chat", "Notes", "Documents"}

func FindAllDirectoriesInRoot(userId string) ([]db.FileModel, error) {
	ctx := context.Background()
	files, err := app_db.DbConnection.File.FindMany(
		db.File.IsDirectory.Equals(true),
		db.File.Path.Equals("/"),
		db.File.User.Where(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)

	if err != nil {
		return nil, err
	}
	return files, nil
}

func DeleteDirectory(directoryId string) error {
	ctx := context.Background()
	// do not delete default directories
	_, err := app_db.DbConnection.File.FindMany(
		db.File.ID.Equals(directoryId),
		db.File.IsDirectory.Equals(true),
		db.File.Not(
			db.File.Path.Equals("/"),
			db.File.Filename.In(DefaultDirectories),
		),
	).Delete().Exec(ctx)

	if err != nil {
		return err
	}
	return nil
}

func CreateDirectory(userId, directoryName, path string) (*db.FileModel, error) {
	ctx := context.Background()
	// check if the directory already exists
	directory, err := app_db.DbConnection.File.FindMany(
		db.File.Path.Equals(path),
		db.File.Filename.Equals(directoryName),
		db.File.User.Where(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.FileModel{}, err
	}
	if len(directory) > 0 {
		return &db.FileModel{}, errors.New("directory already exists")
	}
	tmpPath := strings.TrimRight(path, "/")

}

func AddFile(userId, filename, mimetype, format, path string, size int) (*db.FileModel, error) {
	ctx := context.Background()
	// check if the file already exists
	file, err := app_db.DbConnection.File.FindMany(
		db.File.Path.Equals(path),
		db.File.Filename.Equals(filename),
		db.File.User.Where(
			db.User.ID.Equals(userId),
		),
	).Exec(ctx)
	if err != nil {
		return &db.FileModel{}, err
	}
	if len(file) > 0 {
		return &db.FileModel{}, errors.New("file already exists")
	}
	var fileDb *db.FileModel
	var err2 error

	if path == "/" {
		// if root just create the file
		fileDb, err2 = app_db.DbConnection.File.CreateOne(
			db.File.ID.Set(uuid.New().String()),
			db.File.Filename.Set(filename),
			db.File.Mimetype.Set(mimetype),
			db.File.Format.Set(format),
			db.File.ShareType.Set("private"),
			db.File.UpdatedAt.Set(time.Now()),
			db.File.Path.Set(path),
			db.File.Size.Set(size),
			db.File.User.Link(
				db.User.ID.Equals(userId),
			),
			db.File.IsDirectory.Set(false),
		).Exec(ctx)
	} else {
		// find if directory exist
		directory, err := app_db.DbConnection.File.FindMany(
			db.File.Path.Equals(path),
			db.File.IsDirectory.Equals(true),
			db.File.User.Where(
				db.User.ID.Equals(userId),
			),
		).Exec(ctx)
		if err != nil {
			return &db.FileModel{}, err
		}
		if len(directory) == 0 {
			return &db.FileModel{}, errors.New("directory does not exist")
		}
		fileDb, err2 = app_db.DbConnection.File.CreateOne(
			db.File.ID.Set(uuid.New().String()),
			db.File.Filename.Set(filename),
			db.File.Mimetype.Set(mimetype),
			db.File.Format.Set(format),
			db.File.ShareType.Set("private"),
			db.File.UpdatedAt.Set(time.Now()),
			db.File.Path.Set(path),
			db.File.Size.Set(size),
			db.File.User.Link(
				db.User.ID.Equals(userId),
			),
			db.File.IsDirectory.Set(false),
		).Exec(ctx)
	}
	if err2 != nil {
		return &db.FileModel{}, err2
	}
	return fileDb, nil
}
