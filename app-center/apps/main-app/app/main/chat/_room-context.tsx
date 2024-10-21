"use client";

import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
  avatar: string;
  type: "private" | "group" | "public";
  users: User[];
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

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
  rooms: Room[];
}
export const RoomContext = createContext<IRoomContext>({
  rooms: [],
});

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
