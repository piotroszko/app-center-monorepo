package output

type MessageAction string

const (
	ActionNewMessage    MessageAction = "new"
	ActionEditMessage   MessageAction = "edit"
	ActionDeleteMessage MessageAction = "delete"
	ActionGetMessage    MessageAction = "get"
)

type OutputMessage struct {
	Type        MessageAction `json:"type"`
	ID          int           `json:"id"`
	ChannelID   string        `json:"channelId"`
	Text        string        `json:"text"`
	User        OutputUser    `json:"user"`
	CreatedAt   string        `json:"createdAt"`
	UpdateAt    string        `json:"updateAt"`
	AnsewerToId int           `json:"ansewerToId"`

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
