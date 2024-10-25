import { createContext } from "react";
import { IInputChannel } from "./input/channel";
import { InputInvite } from "./input/invite";
import { InputMessage } from "./input/message";
import {
  CreateChannelProps,
  JoinChannelProps,
  LeaveChannelProps,
} from "./output/channel/channel";
import {
  InviteAcceptProps,
  InviteDeclineProps,
  InviteSendProps,
} from "./output/invite/invite";
import {
  AnswerMessageProps,
  DeleteMessageProps,
  GetNewMessagesProps,
  GetOldMessagesProps,
  NewMessageProps,
} from "./output/message/message";

export interface ChatState {
  isConnected: boolean;
  isConnecting: boolean;
  isErrored: boolean;
}

export interface ChatContextType {
  messagesFunctions: {
    sendNewMessage?: (values: NewMessageProps) => void;
    answerMessage?: (values: AnswerMessageProps) => void;
    deleteMessage?: (values: DeleteMessageProps) => void;
    getChannelMessages?: (values: GetNewMessagesProps) => void;
    getOlderChannelMessages?: (values: GetOldMessagesProps) => void;
  };
  channelsFunctions: {
    getChannels?: () => void;
    getPublicChannels?: () => void;
    createChannel?: (values: CreateChannelProps) => void;
    joinChannel?: (values: JoinChannelProps) => void;
    leaveChannel?: (values: LeaveChannelProps) => void;
  };
  invitesFunctions: {
    getInvites?: () => void;
    acceptInvite?: (values: InviteAcceptProps) => void;
    declineInvite?: (values: InviteDeclineProps) => void;
    sendInvite?: (values: InviteSendProps) => void;
  };

  channels: IInputChannel[];
  publicChannels: IInputChannel[];
  invites: InputInvite[];
  messages: Record<string, InputMessage[]>;

  state: ChatState;
  currentChannel?: IInputChannel | null;
  setCurrentChannel?: (channel: IInputChannel) => void;
  setAllInvitesSeen?: () => void;
  isNewInvites?: boolean;
}
export const ChatContext = createContext<ChatContextType>({
  channels: [],
  publicChannels: [],
  invites: [],
  messages: {},
  state: { isConnected: false, isConnecting: true, isErrored: false },
  messagesFunctions: {},
  channelsFunctions: {},
  invitesFunctions: {},
  currentChannel: null,
  setCurrentChannel: () => {},
  setAllInvitesSeen: () => {},
  isNewInvites: false,
});
