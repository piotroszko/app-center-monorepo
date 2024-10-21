import { IOutputMessage } from "../types";

export class OutputInvite {
  public static inviteUser(
    ws: WebSocket,
    { channelId, userId }: InviteSendProps,
  ) {
    const message: IOutputMessage = {
      type: "inviteMessage",
      inviteMessage: {
        type: "send",
        channelId,
        userId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static acceptInvite(ws: WebSocket, { inviteId }: InviteAcceptProps) {
    const message: IOutputMessage = {
      type: "inviteMessage",
      inviteMessage: {
        type: "accept",
        inviteId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
  public static declineInvite(ws: WebSocket, { inviteId }: InviteDeclineProps) {
    const message: IOutputMessage = {
      type: "inviteMessage",
      inviteMessage: {
        type: "decline",
        inviteId,
      },
    };
    ws?.send(JSON.stringify(message));
  }
}

export interface InviteSendProps {
  channelId: string;
  userId: string;
}
export interface InviteAcceptProps {
  inviteId: string;
}
export interface InviteDeclineProps {
  inviteId: string;
}
