import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export class Chat {
  private websocket: WebSocket;
  private token: string;
  private setMessages: Dispatch<SetStateAction<Message[]>>;
  private addMessage: (message: Message) => void;
  private setIsTyping: (isTyping: boolean, user: string) => void;

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
    setMessages: Dispatch<SetStateAction<Message[]>>;
    addMessage: (message: Message) => void;
    setIsTyping: (isTyping: boolean, user: string) => void;
  }) {
    this.websocket = new WebSocket(
      "ws://" + address + "/connect?channel=" + channel,
    );

    this.setMessages = setMessages;
    this.addMessage = addMessage || (() => {});
    this.setIsTyping = setIsTyping || (() => {});
    this.token = token;
    this.websocket.onopen = () => this.onOpen();
    this.websocket.onmessage = (event) => this.onMessage(event);
    this.websocket.onclose = () => this.onClose();
  }
  private onOpen() {
    this.sendGet();
  }

  private onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const type = data?.type;
    switch (type) {
      case "message":
        this.addMessage(data);
        break;
      case "messages":
        this.setMessages((msg) => {
          let tmpMsg = [...data.messages, ...msg];
          tmpMsg.sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          });
          return tmpMsg;
        });
        break;
      case "typing":
        this.setIsTyping(true, data.user);
        break;
      case "stop_typing":
        this.setIsTyping(false, data.user);
        break;
      default:
        console.log("Unknown message type", type);
    }
  }

  private onClose() {
    console.log("disconnected");
  }

  close() {
    this.websocket.close();
  }

  sendGet(amount: number = 20, lastMessageId?: string) {
    this.websocket.send(
      JSON.stringify({
        type: "get",
        token: this.token,
        last_message_id: lastMessageId,
        amount,
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

export const useChat = (
  address: string = "localhost:4000",
  channel: string = "1",
  token: string = "test",
) => {};
