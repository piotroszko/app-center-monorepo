package redis_chat

import (
	"context"
)

type ChannelCache struct {
}

var Channel = ChannelCache{}

func (ChannelCache) AddChannel(channelID string, users []string) error {
	var usersInterface []interface{}
	for _, user := range users {
		usersInterface = append(usersInterface, user)
	}
	return RedisClient.LPush(context.Background(), "channels-"+channelID, usersInterface...).Err()
}

func (ChannelCache) AddUserToChannel(channelID, userID string) error {
	return RedisClient.LPush(context.Background(), "channels-"+channelID, userID).Err()
}

func (ChannelCache) GetUsers(channelID string) ([]string, error) {
	return RedisClient.LRange(context.Background(), "channels-"+channelID, 0, -1).Result()
}

func (ChannelCache) RemoveChannel(channelID, userID string) error {
	return RedisClient.Del(context.Background(), "channels-"+channelID).Err()
}

func (ChannelCache) RemoveUserFromChannel(channelID, userID string) error {
	return RedisClient.LRem(context.Background(), "channels-"+channelID, 0, userID).Err()
}
