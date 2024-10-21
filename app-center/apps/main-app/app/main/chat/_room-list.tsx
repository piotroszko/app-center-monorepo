"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Room, useRoom } from "./_room-context";
import { useRef } from "react";
import { AlertCircle } from "lucide-react";
import { useChat } from "@repo/trpc/ws";

export function RoomList() {
  const { rooms } = useRoom();

  return (
    <div className="w-64 border-r">
      <div className="p-1.5 border-b flex flex-row items-center justify-between">
        <Button onClick={() => null} variant={"secondary"}>
          Create channel
        </Button>
        <Button onClick={() => null} variant={"ghost"} className="relative">
          {/* blinking icon 1sec */}
          <AlertCircle className="w-4 h-4 absolute top-0 right-0 text-destructive/90 animate-pulse duration-1000" />
          Invites
        </Button>
      </div>
      <ScrollArea className="h-max py-1">
        {rooms.map((room) => (
          <RoomItem key={room.id} room={room} />
        ))}
      </ScrollArea>
    </div>
  );
}

interface RoomProps {
  room: Room;
}

const RoomItem = ({ room }: RoomProps) => {
  const { setCurrentChannel, channels } = useChat();
  const userId = useRef(localStorage.getItem("userId") || "");
  const isPrivate = room.type === "private" && room.users?.length === 2;
  const isPublic = room.type === "public";
  const isGroup = room.type === "group";

  const currentUser = isPrivate
    ? room.users?.find((user) => user.id === userId.current)
    : null;
  const otherUser = isPrivate
    ? room.users?.find((user) => user.id !== userId.current)
    : null;

  return (
    <Button
      key={room.id}
      variant="ghost"
      className="w-full justify-start mb-1 ml-1 gap-2"
      onClick={() => {
        const foundChannel = channels.find((channel) => channel.id === room.id);
        if (foundChannel) {
          setCurrentChannel?.(foundChannel);
        } else {
          console.error("Channel not found", room.id);
        }
      }}
    >
      {isPrivate && (
        <div className="flex flex-row mr-1 items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.id} alt={currentUser?.name} />
            <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
          </Avatar>
          {"-"}
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherUser?.id} alt={otherUser?.name} />
            <AvatarFallback>{otherUser?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      )}
      {isGroup && (
        <div className="grid grid-grid-flow-col grid-cols-3 border border-secondary p-1 rounded-lg">
          {room.users?.slice(0, 6).map((user) => (
            <Avatar key={user.id} className="h-4 w-4 text-[8px]">
              <AvatarImage src={user.id} alt={user.name} />
              <AvatarFallback>
                {(user?.name?.[0] || "") + (user?.name?.[1] || "")}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
      {isPublic && (
        <Avatar className="h-8 w-8 mr-1">
          <AvatarImage src={room.avatar} alt={room.name} />
          <AvatarFallback>{room?.name[0] || ""}</AvatarFallback>
        </Avatar>
      )}
      {isPrivate ? otherUser?.name : room.name}
    </Button>
  );
};
