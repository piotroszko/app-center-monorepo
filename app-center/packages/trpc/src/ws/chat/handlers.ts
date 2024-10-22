import { IInputChannel } from "./input/channel";
import {
  PropsChannelRecieve,
  PropsInviteRecieve,
  PropsMessageRecieve,
} from "./input/input";
import { Dispatch } from "react";
import { InputMessage } from "./input/message";
import { InputInvite } from "./input/invite";

export const getChannelHandlers = (
  setChannels: Dispatch<React.SetStateAction<IInputChannel[]>>,
  setPublicChannels: Dispatch<React.SetStateAction<IInputChannel[]>>,
): PropsChannelRecieve => ({
  onChannelGet: (data) => {
    setChannels(data.channels);
  },
  onChannelDelete: (data) => {
    setChannels((prev) =>
      prev.filter((channel) => data.channels.some((c) => c.id !== channel.id)),
    );
  },
  onChannelEdit: (data) => {
    setChannels((prev) =>
      prev.map(
        (channel) => data.channels.find((c) => c.id === channel.id) || channel,
      ),
    );
  },
  onChannelGetPublic: (data) => {
    setPublicChannels(data.channels);
  },
  onChannelJoin: (data) => {
    setChannels((prev) => {
      const newChannels = [...prev, ...data.channels];
      return newChannels;
    });
    setPublicChannels((prev) =>
      prev.filter((channel) => data.channels.some((c) => c.id !== channel.id)),
    );
  },
  onChannelLeave: (data) => {
    setChannels((prev) =>
      prev.filter((channel) => data.channels.some((c) => c.id !== channel.id)),
    );
  },
  onChannelNew: (data) => {
    setChannels((prev) => [...prev, ...data.channels]);
  },
});

export const getMessagesHandlers = (
  setMessages: Dispatch<React.SetStateAction<Record<string, InputMessage[]>>>,
): PropsMessageRecieve => ({
  onMessageDelete: (data) => {
    setMessages((prev) => {
      const oldMessages = prev[data.channelId] || [];
      return {
        ...prev,
        [data.channelId]: oldMessages.filter((message) =>
          data?.messages?.some((m) => m.id !== message.id),
        ),
      };
    });
  },
  onMessageEdit: (data) => {
    setMessages((prev) => {
      const oldMessages = prev[data.channelId] || [];
      return {
        ...prev,
        [data.channelId]: oldMessages.map(
          (message) =>
            data.messages.find((m) => m.id === message.id) || message,
        ),
      };
    });
  },
  onMessageGet: (data) => {
    setMessages((prev) => {
      const oldMessages = prev[data.channelId] || [];
      return {
        ...prev,
        [data.channelId]: [...oldMessages, ...data.messages].sort(
          (a, b) => a.id - b.id,
        ),
      };
    });
  },
  onMessageNew: (data) => {
    setMessages((prev) => {
      const oldMessages = prev[data.channelId] || [];
      return {
        ...prev,
        [data.channelId]: [...oldMessages, ...data.messages].sort(
          (a, b) => a.id - b.id,
        ),
      };
    });
  },
});

export const getInviteHandlers = (
  setInvites: Dispatch<React.SetStateAction<InputInvite[]>>,
): PropsInviteRecieve => ({
  onAcceptInvite: (data) => {
    setInvites((prev) =>
      prev.filter((invite) => data?.invites?.some((i) => i.id !== invite.id)),
    );
  },
  onInviteDelete: (data) => {
    setInvites((prev) =>
      prev.filter((invite) => data?.invites?.some((i) => i.id !== invite.id)),
    );
  },
  onInviteGet: (data) => {
    setInvites(data.invites);
  },
  onInviteNew: (data) => {
    setInvites((prev) => [...prev, ...data.invites]);
  },
});
