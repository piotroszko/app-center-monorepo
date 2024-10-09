"use client";
import { useState } from "react";
import { RoomTabs } from "./_room-list";
import { MessagesList } from "./_messages_list";
import { RoomTitle } from "./_title";
import {
  Message,
  mockMessages,
  mockRooms,
  Room,
  RoomContext,
} from "./_room-context";
import { ChatInputBox } from "./_input";

export default function ChatUI() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setInputMessage("");
    }
  };

  return (
    <RoomContext.Provider
      value={{ selectedRoom, setSelectedRoom, messages, rooms }}
    >
      <div className="flex h-full w-full bg-background">
        {/* Left sidebar */}
        <RoomTabs />

        <div className="flex flex-col flex-1">
          {selectedRoom ? (
            <>
              <RoomTitle />
              <MessagesList />
              <ChatInputBox handleSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a room to start chatting
            </div>
          )}
        </div>
      </div>
    </RoomContext.Provider>
  );
}
