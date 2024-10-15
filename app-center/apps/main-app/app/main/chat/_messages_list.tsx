"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { useChat } from "@repo/trpc/ws";
import { useGetUser } from "../../auth/login/_form";
import TimeAgoLabel from "@repo/ui/components/ui/time-ago-label";
import { cn } from "@repo/ui/lib/utils";

export const MessagesList = () => {
  const lastRef = useRef<HTMLDivElement>(null);
  const { id, name } = useGetUser();
  const { messages } = useChat();
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
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((message, index) => {
        const date = new Date(message.createdAt);
        const isLastHour = isMessageLastHour(date);
        return (
          <div
            key={message.id}
            className={`flex mb-4 ${message?.userId === id ? "justify-end" : ""}`}
          >
            {index === messages.length - 1 && <div ref={lastRef}></div>}
            <div
              className={`min-w-52 max-w-[70%] ${message.userId === id ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
            >
              <p className="font-semibold flex flex-row gap-4">
                {message.userId === id ? name : message.user}
                <p
                  className={cn(
                    "text-xs flex-1 text-right mt-1",
                    isLastHour
                      ? "text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <TimeAgoLabel date={date} />
                </p>
              </p>
              <p className="my-2">{message.content}</p>
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};
