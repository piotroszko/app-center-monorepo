/* eslint-disable no-unused-vars */
import { has } from "lodash";
import { IInputChannel } from "./channel";
import { InputUser } from "./user";

export const IsInviteMessage = (
  input: any,
): input is BaseInputInviteMessage => {
  return typeof input?.type === "string" && has(input, "invites");
};

export enum InviteMessageType {
  GET = "get",
  NEW = "new",
  DELETED = "deleted",
  ACCEPTED = "accepted",
}

export interface BaseInputInviteMessage {
  type: InviteMessageType;
  invites: InputInvite[];
}

export interface InputInvite {
  id: string;
  channel: IInputChannel;
  user: InputUser;
  data?: string;
}
