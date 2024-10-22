/* eslint-disable no-unused-vars */
import {
  BaseInputChannelMessage,
  ChannelMessageType,
  IsChannelMessage,
} from "./channel";
import {
  BaseInputInviteMessage,
  InviteMessageType,
  IsInviteMessage,
} from "./invite";
import { BaseInputMessages, IsAnyOfMessageTypes, MessageType } from "./message";

export interface PropsChannelRecieve {
  onChannelEdit: (input: BaseInputChannelMessage) => void;
  onChannelGet: (input: BaseInputChannelMessage) => void;
  onChannelNew: (input: BaseInputChannelMessage) => void;
  onChannelDelete: (input: BaseInputChannelMessage) => void;
  onChannelLeave: (input: BaseInputChannelMessage) => void;
  onChannelJoin: (input: BaseInputChannelMessage) => void;
  onChannelGetPublic: (input: BaseInputChannelMessage) => void;
}

export interface PropsMessageRecieve {
  onMessageEdit: (input: BaseInputMessages) => void;
  onMessageGet: (input: BaseInputMessages) => void;
  onMessageNew: (input: BaseInputMessages) => void;
  onMessageDelete: (input: BaseInputMessages) => void;
}

export interface PropsInviteRecieve {
  onInviteGet: (input: BaseInputInviteMessage) => void;
  onInviteNew: (input: BaseInputInviteMessage) => void;
  onInviteDelete: (input: BaseInputInviteMessage) => void;
  onAcceptInvite: (input: BaseInputInviteMessage) => void;
}

export class InputChatClass {
  private channelHandlers: PropsChannelRecieve;
  private messageHandlers: PropsMessageRecieve;
  private inviteHandlers: any;

  constructor(
    channelHandlers: PropsChannelRecieve,
    messageHandlers: PropsMessageRecieve,
    inviteHandlers: PropsInviteRecieve,
  ) {
    this.channelHandlers = channelHandlers;
    this.messageHandlers = messageHandlers;
    this.inviteHandlers = inviteHandlers;
  }

  public recieveMessage = (input: any) => {
    console.log(
      input,
      IsChannelMessage(input),
      IsAnyOfMessageTypes(input),
      IsInviteMessage(input),
    );
    if (IsChannelMessage(input)) {
      console.log("Channel message", input);
      switch (input.type as ChannelMessageType) {
        case ChannelMessageType.EDIT: {
          this.channelHandlers.onChannelEdit(input);
          break;
        }
        case ChannelMessageType.GET: {
          console.log("GET", input);
          this.channelHandlers.onChannelGet(input);
          break;
        }
        case ChannelMessageType.NEW: {
          this.channelHandlers.onChannelNew(input);
          break;
        }
        case ChannelMessageType.DELETE: {
          this.channelHandlers.onChannelDelete(input);
          break;
        }
        case ChannelMessageType.LEAVE: {
          this.channelHandlers.onChannelLeave(input);
          break;
        }
        case ChannelMessageType.JOIN: {
          this.channelHandlers.onChannelJoin(input);
          break;
        }
        case ChannelMessageType.GET_PUBLIC: {
          this.channelHandlers.onChannelGetPublic(input);
          break;
        }
        default: {
          console.error("Invalid type");
          break;
        }
      }
    }
    if (IsAnyOfMessageTypes(input)) {
      switch (input.type) {
        case MessageType.GET: {
          console.log("GET", input);
          this.messageHandlers.onMessageGet(input);
          break;
        }
        case MessageType.NEW: {
          this.messageHandlers.onMessageNew(input);
          break;
        }
        case MessageType.DELETE: {
          this.messageHandlers.onMessageDelete(input);
          break;
        }
        case MessageType.EDIT: {
          this.messageHandlers.onMessageEdit(input);
          break;
        }
      }
    }
    if (IsInviteMessage(input)) {
      switch (input.type) {
        case InviteMessageType.GET: {
          this.inviteHandlers.onInviteGet(input);
          break;
        }
        case InviteMessageType.NEW: {
          this.inviteHandlers.onInviteNew(input);
          break;
        }
        case InviteMessageType.DELETED: {
          this.inviteHandlers.onInviteDelete(input);
          break;
        }
        case InviteMessageType.ACCEPTED: {
          this.inviteHandlers.onAcceptInvite(input);
          break;
        }
      }
    }
  };
}
