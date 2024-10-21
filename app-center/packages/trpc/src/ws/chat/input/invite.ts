/* eslint-disable no-unused-vars */
import { IChannelMessage } from "./channel";
import { InputUser } from "./user";

export const IsInviteMessage = (
  input: any,
): input is BaseInputInviteMessage => {
  return typeof input.type === "string" && input.channels;
};

export enum InviteMessageType {
  GET = "get",
  NEW = "new",
  DELETED = "deleted",
  ACCEPTED = "accepted",
}

export interface BaseInputInviteMessage {
  type: InviteMessageType;
  invites: OutputInvite[];
}

export interface OutputInvite {
  id: string;
  channel: IChannelMessage;
  user: InputUser;
  data?: string;
}
