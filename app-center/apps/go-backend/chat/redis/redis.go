package redis_chat

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client
var UserChannels = make(map[string]*redis.PubSub)

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err := RedisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal(err)
	}
}

func PublishMessageToAllActiveUsers(message string, usersIds ...string) {
	for _, user := range usersIds {
		if UserChannels[user] != nil {
			RedisClient.Publish(context.Background(), user, message)
		}
	}
}

func SubscribeToChannelForUser(userID string) (*redis.PubSub, func()) {
	return RedisClient.Subscribe(context.Background(), userID), func() {
		if _, ok := UserChannels[userID]; ok {
			UserChannels[userID].Close()
			delete(UserChannels, userID)
		}
	}
}
