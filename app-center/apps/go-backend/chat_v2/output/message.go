package output

import (
	"go-backend/prisma/db"
	"time"
)

type MessageAction string

const (
	ActionNewMessage    MessageAction = "new"
	ActionEditMessage   MessageAction = "edit"
	ActionDeleteMessage MessageAction = "delete"
	ActionGetMessage    MessageAction = "get"
)

type OutputAnswerParent struct {
	ID   int        `json:"id"`
	Text string     `json:"text"`
	User OutputUser `json:"user"`
}

type OutputMessage struct {
	Type      MessageAction      `json:"type"`
	ID        int                `json:"id"`
	ChannelID string             `json:"channelId"`
	Text      string             `json:"text"`
	User      OutputUser         `json:"user"`
	CreatedAt string             `json:"createdAt"`
	UpdateAt  string             `json:"updateAt"`
	Ansewer   OutputAnswerParent `json:"ansewerTo"`

	// TODO: Not implemented yet
	ImagesUrls []string `json:"imagesUrls"`
	VideosUrls []string `json:"videosUrls"`
	FilesUrls  []string `json:"filesUrls"`
}

type OutputEditMessage struct {
	Type      MessageAction `json:"type"`
	ID        int           `json:"id"`
	ChannelID string        `json:"channelId"`
	Text      string        `json:"text"`
	UpdateAt  string        `json:"updateAt"`
}

type OutputDeleteMessage struct {
	Type      MessageAction `json:"type"`
	ID        int           `json:"id"`
	ChannelID string        `json:"channelId"`
}

type OutputMessagesHistory struct {
	ChannelID string          `json:"channelId"`
	Messages  []OutputMessage `json:"messages"`
}

func parseMessageToOutputMessage(message *db.MessageModel) OutputMessage {
	answer, ok := message.Message()
	var messageOutput OutputMessage
	if ok {
		messageOutput = OutputMessage{
			Type:      ActionNewMessage,
			ID:        message.ID,
			ChannelID: message.ChannelID,
			Text:      message.Content,
			User:      GetOutputUser(*message.User()),
			CreatedAt: time.Time.String(message.CreatedAt),
			UpdateAt:  time.Time.String(message.UpdatedAt),
			Ansewer: OutputAnswerParent{
				ID:   answer.ID,
				Text: answer.Content,
				User: GetOutputUser(*answer.User()),
			},
		}
	} else {
		messageOutput = OutputMessage{
			Type:      ActionNewMessage,
			ID:        message.ID,
			ChannelID: message.ChannelID,
			Text:      message.Content,
			User:      GetOutputUser(*message.User()),
			CreatedAt: time.Time.String(message.CreatedAt),
			UpdateAt:  time.Time.String(message.UpdatedAt),
		}
	}
	return messageOutput
}

func SendMessagesHistory(channelId string, messages []db.MessageModel, userId string) error {
	var outputMessages []OutputMessage
	for _, message := range messages {
		outputMessages = append(outputMessages, parseMessageToOutputMessage(&message))
	}
	sendMessage(OutputMessagesHistory{
		ChannelID: channelId,
		Messages:  outputMessages,
	}, userId)
	return nil
}

func SendMessage(channel *db.ChannelModel, message *db.MessageModel) error {
	usersToSend := getAllUsersToSendMessage(channel)
	sendMessage(parseMessageToOutputMessage(message), usersToSend...)
	return nil
}

func SendEditMessage(channel *db.ChannelModel, message *db.MessageModel) error {
	usersToSend := getAllUsersToSendMessage(channel)
	sendMessage(OutputEditMessage{
		Type:      ActionEditMessage,
		ID:        message.ID,
		ChannelID: message.ChannelID,
		Text:      message.Content,
		UpdateAt:  time.Time.String(message.UpdatedAt),
	}, usersToSend...)
	return nil
}
