"use client";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import React, { FormEvent, useState } from "react";
import { Send } from "lucide-react";

interface ChatInputBoxProps {
  handleSendMessage: (e: FormEvent<HTMLFormElement>) => void;
}

export const ChatInputBox = ({ handleSendMessage }: ChatInputBoxProps) => {
  const [inputMessage, setInputMessage] = useState("");
  return (
    <form
      onSubmit={handleSendMessage}
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
