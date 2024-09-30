package redis_chat

import (
	"context"
	"go-backend/chat/models"
	"strconv"
)

type ChannelCache struct {
}

func (ch *ChannelCache) AddChannel(channelID string, users []string) error {
	var usersInterface []interface{}
	for _, user := range users {
		usersInterface = append(usersInterface, user)
	}
	return RedisClient.LPush(context.Background(), "channels-"+channelID, usersInterface...).Err()
}

func (ch *ChannelCache) AddUserToChannel(channelID, userID string) error {
	return RedisClient.LPush(context.Background(), "channels-"+channelID, userID).Err()
}

func (ch *ChannelCache) GetUsers(channelID string) ([]string, error) {
	return RedisClient.LRange(context.Background(), "channels-"+channelID, 0, -1).Result()
}

func (ch *ChannelCache) RemoveChannel(channelID, userID string) error {
	return RedisClient.Del(context.Background(), "channels-"+channelID).Err()
}

func (ch *ChannelCache) RemoveUserFromChannel(channelID, userID string) error {
	return RedisClient.LRem(context.Background(), "channels-"+channelID, 0, userID).Err()
}

type MessageCache struct {
}

func (msgs *MessageCache) SaveMessage(message models.Message) error {
	channelName, err := message.GetStreamName()
	if err != nil {
		return err
	}
	index, err := RedisClient.LPush(context.Background(), "msgs-"+channelName, message).Result()
	if err != nil {
		return err
	}
	_, err = RedisClient.HSet(context.Background(), "msgs-ids-"+channelName, message.ID, index).Result()
	if err != nil {
		return err
	}
	return nil
}

func (msgs *MessageCache) GetMessages(channelID string, fromId string, amount int) ([]models.Message, error) {
	ctx := context.Background()
	// check if the channel exists
	_, err1 := RedisClient.Exists(ctx, "msgs-"+channelID).Result()
	_, err2 := RedisClient.Exists(ctx, "msgs-ids-"+channelID).Result()
	if err1 != nil || err2 != nil {
		if err1 != nil {
			return nil, err1
		}
		return nil, err2
	}
	// get the message index
	index, err := RedisClient.HGet(ctx, "msgs-ids-"+channelID, fromId).Result()
	if err != nil {
		return nil, err
	}
	indexInt, err := strconv.Atoi(index)
	if err != nil {
		return nil, err
	}
	// get the messages
	messages, err := RedisClient.LRange(ctx, "msgs-"+channelID, int64(indexInt), int64(indexInt+amount)).Result()
	if err != nil {
		return nil, err
	}
	// data to json and to model
	var result []models.Message
	for _, message := range messages {
		msg := models.Message{}
		err := msg.FromJSON([]byte(message))
		if err != nil {
			return nil, err
		}
		result = append(result, msg)
	}

	return result, nil
}

func (msgs *MessageCache) GetNewMessages(channelID string, amount int) ([]models.Message, error) {
	ctx := context.Background()
	// check if the channel exists
	_, err1 := RedisClient.Exists(ctx, "msgs-"+channelID).Result()
	_, err2 := RedisClient.Exists(ctx, "msgs-ids-"+channelID).Result()
	if err1 != nil || err2 != nil {
		if err1 != nil {
			return nil, err1
		}
		return nil, err2
	}
	// get amount of newest messages
	messages, err := RedisClient.LRange(ctx, "msgs-"+channelID, 0, int64(amount)).Result()
	if err != nil {
		return nil, err
	}
	// data to json and to model
	var result []models.Message
	for _, message := range messages {
		msg := models.Message{}
		err := msg.FromJSON([]byte(message))
		if err != nil {
			return nil, err
		}
		result = append(result, msg)
	}

	return result, nil
}
