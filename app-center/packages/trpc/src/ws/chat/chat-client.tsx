import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { InputMessage } from "./input/message";
import { InputChatClass } from "./input/input";
import { IInputChannel } from "./input/channel";
import { InputInvite } from "./input/invite";
import {
  getChannelHandlers,
  getInviteHandlers,
  getMessagesHandlers,
} from "./handlers";
import { OutputChatClass } from "./output/output";

interface State {
  isConnected: boolean;
  isConnecting: boolean;
  isErrored: boolean;
}

interface ChatContextType {
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

  state: State;
  currentChannel?: IInputChannel | null;
  setCurrentChannel?: (channel: IInputChannel) => void;
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
});

export const ChatContextProvider = ({
  address,
  children,
}: PropsWithChildren<{ address: string }>) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<State>({
    isConnected: false,
    isConnecting: true,
    isErrored: false,
  });
  const [currentChannel, setCurrentChannel] = useState<IInputChannel | null>(
    null,
  );

  const [channels, setChannels] = useState<IInputChannel[]>([]);
  const [publicChannels, setPublicChannels] = useState<IInputChannel[]>([]);
  const [messages, setMessages] = useState<Record<string, InputMessage[]>>({});
  const [invites, setInvites] = useState<InputInvite[]>([]);

  const inputRef = useRef<InputChatClass | null>(
    new InputChatClass(
      getChannelHandlers(setChannels, setPublicChannels),
      getMessagesHandlers(setMessages),
      getInviteHandlers(setInvites),
    ),
  );
  const outputRef = useRef<OutputChatClass | null>(null);

  useEffect(() => {
    const url =
      "ws://" + address + "/ws/chat?token=" + localStorage.getItem("token");
    if (wsRef.current?.url === url) {
      return;
    }

    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => {
      setState({ isConnected: true, isConnecting: false, isErrored: false });
      outputRef.current = new OutputChatClass(wsRef.current!);
      outputRef.current.getMeChannels();
    };
    wsRef.current.onerror = () => {
      setState({ isConnected: false, isConnecting: false, isErrored: true });
    };
    wsRef.current.onclose = () => {
      setState({ isConnected: false, isConnecting: false, isErrored: false });
      outputRef.current = null;
    };
    wsRef.current.onmessage = (event) => {
      inputRef.current?.recieveMessage(JSON.parse(event.data));
    };

    return () => {};
  }, []);

  const values = useMemo(() => {
    const valuesMemo: ChatContextType = {
      channels: channels,
      publicChannels: publicChannels,
      messages: messages,
      invites: invites,
      state,
      channelsFunctions: {
        getChannels: outputRef?.current?.getMeChannels,
      },
      invitesFunctions: {},
      messagesFunctions: {
        getChannelMessages: (channelId: string) =>
          outputRef?.current?.getNewMessages({ channelId }) || null,
        sendNewMessage: (message: string, channelId: string) => {
          outputRef?.current?.sendMessage({
            channelId,
            text: message,
          });
        },
      },
    };
    return valuesMemo;
  }, [state, channels, publicChannels, messages, invites]);

  return (
    <ChatContext.Provider
      value={{
        ...values,
        currentChannel,
        setCurrentChannel: (channel: IInputChannel) => {
          if (currentChannel?.id === channel.id) {
            return;
          }
          if (messages[channel.id] === undefined) {
            outputRef?.current?.getNewMessages({ channelId: channel.id });
          }
          setCurrentChannel(channel);
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }
  return context;
};
