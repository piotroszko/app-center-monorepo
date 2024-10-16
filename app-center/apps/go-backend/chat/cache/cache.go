package cache_chat

import (
	"go-backend/chat/models"
	"go-backend/prisma/db"
	"sync"
)

type Cache struct {
	messageMutex      sync.RWMutex
	messageCache      map[string][]db.MessageModel // key: roomID, value: messages
	userChannelsMutex sync.RWMutex
	userChannels      map[string][]db.ChannelModel // key: userID, value: roomIDs
}

func NewCache() *Cache {
	return &Cache{
		messageMutex:      sync.RWMutex{},
		messageCache:      make(map[string][]db.MessageModel),
		userChannelsMutex: sync.RWMutex{},
		userChannels:      make(map[string][]db.ChannelModel),
	}
}

func (c *Cache) AddMessage(roomID string, message db.MessageModel) {
	c.messageMutex.Lock()
	defer c.messageMutex.Unlock()
	c.messageCache[roomID] = append(c.messageCache[roomID], message)
}

func (c *Cache) AddMessageToChannel(room db.ChannelModel, message db.MessageModel) {
	c.messageMutex.Lock()
	defer c.messageMutex.Unlock()
	c.messageCache[room.ID] = append(c.messageCache[room.ID], message)
}

func (c *Cache) AddOldMessages(roomID string, messages []string) {
	c.messageMutex.Lock()
	defer c.messageMutex.Unlock()
	models.SortMessages(c.messageCache[roomID])

}
