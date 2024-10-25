import { createContext } from "react";
import { IInputChannel } from "./input/channel";
import { InputInvite } from "./input/invite";
import { InputMessage } from "./input/message";

export interface ChatState {
  isConnected: boolean;
  isConnecting: boolean;
  isErrored: boolean;
}

export interface ChatContextType {
  messagesFunctions: {
    sendNewMessage?: (message: string, channelId: string) => void;
    answerMessage?: (message: string, id: number) => void;
    deleteMessage?: (id: number) => void;
    getChannelMessages?: (channelId: string) => void;
    getOlderChannelMessages?: (channelId: number, id: number) => void;
  };
  channelsFunctions: {
    getChannels?: () => void;
    getPublicChannels?: () => void;
    createChannel?: (name: string) => void;
    joinChannel?: (id: number) => void;
    leaveChannel?: (id: number) => void;
  };
  invitesFunctions: {
    getInvites?: () => void;
    acceptInvite?: (id: number) => void;
    declineInvite?: (id: number) => void;
    sendInvite?: (channelId: number, userId: number) => void;
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
