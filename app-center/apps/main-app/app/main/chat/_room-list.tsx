"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { MessageCircle, Users, Globe } from "lucide-react";
import { Room, useRoom } from "./_room-context";
import { useChat } from "@repo/trpc/ws";
import { useMemo } from "react";

export function RoomTabs() {
  const { rooms, setSelectedRoom } = useRoom();

  const privateRooms = rooms?.filter((room) => room.type === "private") || [];
  const groupRooms = rooms?.filter((room) => room.type === "group") || [];
  const publicRooms = rooms?.filter((room) => room.type === "public") || [];

  const defaultTab = useMemo(() => {
    if (privateRooms.length > 0) return "private";
    if (groupRooms.length > 0) return "groups";
    return "public";
  }, [rooms]);
  return (
    <div className="w-64 border-r">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-none">
          <TabsTrigger value="private">
            <MessageCircle className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="public">
            <Globe className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="private">
          <RoomList rooms={privateRooms} onSelectRoom={setSelectedRoom} />
        </TabsContent>
        <TabsContent value="groups">
          <RoomList rooms={groupRooms} onSelectRoom={setSelectedRoom} />
        </TabsContent>
        <TabsContent value="public">
          <RoomList rooms={publicRooms} onSelectRoom={setSelectedRoom} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

function RoomList({ rooms, onSelectRoom }: RoomListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-40px)]">
      {rooms.map((room) => (
        <Button
          key={room.id}
          variant="ghost"
          className="w-full justify-start mb-1 ml-1"
          onClick={() => onSelectRoom(room)}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={room.avatar} alt={room.name} />
            <AvatarFallback>{room.name[0]}</AvatarFallback>
          </Avatar>
          {room.name}
        </Button>
      ))}
    </ScrollArea>
  );
}
