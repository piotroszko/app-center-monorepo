package models

import (
	"errors"
)

type ChannelType string

const (
	PrivateType ChannelType = "private"
	GroupType   ChannelType = "group"
	RoomType    ChannelType = "room"
)

func (m *Message) GetStreamName() (string, error) {

	switch ChannelType(m.ChannelType) {
	case PrivateType:
		{
			if m.SenderID < m.ReceiverID {
				return m.SenderID + "-" + m.ReceiverID, nil
			}
			return m.ReceiverID + "-" + m.SenderID, nil
		}
	case GroupType:
		{
			return m.GroupID, nil
		}
	case RoomType:
		{
			return m.RoomID, nil
		}
	}

	return "", errors.New("Unknown channel type")
}
