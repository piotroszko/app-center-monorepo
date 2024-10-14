"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { useChat } from "@repo/trpc/ws";
import { useGetUser } from "../../auth/login/_form";

export const MessagesList = () => {
  const lastRef = useRef<HTMLDivElement>(null);
  const { id, name } = useGetUser();
  const { messages } = useChat();
  useEffect(() => {
    if (lastRef.current) {
      lastRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex mb-4 ${message?.userId === id ? "justify-end" : ""}`}
        >
          {index === messages.length - 1 && <div ref={lastRef}></div>}
          <div
            className={`max-w-[70%] ${message.userId === id ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
          >
            <p className="font-semibold">
              {message.userId === id ? name : message.user}
            </p>
            <p>{message.content}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
