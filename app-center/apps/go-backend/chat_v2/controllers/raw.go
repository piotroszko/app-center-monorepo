package controllers

import (
	"fmt"
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
)

func RawHandler(user *models.User, rawMessage input.RawPayload) error {
	switch input.ParseRaw.ParseMessageType(rawMessage) {
	// Messages
	case input.GetMessagePayload:
		{
			switch input.ParseGetMessage.ParseGetMessageType(rawMessage) {
			case input.NewestMessages:
				{
					parsedMessage, err := input.ParseGetMessage.ParseNewGetMessage(rawMessage)
					if err != nil {
						return err
					}
					return GetMessagesNewest(user, parsedMessage)
				}
			case input.OlderMessages:
				{
					parsedMessage, err := input.ParseGetMessage.ParseOlderGetMessage(rawMessage)
					if err != nil {
						return err
					}
					return GetMessagesHistory(user, parsedMessage)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	case input.NewMessagePayload:
		{
			switch input.ParseNewMessage.ParseNewMessageType(rawMessage) {
			case input.AddMessage:
				{
					parsedMessage, err := input.ParseNewMessage.ParseNewMessageChannelId(rawMessage)
					if err != nil {
						return err
					}
					return AddMessage(user, parsedMessage)
				}
			case input.AnswerMessage:
				{
					parsedMessage, err := input.ParseNewMessage.ParseAnswerMessage(rawMessage)
					if err != nil {
						return err
					}
					return AnswerMessage(user, parsedMessage)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	case input.ActionMessagePayload:
		{
			switch input.ParseActionMessage.ParseActionMessageType(rawMessage) {
			case input.EditMessage:
				{
					parsedMessage, err := input.ParseActionMessage.ParseEditMessage(rawMessage)
					if err != nil {
						return err
					}
					return EditMessage(user, parsedMessage)
				}
			case input.DeleteMessage:
				{
					parsedMessage, err := input.ParseActionMessage.ParseDeleteMessage(rawMessage)
					if err != nil {
						return err
					}
					return DeleteMessage(user, parsedMessage)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	// Invites
	case input.InviteMessagePayload:
		{
			switch input.ParseInvite.ParseInviteType(rawMessage) {
			case input.AcceptInvite:
				{
					parsedMessage, err := input.ParseInvite.ParseAcceptInvite(rawMessage)
					if err != nil {
						return err
					}
					return AcceptInvite(user, parsedMessage)
				}
			case input.DeclineInvite:
				{
					parsedMessage, err := input.ParseInvite.ParseDeclineInvite(rawMessage)
					if err != nil {
						return err
					}
					return DeclineInvite(user, parsedMessage)
				}
			case input.SendInvite:
				{
					parsedMessage, err := input.ParseInvite.ParseSendInvite(rawMessage)
					if err != nil {
						return err
					}
					return InviteUser(user, parsedMessage)
				}
			case input.GetInvites:
				{
					return GetInvitesForUser(user)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	// Channels
	case input.ChannelActionPayload:
		{
			switch input.ParseActionChannel.ParseActionChannelType(rawMessage) {
			case input.CreateChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseCreateChannel(rawMessage)
					if err != nil {
						return err
					}
					return CreateChannel(user, parsedMessage)
				}
			case input.DeleteChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseDeleteChannel(rawMessage)
					if err != nil {
						return err
					}
					return DeleteChannel(user, parsedMessage)
				}
			case input.EditChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseEditChannel(rawMessage)
					if err != nil {
						return err
					}
					return EditChannel(user, parsedMessage)
				}
			case input.LeaveChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseLeaveChannel(rawMessage)
					if err != nil {
						return err
					}
					return LeaveChannel(user, parsedMessage)
				}
			case input.JoinPublicChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseJoinPublicChannel(rawMessage)
					if err != nil {
						return err
					}
					return JoinPublicChannel(user, parsedMessage)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	case input.ChannelGetPayload:
		{
			switch input.ParseGetChannel.ParseGetChannelType(rawMessage) {
			case input.GetChannelsForMe:
				{
					return GetChannels(user)
				}
			case input.GetPublic:
				{
					return GetPublicChannels(user)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}

		}
	default:
		{
			fmt.Println("Unknown message type")
		}
	}
	return nil
}
