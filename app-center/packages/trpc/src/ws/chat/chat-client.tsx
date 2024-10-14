import { extendWith, isArray, isObject } from "lodash";
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
  createdAt: string;
  channelID: string;
}

export interface ChatContextType {
  ws: WebSocket | null;
  channels: Channel[];
  currentChannel: Channel | null;
  setCurrentChannel: (channel: Channel) => void;
  messages: Message[];
  sendMessage: (content: string) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const SendGetChannels = (ws: WebSocket) => {
  ws.send(JSON.stringify({ type: "get-channels" }));
};

const SendCreateRoom = (ws: WebSocket, name: string) => {
  ws.send(JSON.stringify({ type: "create-room", content: name }));
};

const SendNewestMessages = (ws: WebSocket, channelId: string) => {
  ws.send(
    JSON.stringify({ type: "get-newest", channelID: channelId, amount: 10 }),
  );
};
const SendNewMessage = (ws: WebSocket, channelId: string, content: string) => {
  ws.send(
    JSON.stringify({
      type: "message",
      channelID: channelId,
      content: content,
    }),
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
        if (isArrayOfMessages(data)) {
          setMessages((prev) => {
            const newMessages = [...prev, ...data];
            newMessages.sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            });
            return newMessages;
          });
          return;
        } else {
          setChannels(data);
          return;
        }
      }
      if (isObject(data)) {
        if (isObjectAMessage(data)) {
          setMessages((prev) => [...prev, data]);
          return;
        }
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
          SendNewestMessages(wsRef.current!, channel.id);
        },
        messages,
        sendMessage: (content) => {
          if (currentChannel) {
            SendNewMessage(wsRef.current!, currentChannel.id, content);
          }
        },
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

const isArrayOfMessages = (data: any): data is Message[] => {
  return (
    isArray(data) &&
    data.every(
      (item) =>
        item.id &&
        item.content &&
        (!(data as any)?.type || (data as any)?.type === "message"),
    )
  );
};

const isObjectAMessage = (data: any): data is Message => {
  return data.id && data.content && (!data.type || data.type === "message");
};
