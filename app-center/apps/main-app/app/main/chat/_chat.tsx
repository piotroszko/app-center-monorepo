"use client";
import { useState } from "react";
import { MessageCircle, Users, Globe, Send } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

// Mock data for demonstration
const mockRooms = {
  private: [
    { id: 1, name: "Alice", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
  ],
  groups: [
    { id: 3, name: "Project A", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "Team B", avatar: "/placeholder.svg?height=32&width=32" },
  ],
  public: [
    { id: 5, name: "General", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 6, name: "Random", avatar: "/placeholder.svg?height=32&width=32" },
  ],
};

const mockMessages = [
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

export default function ChatUI() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      {/* Left sidebar */}
      <div className="w-64 border-r">
        <Tabs defaultValue="private" className="w-full">
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
            <RoomList
              rooms={mockRooms.private}
              onSelectRoom={setSelectedRoom}
            />
          </TabsContent>
          <TabsContent value="groups">
            <RoomList rooms={mockRooms.groups} onSelectRoom={setSelectedRoom} />
          </TabsContent>
          <TabsContent value="public">
            <RoomList rooms={mockRooms.public} onSelectRoom={setSelectedRoom} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col flex-1">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedRoom?.name}</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.sender === "You" ? "justify-end" : ""}`}
                >
                  <div
                    className={`max-w-[70%] ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
                  >
                    <p className="font-semibold">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a room to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

function RoomList({ rooms, onSelectRoom }) {
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
