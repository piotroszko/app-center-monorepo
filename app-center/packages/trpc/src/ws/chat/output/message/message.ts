import { IOutputMessage } from "../types";

export class OutputMessage {
  public static getNewMessages(
    ws: WebSocket,
    { channelId }: GetNewMessagesProps,
  ) {
    const message: IOutputMessage = {
      type: "getMessage",
      getMessage: { type: "newest", amount: 10, channelId },
    };
    ws?.send(JSON.stringify(message));
  }
  public static getOldMessages(
    ws: WebSocket,
    { channelId, messageId }: GetOldMessagesProps,
  ) {
    const message: IOutputMessage = {
      type: "getMessage",
      getMessage: { type: "history", amount: 10, channelId, messageId },
    };
    ws?.send(JSON.stringify(message));
  }
  //////////////////////////
  public static newMessage(
    ws: WebSocket,
    { channelId, text }: NewMessageProps,
  ) {
    const message: IOutputMessage = {
      type: "newMessage",
      newMessage: {
        type: "new",
        channelId,
        data: text,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static answerMessage(
    ws: WebSocket,
    { channelId, messageId, text }: AnswerMessageProps,
  ) {
    const message: IOutputMessage = {
      type: "newMessage",
      newMessage: {
        type: "answer",
        channelId,
        messageId,
        data: text,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  //////////////////////////
  public static editMessage(
    ws: WebSocket,
    { messageId, text }: EditMessageProps,
  ) {
    const message: IOutputMessage = {
      type: "actionMessage",
      actionMessage: {
        type: "edit",
        messageId,
        text,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static deleteMessage(
    ws: WebSocket,
    { messageId, channelId }: DeleteMessageProps,
  ) {
    const message: IOutputMessage = {
      type: "actionMessage",
      actionMessage: {
        type: "delete",
        messageId,
        channelId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static deleteMessages(
    ws: WebSocket,
    { messageIds, channelId }: DeleteMessagesProps,
  ) {
    const message: IOutputMessage = {
      type: "actionMessage",
      actionMessage: {
        type: "delete",
        messageIds,
        channelId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
}

export interface GetNewMessagesProps {
  channelId: string;
}

export interface GetOldMessagesProps {
  channelId: string;
  messageId: number;
}

export interface NewMessageProps {
  channelId: string;
  text: string;
}

export interface AnswerMessageProps {
  channelId: string;
  messageId: number;
  text: string;
}

export interface EditMessageProps {
  messageId: number;
  text: string;
}

export interface DeleteMessageProps {
  messageId: number;
  channelId: string;
}

export interface DeleteMessagesProps {
  messageIds: number[];
  channelId: string;
}
