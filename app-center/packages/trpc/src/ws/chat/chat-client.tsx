"use client";
import React, {
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
import { useInviteSeen } from "./useInviteSeen";
import { ChatContext, ChatContextType, ChatState } from "./chat-context";

export const ChatContextProvider = ({
  address,
  children,
}: PropsWithChildren<{ address: string }>) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<ChatState>({
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
  const { isNewInvites, setAllInvitesSeen } = useInviteSeen(invites);

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
      outputRef.current.getInvites();
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
      invitesFunctions: {
        getInvites: outputRef?.current?.getInvites,
      },
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
      setAllInvitesSeen,
      isNewInvites,
      setCurrentChannel: (channel: IInputChannel) => {
        if (currentChannel?.id === channel.id) {
          return;
        }
        if (messages[channel.id] === undefined) {
          outputRef?.current?.getNewMessages({ channelId: channel.id });
        }
        setCurrentChannel(channel);
      },
      currentChannel,
    };
    return valuesMemo;
  }, [
    state,
    channels,
    publicChannels,
    messages,
    invites,
    setAllInvitesSeen,
    isNewInvites,
    currentChannel,
    outputRef,
  ]);

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }
  return context;
};
