"use client";

import { IInputChannel, useChat } from "@repo/trpc/ws";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { useRef } from "react";

interface channelProps {
  channel: IInputChannel;
}

export const ChannelItem = ({ channel }: channelProps) => {
  const { setCurrentChannel, channels } = useChat();
  const userId = useRef(localStorage.getItem("userId") || "");
  const isPrivate =
    channel.channelType === "private" && channel.users?.length === 2;
  const isPublic = channel.channelType === "public";
  const isGroup = channel.channelType === "group";

  const currentUser = isPrivate
    ? channel.users?.find((user) => user.id === userId.current)
    : null;
  const otherUser = isPrivate
    ? channel.users?.find((user) => user.id !== userId.current)
    : null;

  return (
    <Button
      key={channel.id}
      variant="ghost"
      className="w-full justify-start mb-1 ml-1 gap-2"
      onClick={() => {
        const foundChannel = channels.find(
          (channel) => channel.id === channel.id,
        );
        if (foundChannel) {
          setCurrentChannel?.(foundChannel);
        } else {
          console.error("Channel not found", channel.id);
        }
      }}
    >
      {isPrivate && (
        <div className="flex flex-row mr-1 items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.id} alt={currentUser?.name} />
            <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
          </Avatar>
          {"-"}
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherUser?.id} alt={otherUser?.name} />
            <AvatarFallback>{otherUser?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      )}
      {isGroup && (
        <div className="grid grid-grid-flow-col grid-cols-3 border border-secondary p-1 rounded-lg">
          {channel.users?.slice(0, 6).map((user) => (
            <Avatar key={user.id} className="h-4 w-4 text-[8px]">
              <AvatarImage src={user.id} alt={user.name} />
              <AvatarFallback>
                {(user?.name?.[0] || "") + (user?.name?.[1] || "")}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
      {isPublic && (
        <Avatar className="h-8 w-8 mr-1">
          <AvatarImage src={channel.id} alt={channel.name} />
          <AvatarFallback>{channel?.name[0] || ""}</AvatarFallback>
        </Avatar>
      )}
      {isPrivate ? otherUser?.name : channel.name}
    </Button>
  );
};
