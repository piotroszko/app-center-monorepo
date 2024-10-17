package controllers

import (
	"fmt"
	"go-backend/chat_v2/input"
	"go-backend/chat_v2/models"
)

func RawHandler(user *models.User, rawMessage input.RawPayload) error {
	switch input.ParseRaw.ParseMessageType(rawMessage) {
	case input.GetMessagePayload:
		{
			switch input.ParseGetMessage.ParseGetMessageType(rawMessage) {
			case input.NewestMessages:
				{
					parsedMessage, err := input.ParseGetMessage.ParseNewGetMessage(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.OlderMessages:
				{
					parsedMessage, err := input.ParseGetMessage.ParseOlderGetMessage(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
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
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.AnswerMessage:
				{
					parsedMessage, err := input.ParseNewMessage.ParseAnswerMessage(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
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
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.DeleteMessage:
				{
					parsedMessage, err := input.ParseActionMessage.ParseDeleteMessage(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	case input.InviteMessagePayload:
		{
			switch input.ParseInvite.ParseInviteType(rawMessage) {
			case input.AcceptInvite:
				{
					parsedMessage, err := input.ParseInvite.ParseAcceptInvite(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.DeclineInvite:
				{
					parsedMessage, err := input.ParseInvite.ParseDeclineInvite(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.SendInvite:
				{
					parsedMessage, err := input.ParseInvite.ParseSendInvite(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.GetInvites:
				{
					// TODO: Send all invites for current user
				}
			default:
				{
					fmt.Println("Unknown message type")
				}
			}
		}
	case input.ChannelActionPayload:
		{
			switch input.ParseActionChannel.ParseActionChannelType(rawMessage) {
			case input.CreateChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseCreateChannel(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.DeleteChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseDeleteChannel(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.EditChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseEditChannel(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
				}
			case input.LeaveChannel:
				{
					parsedMessage, err := input.ParseActionChannel.ParseLeaveChannel(rawMessage)
					if err != nil {
						return err
					}
					// TODO: Implement
					fmt.Println(parsedMessage)
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
					// TODO: Send all channels for current user
				}
			case input.GetPublic:
				{
					// TODO: Send all public channels
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
