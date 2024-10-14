import { extendWith, isArray } from "lodash";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface Message {
  id: string;
  content: string;
  user: string;
  userId: string;
}

export interface ChatContextType {
  ws: WebSocket | null;
  channels: Channel[];
  currentChannel: Channel | null;
  setCurrentChannel: (channel: Channel) => void;
  messages: Message[];
}

export const ChatContext = createContext<ChatContextType | null>(null);

const SendGetChannels = (ws: WebSocket) => {
  ws.send(JSON.stringify({ type: "get-channels" }));
};

const SendCreateRoom = (ws: WebSocket, name: string) => {
  ws.send(JSON.stringify({ type: "create-room", content: name }));
};

const GetNewestMessages = (ws: WebSocket, channelId: string) => {
  ws.send(
    JSON.stringify({ type: "get-newest", channelID: channelId, amount: 10 }),
  );
};

export const ChatContextProvider = ({
  address,
  children,
}: PropsWithChildren<{ address: string }>) => {
  const wsRef = useRef<WebSocket | null>(null);

  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const url =
      "ws://" + address + "/ws/chat?token=" + localStorage.getItem("token");
    if (wsRef.current?.url === url) {
      return;
    }

    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => {
      SendGetChannels(wsRef.current!);
    };
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (isArray(data)) {
        setChannels(data);
      }
    };
    return () => {};
  }, [currentChannel]);

  return (
    <ChatContext.Provider
      value={{
        ws: wsRef.current,
        channels,
        currentChannel,
        setCurrentChannel: (channel) => {
          setCurrentChannel(channel);
          GetNewestMessages(wsRef.current!, channel.id);
        },
        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatContextProvider");
  }

  return ctx;
};
