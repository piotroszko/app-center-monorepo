/* eslint-disable no-unused-vars */
import { has } from "lodash";
import { InputUser } from "./user";

export const IsChannelMessage = (
  input: any,
): input is BaseInputChannelMessage => {
  return typeof input?.type === "string" && has(input, "channels");
};

export enum ChannelMessageType {
  EDIT = "edit-channel",
  GET = "get-channels",
  NEW = "new-channel",
  DELETE = "delete-channel",
  LEAVE = "leave-channel",
  JOIN = "join-channel",
  GET_PUBLIC = "publics-channel",
}

export interface IInputChannel {
  id: string;
  name: string;
  description: string;
  channelType: "public" | "private" | "group";
  users: InputUser[];
  owners: InputUser[];
  createdAt: string;
  updateAt: string;
}

export interface BaseInputChannelMessage {
  type: ChannelMessageType;
  channels: IInputChannel[];
}
