"use client";
import { useState } from "react";
import { RoomList } from "./_room-list";
import { MessagesList } from "./_messages_list";
import { RoomTitle } from "./_title";
import { Room, RoomContext } from "./_room-context";
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
  const { channels, currentChannel } = useChat();

  return (
    <RoomContext.Provider
      value={{
        rooms: channels?.map?.((channel) => ({
          id: channel.id,
          name: channel.name,
          avatar: "",
          type:
            channel?.channelType === "public"
              ? "public"
              : (channel?.channelType as Room["type"]),
          users: channel.users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          })),
        })),
      }}
    >
      <div className="flex h-full w-full bg-background">
        {/* Left sidebar */}
        <RoomList />

        <div className="flex flex-col flex-1">
          {currentChannel ? (
            <>
              <RoomTitle />
              <MessagesList />
              <ChatInputBox />
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
