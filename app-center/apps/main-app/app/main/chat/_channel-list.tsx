"use client";

import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useChat } from "@repo/trpc/ws";
import { CreateChannelButton } from "./_create-channel";
import { ChannelItem } from "./_channel_item";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

export function ChannelList() {
  const {
    channels,
    state: { isConnecting },
  } = useChat();

  return (
    <div className="w-64 border-r">
      <div className="p-1.5 border-b flex flex-row items-center justify-between">
        <CreateChannelButton />

        <Button onClick={() => null} variant={"ghost"} className="relative">
          {/* blinking icon 1sec */}
          <AlertCircle className="w-4 h-4 absolute top-0 right-0 text-destructive/90 animate-pulse duration-1000" />
          Invites
        </Button>
      </div>
      <ScrollArea className="h-max py-1">
        {isConnecting ? (
          <ChannelListSkeleton />
        ) : (
          channels.map((channel) => (
            <ChannelItem key={channel.id} channel={channel} />
          ))
        )}
      </ScrollArea>
    </div>
  );
}

const ChannelListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 my-2">
      <div className="flex flex-row">
        <Skeleton className="h-8 w-1/6 mx-auto rounded-full" />
        <Skeleton className="h-8 w-4/6 mx-auto" />
      </div>
      <div className="flex flex-row">
        <Skeleton className="h-8 w-1/6 mx-auto rounded-full" />
        <Skeleton className="h-8 w-4/6 mx-auto" />
      </div>
    </div>
  );
};
