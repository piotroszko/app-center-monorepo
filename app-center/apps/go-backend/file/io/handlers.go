package io_file

import (
	"errors"
	"fmt"
	db_file "go-backend/file/db"
	"os"
	"slices"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

var allowedTypes = []string{"image/jpeg", "image/png"}

func UploadFile(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
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

	id := uuid.NewString()
	newFileName := fmt.Sprintf("%s.%s", id, fileFormat[1])
	destination := fmt.Sprintf("./uploads/%s", newFileName)
	for {
		if _, err := os.Stat(destination); err != nil {
			break
		}
		id = uuid.NewString()
		newFileName = fmt.Sprintf("%s.%s", id, fileFormat[1])
		destination = fmt.Sprintf("./uploads/%s", newFileName)
	}

	// check if the file already exists
	if _, err := os.Stat(destination); err == nil {
		return c.SendString("File already exists")
	}

	_, err = db_file.UploadFile(id, newFileName, file.Header.Get("Content-Type"), fileFormat[1], userId)
	if err != nil {
		return err
	}

	if err := c.SaveFile(file, destination); err != nil {
		return err
	}

	return c.SendString(newFileName)
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
