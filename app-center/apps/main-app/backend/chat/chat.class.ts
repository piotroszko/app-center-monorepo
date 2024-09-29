import { useEffect, useRef, useState } from "react";

export class Chat {
  websocket: WebSocket;
  token: string;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean, user: string) => void;

  constructor({
    address = "localhost:4000",
    channel = "1",
    token = "test",
    setMessages,
    addMessage,
    setIsTyping,
  }: {
    address?: string;
    channel?: string;
    token?: string;
    setMessages?: (messages: Message[]) => void;
    addMessage?: (message: Message) => void;
    setIsTyping?: (isTyping: boolean, user: string) => void;
  }) {
    this.websocket = new WebSocket(
      "ws://" + address + "/connect?channel=" + channel,
    );

    this.setMessages = setMessages || (() => {});
    this.addMessage = addMessage || (() => {});
    this.setIsTyping = setIsTyping || (() => {});
    this.token = token;
    this.websocket.onopen = () => this.onOpen();
    this.websocket.onmessage = (event) => this.onMessage(event);
    this.websocket.onclose = () => this.onClose();
  }
  private onOpen() {
    this.sendInit("0");
  }

  private onMessage(event: MessageEvent) {
    console.log(event.data);
  }

  private onClose() {
    console.log("disconnected");
  }

  close() {
    this.websocket.close();
  }

  sendInit(lastMessageId: string) {
    this.websocket.send(
      JSON.stringify({
        type: "init",
        token: this.token,
        last_message_id: lastMessageId,
      }),
    );
  }
  sendMessage(content: string) {
    this.websocket.send(
      JSON.stringify({
        type: "message",
        token: this.token,
        content: content,
      }),
    );
  }
  sendTyping() {
    this.websocket.send(
      JSON.stringify({
        type: "typing",
        token: this.token,
      }),
    );
  }
}

interface Message {
  id: string;
  content: string;
  user: string;
  created_at: string;
}
interface Typing {
  user: string;
}

export const useChat = (address: string, channel: string, token: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<Typing | null>(null);

  const websocketRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    websocketRef.current = new Chat({
      address: "localhost:4000",
      channel: "1",
      token: "test",
    });

    return () => {
      websocketRef.current?.close();
    };
  }, []);

  return { messages, sendMessage: websocketRef.current?.sendMessage };
};
