package io_file

import (
	"errors"
	"fmt"
	db_file "go-backend/file/db"
	"go-backend/prisma/db"

	//db_file "go-backend/file/db"
	"os"
	"slices"
	"strings"

	"github.com/gofiber/fiber/v2"
)

var allowedTypes = []string{"image/jpeg", "image/png"}

func UploadFile(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	if file == nil {
		return errors.New("no file found")
	}

	if !slices.Contains(allowedTypes, file.Header.Get("Content-Type")) {
		c.Response().SetStatusCode(400)
		return c.SendString("Invalid file type")
	}

	fileFormat := strings.Split(file.Filename, ".")
	if len(fileFormat) < 2 {
		c.Response().SetStatusCode(400)
		return c.SendString("Invalid file format")
	}

	destination := fmt.Sprintf("./uploads/%s/%s", userID, file.Filename)

	// check if the file already exists
	if _, err := os.Stat(destination); err == nil {
		return c.SendString("File already exists")
	}

	_, err = db_file.AddFile(userID, file.Filename, file.Header.Get("Content-Type"), fileFormat[1], "/", int(file.Size))
	if err != nil {
		return err
	}

	pathWithoutFileName := strings.Replace(destination, file.Filename, "", -1)
	if _, err := os.Stat(pathWithoutFileName); os.IsNotExist(err) {
		os.MkdirAll(pathWithoutFileName, 0755)
	}
	if err := c.SaveFile(file, destination); err != nil {
		return err
	}

	return c.SendString(file.Filename)
}

func DownloadFile(c *fiber.Ctx) error {
	// path will have /:filename
	filename := c.Params("filename")
	if filename == "" {
		return c.SendString("Invalid file name")
	}
	destination := fmt.Sprintf("./uploads/%s", filename)
	if _, err := os.Stat(destination); err != nil {
		return c.SendString("File not found")
	}
	return c.SendFile(destination)
}

func ListDirectories(c *fiber.Ctx) error {
	// path will have /:path?
	path := c.Params("path")
	var files []db.FileModel
	var err error
	if path == "" {
		files, err = db_file.FindAllDirectoriesInRoot(path)
		if err != nil {
			return err
		}
	}
	return c.JSON(files)
}

type CreateDirectoryBody struct {
	Path string `json:"path"`
	Name string `json:"name"`
}

func CreateDirectory(c *fiber.Ctx) error {
	// get path from body

	var body CreateDirectoryBody
	if err := c.BodyParser(&body); err != nil {
		return err
	}
	if body.Path == "" || body.Name == "" {
		return c.SendString("invalid request")
	}
	// check if the directory already exists
}
