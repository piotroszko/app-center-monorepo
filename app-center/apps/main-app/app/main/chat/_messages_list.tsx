"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { useChat } from "@repo/trpc/ws";
import { useGetUser } from "../../auth/login/_form";
import TimeAgoLabel from "@repo/ui/components/ui/time-ago-label";
import { cn } from "@repo/ui/lib/utils";
import { UserPopover } from "@repo/ui/custom";

export const MessagesList = () => {
  const lastRef = useRef<HTMLDivElement>(null);
  const { id, name } = useGetUser();
  const { messages, currentChannel } = useChat();
  useEffect(() => {
    if (lastRef.current) {
      lastRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isMessageLastHour = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff < 3600000;
  };
  const messagesCurrentChannel = messages?.[currentChannel?.id || ""] || [];
  return (
    <ScrollArea className="flex-1 p-0.5 pr-3">
      {messagesCurrentChannel.map((message, index) => {
        const date = new Date(message.createdAt);
        const isLastHour = isMessageLastHour(date);
        const isCurrentUser = message?.user.id === id;
        return (
          <div className="mb-5">
            <div className="w-full flex flex-row justify-end mb-0.5 pr-0.5">
              {isCurrentUser ? (
                <UserPopover userId={message?.user?.id}>
                  <p className="font-semibold text-sm">{name}</p>
                </UserPopover>
              ) : (
                <p className="font-semibold text-sm">{message.user.name}</p>
              )}
            </div>
            <div
              key={message.id}
              className={`flex ${message?.user.id === id ? "justify-end" : ""}`}
            >
              {index === messagesCurrentChannel.length - 1 && (
                <div ref={lastRef}></div>
              )}
              <div
                className={`min-w-14 max-w-3xl ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-2`}
              >
                <p className="my-1 text-pretty break-words text-center">
                  {message.text}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-row justify-end pr-0.5 mt-0.5">
              <TimeAgoLabel
                date={date}
                className={cn(
                  "text-xs flex-1 text-right",
                  isLastHour ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};
