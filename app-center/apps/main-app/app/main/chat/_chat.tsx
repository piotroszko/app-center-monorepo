"use client";

import { MessagesList } from "./_messages_list";
import { ChannelTitle } from "./_title";
import { ChatInputBox } from "./_input";
import { ChatContextProvider, useChat } from "@repo/trpc/ws";
import { ChannelList } from "./_channel-list";

export default function Chat() {
  return (
    <ChatContextProvider address="127.0.0.1:4000">
      <ChatUI />
    </ChatContextProvider>
  );
}

function ChatUI() {
  const { currentChannel } = useChat();

  return (
    <div className="flex h-full w-full bg-background">
      {/* Left sidebar */}
      <ChannelList />

      <div className="flex flex-col flex-1">
        {currentChannel ? (
          <>
            <ChannelTitle />
            <MessagesList />
            <ChatInputBox />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
