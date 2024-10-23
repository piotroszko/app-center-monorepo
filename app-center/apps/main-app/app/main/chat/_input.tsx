"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

import React, { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "@repo/trpc/ws";

export const ChatInputBox = () => {
  const {
    messagesFunctions: { sendNewMessage: sendMessage },
    currentChannel,
  } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        sendMessage?.(inputMessage, currentChannel?.id || "");
        setInputMessage("");
      }}
      className="p-4 border-t flex w-full gap-4"
    >
      <div className="w-full">
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" className="h-full">
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
};
