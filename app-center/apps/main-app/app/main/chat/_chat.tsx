"use client";
import { useState } from "react";
import { RoomTabs } from "./_room-list";
import { MessagesList } from "./_messages_list";
import { RoomTitle } from "./_title";
import { Message, mockMessages, Room, RoomContext } from "./_room-context";
import { ChatInputBox } from "./_input";
import { ChatContextProvider, useChat } from "@repo/trpc/ws";

export default function Chat() {
  return (
    <ChatContextProvider address="127.0.0.1:4000">
      <ChatUI />
    </ChatContextProvider>
  );
}

function ChatUI() {
  const { channels, setCurrentChannel } = useChat();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setInputMessage("");
    }
  };

  return (
    <RoomContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom: (room) => {
          const channel = channels?.find((channel) => channel.id === room.id);
          if (!channel) return;
          setSelectedRoom(room);
          setCurrentChannel(channel);
        },
        messages,
        rooms: channels?.map?.((channel) => ({
          id: channel.id,
          name: channel.name,
          avatar: "",
          type:
            channel?.type === "room"
              ? "public"
              : (channel?.type as Room["type"]),
        })),
      }}
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
