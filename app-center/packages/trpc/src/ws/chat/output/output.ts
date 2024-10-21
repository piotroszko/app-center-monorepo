import {
  CreateChannelProps,
  DeleteChannelProps,
  EditChannelProps,
  JoinChannelProps,
  LeaveChannelProps,
  OutputChannel,
} from "./channel/channel";
import {
  InviteAcceptProps,
  InviteDeclineProps,
  InviteSendProps,
  OutputInvite,
} from "./invite/invite";
import {
  AnswerMessageProps,
  DeleteMessageProps,
  DeleteMessagesProps,
  EditMessageProps,
  GetNewMessagesProps,
  GetOldMessagesProps,
  NewMessageProps,
  OutputMessage,
} from "./message/message";

export class OutputChatClass {
  ws: WebSocket | null = null;
  constructor(ws: WebSocket) {
    this.ws = ws;
  }
  // get messages
  public getNewMessages(props: GetNewMessagesProps) {
    OutputMessage.getNewMessages(this.ws || new WebSocket(""), props);
  }
  public getOldMessages(props: GetOldMessagesProps) {
    OutputMessage.getOldMessages(this.ws || new WebSocket(""), props);
  }
  // send messages
  public sendMessage(props: NewMessageProps) {
    OutputMessage.newMessage(this.ws || new WebSocket(""), props);
  }
  public answerMessage(props: AnswerMessageProps) {
    OutputMessage.answerMessage(this.ws || new WebSocket(""), props);
  }
  // action messages
  public editMessage(props: EditMessageProps) {
    OutputMessage.editMessage(this.ws || new WebSocket(""), props);
  }
  public deleteMessage(props: DeleteMessageProps) {
    OutputMessage.deleteMessage(this.ws || new WebSocket(""), props);
  }
  public deleteMessages(props: DeleteMessagesProps) {
    OutputMessage.deleteMessages(this.ws || new WebSocket(""), props);
  }
  // invite
  public sendInvite(props: InviteSendProps) {
    OutputInvite.inviteUser(this.ws || new WebSocket(""), props);
  }
  public acceptInvite(props: InviteAcceptProps) {
    OutputInvite.acceptInvite(this.ws || new WebSocket(""), props);
  }
  public declineInvite(props: InviteDeclineProps) {
    OutputInvite.declineInvite(this.ws || new WebSocket(""), props);
  }
  // channel
  public getMeChannels() {
    OutputChannel.getChannels(this.ws || new WebSocket(""));
  }
  public getPublicChannels() {
    OutputChannel.getPublicChannels(this.ws || new WebSocket(""));
  }
  public joinChannel(props: JoinChannelProps) {
    OutputChannel.joinChannel(this.ws || new WebSocket(""), props);
  }
  public deleteChannel(props: DeleteChannelProps) {
    OutputChannel.deleteChannel(this.ws || new WebSocket(""), props);
  }
  public leaveChannel(props: LeaveChannelProps) {
    OutputChannel.leaveChannel(this.ws || new WebSocket(""), props);
  }
  public editChannel(props: EditChannelProps) {
    OutputChannel.editChannel(this.ws || new WebSocket(""), props);
  }
  public createChannel(props: CreateChannelProps) {
    OutputChannel.createChannel(this.ws || new WebSocket(""), props);
  }
}
