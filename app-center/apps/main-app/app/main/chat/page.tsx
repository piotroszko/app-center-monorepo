import React from "react";
import Chat from "./_chat";
import { ClientPageTransition } from "@repo/ui/components/ui/client-page-transition";

const ChatPage = () => {
  return (
    <ClientPageTransition>
      <Chat />
    </ClientPageTransition>
  );
};

export default ChatPage;
