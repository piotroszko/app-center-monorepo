export type IOutputMessage =
  | baseGetMessage
  | baseNewMessage
  | baseActionMessage
  | baseInviteMessage
  | baseActionChannel
  | baseGetChannel;

interface baseGetMessage {
  type: "getMessage";
  getMessage: getMessage;
}

interface baseNewMessage {
  type: "newMessage";
  newMessage: newMessage;
}

interface baseActionMessage {
  type: "actionMessage";
  actionMessage: actionMessage;
}
interface baseInviteMessage {
  type: "inviteMessage";
  inviteMessage: inviteChannel;
}

interface baseActionChannel {
  type: "actionChannel";
  actionChannel: actionChannel;
}

interface baseGetChannel {
  type: "getChannel";
  getChannel?: getChannel;
}

/////////////////////////////////

type getChannel = GetChannelsMe | GetChannelsPublic;

interface GetChannelsMe {
  type: "get-for-me";
}

interface GetChannelsPublic {
  type: "get-public";
}

/////////////////////////////////

type actionChannel =
  | ActionChannelEdit
  | ActionChannelLeave
  | ActionChannelCreate
  | ActionChannelDelete
  | ActionChannelJoin;

interface ActionChannelCreate {
  type: "create";
  name: string;
  description?: string;
  channelType: "public" | "private" | "group";
  usersIds?: string[];
}

interface ActionChannelEdit {
  type: "edit";
  channelId: string;
  name: string;
  description?: string;
}

interface ActionChannelLeave {
  type: "leave";
  channelId: string;
}

interface ActionChannelDelete {
  type: "delete";
  channelId: string;
}

interface ActionChannelJoin {
  type: "join-public";
  channelId: string;
}

/////////////////////////////////

type inviteChannel = AcceptInvite | DeclineInvite | SendInvite;

interface AcceptInvite {
  type: "accept";
  inviteId: string;
}

interface DeclineInvite {
  type: "decline";
  inviteId: string;
}

interface SendInvite {
  type: "send";
  channelId: string;
  userId: string;
  data?: string;
}

/////////////////////////////////

type actionMessage =
  | ActionMessageEdit
  | ActionMessageDelete
  | ActionMessagesDelete;

interface ActionMessageEdit {
  type: "edit";
  messageId: number;
  text: string;
}

interface ActionMessageDelete {
  type: "delete";
  messageId: number;
  channelId: string;
}

interface ActionMessagesDelete {
  type: "delete";
  messageIds: number[];
  channelId: string;
}

/////////////////////////////////

type newMessage = NewMessage | AnswerMessage;

interface NewMessage {
  type: "new";
  channelId: string;
  text: string;
}

interface AnswerMessage {
  type: "answer";
  channelId: string;
  messageId: number;
  text: string;
}

/////////////////////////////////

type getMessage = GetNewMessages | GetOldMessages;

interface GetNewMessages {
  type: "newest";
  channelId: string;
  amount?: number;
}

interface GetOldMessages {
  type: "history";
  channelId: string;
  amount?: number;
  messageId: number;
}
