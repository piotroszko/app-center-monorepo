import { IOutputMessage } from "../types";

export class OutputChannel {
  public static getChannels(ws: WebSocket) {
    const message: IOutputMessage = {
      type: "getChannel",
      getChannel: { type: "get-for-me" },
    };
    ws?.send(JSON.stringify(message));
  }
  public static getPublicChannels(ws: WebSocket) {
    const message: IOutputMessage = {
      type: "getChannel",
      getChannel: { type: "get-public" },
    };
    ws?.send(JSON.stringify(message));
  }

  ////////////////////////

  public static joinChannel(ws: WebSocket, { channelId }: JoinChannelProps) {
    const message: IOutputMessage = {
      type: "actionChannel",
      actionChannel: {
        type: "join-public",
        channelId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static deleteChannel(
    ws: WebSocket,
    { channelId }: DeleteChannelProps,
  ) {
    const message: IOutputMessage = {
      type: "actionChannel",
      actionChannel: {
        type: "delete",
        channelId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static leaveChannel(ws: WebSocket, { channelId }: LeaveChannelProps) {
    const message: IOutputMessage = {
      type: "actionChannel",
      actionChannel: {
        type: "leave",
        channelId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static editChannel(
    ws: WebSocket,
    { channelId, name, description }: EditChannelProps,
  ) {
    const message: IOutputMessage = {
      type: "actionChannel",
      actionChannel: {
        type: "edit",
        channelId,
        name,
        description,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static createChannel(
    ws: WebSocket,
    { channelType, name, description, usersIds }: CreateChannelProps,
  ) {
    const message: IOutputMessage = {
      type: "actionChannel",
      actionChannel: {
        type: "create",
        name,
        channelType,
        usersIds,
        description,
      },
    };
    ws?.send(JSON.stringify(message));
  }
}

export interface CreateChannelProps {
  name: string;
  channelType: "public" | "private" | "group";
  usersIds?: string[];
  description?: string;
}

export interface EditChannelProps {
  channelId: string;
  name: string;
  description?: string;
}

export interface LeaveChannelProps {
  channelId: string;
}

export interface DeleteChannelProps {
  channelId: string;
}

export interface JoinChannelProps {
  channelId: string;
}
