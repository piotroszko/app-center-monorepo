import { has } from "lodash";
import { InputUser } from "./user";

export const IsAnyOfMessageTypes = (input: any): input is BaseInputMessages => {
  return has(input, "channelId") && has(input, "messages");
};

export enum MessageType {
  NEW = "new",
  EDIT = "edit",
  DELETE = "delete",
  GET = "get",
}

export interface BaseInputMessages {
  type: MessageType;
  channelId: string;
  messages: InputMessage[];
}

export interface InputAnswerParent {
  id: number;
  text: string;
  user: InputUser;
}

export interface InputMessage {
  id: number;
  channelId: string;
  text: string;
  user: InputUser;
  createdAt: string;
  updateAt: string;
  ansewerTo: string;

  // TODO: Not implemented yet
  imagesUrls: string[];
  videosUrls: string[];
  filesUrls: string[];
}
