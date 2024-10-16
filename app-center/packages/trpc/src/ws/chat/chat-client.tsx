import { isArray, isObject } from "lodash";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  users: User[];
}
interface MessagesForChannel {
  channelId: string;
  messages: Message[];
}
interface Message {
  id: string;
  content: string;
  User: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  channelId: string;
}

export interface ChatContextType {
  ws: WebSocket | null;
  channels: Channel[];
  currentChannel: Channel | null;
  setCurrentChannel: (channel: Channel) => void;
  messages: Record<string, Message[]>;
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
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
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
        return;
      }
      if (isObject(data)) {
        if (isArrayOfMessages(data)) {
          setMessages((prev) => {
            if (!prev?.[data.channelId]) {
              return { ...prev, [data.channelId]: data.messages };
            } else {
              const newMessages = [
                ...(prev[data.channelId] || []),
                ...data.messages,
              ];
              newMessages.sort((a, b) => {
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                );
              });
              return { ...prev, [data.channelId]: newMessages };
            }
          });
          return;
        }
        if (isObjectAMessage(data)) {
          setMessages((prev) => {
            if (!prev?.[data.channelId]) {
              return { ...prev, [data.channelId]: [data] };
            } else {
              return {
                ...prev,
                [data.channelId]: [...(prev[data.channelId] || []), data],
              };
            }
          });
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

// should be object with channelId and messages
const isArrayOfMessages = (data: any): data is MessagesForChannel => {
  return !!data?.channelId && !!data?.messages;
};

const isObjectAMessage = (data: any): data is Message => {
  return data.id && data.content && (!data.type || data.type === "message");
};
