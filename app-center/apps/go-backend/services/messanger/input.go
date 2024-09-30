package messanger

import (
	"errors"
	"fmt"
	"strings"

	"github.com/lxzan/gws"
)

func TrimAndPrepareData(data []byte) (string, error) {
	parsed := strings.TrimSpace(strings.Replace(string(data), "\x00", "", -1))
	hasJsonStruct := strings.HasPrefix(parsed, "{") && strings.HasSuffix(parsed, "}")
	if !hasJsonStruct {
		return "", errors.New("invalid request")
	}
	return parsed, nil
}
func GetChannel(socket *gws.Conn) (string, error) {
	channel, exist := socket.Session().Load("channel")
	if !exist {
		return "", errors.New("channel not found")
	}
	return channel.(string), nil
}
func GetId(socket *gws.Conn) (string, error) {
	id, exist := socket.Session().Load("id")
	if !exist {
		return "", errors.New("id not found")
	}
	return id.(string), nil
}

func SendInvalidRequest(socket *gws.Conn, message *gws.Message) {
	errorMsg := OutputError{Code: 400, Error: "Invalid request"}
	socket.WriteMessage(message.Opcode, []byte(fmt.Sprintf(`{"code":%d,"error":"%s"}`, errorMsg.Code, errorMsg.Error)))
}
