package messanger

type OutputInit struct {
	Messages []OutputMessage `json:"messages"`
}
type OutputMessage struct {
	UserId    string `json:"user"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}

func CreateMessage(userId string, content string, createdAt string) OutputMessage {
	return OutputMessage{
		UserId:    userId,
		Content:   content,
		CreatedAt: createdAt,
	}
}

type OutputError struct {
	Code  int    `json:"code"`
	Error string `json:"error"`
}

func CreateError(code int, error string) OutputError {
	return OutputError{
		Code:  code,
		Error: error,
	}
}
