"use client";

import { createContext, useContext } from "react";

export interface Room {
  id: number;
  name: string;
  avatar: string;
  type: "private" | "group" | "public";
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export const mockRooms: Room[] = [
  {
    id: 1,
    name: "Alice",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "private",
  },
  {
    id: 2,
    name: "Bob",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "private",
  },
  {
    id: 3,
    name: "Project A",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "group",
  },
  {
    id: 4,
    name: "Team B",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "group",
  },
  {
    id: 5,
    name: "General",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "public",
  },
  {
    id: 6,
    name: "Random",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "public",
  },
];

export const mockMessages: Message[] = [
  { id: 1, sender: "Alice", content: "Hey there!", timestamp: "10:00 AM" },
  {
    id: 2,
    sender: "You",
    content: "Hi Alice! How are you?",
    timestamp: "10:02 AM",
  },
  {
    id: 3,
    sender: "Alice",
    content: "I'm doing great, thanks for asking!",
    timestamp: "10:05 AM",
  },
];

interface IRoomContext {
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room) => void;
  rooms: Room[];
  messages: Message[];
}
export const RoomContext = createContext<IRoomContext>({
  selectedRoom: null,
  setSelectedRoom: () => {},
  rooms: mockRooms,
  messages: mockMessages,
});

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
