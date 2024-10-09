"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import React from "react";
import { useRoom } from "./_room-context";

export const MessagesList = () => {
  const { messages } = useRoom();
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex mb-4 ${message.sender === "You" ? "justify-end" : ""}`}
        >
          <div
            className={`max-w-[70%] ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
          >
            <p className="font-semibold">{message.sender}</p>
            <p>{message.content}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {message.timestamp}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
