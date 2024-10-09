"use client";

import React from "react";
import { useRoom } from "./_room-context";

export const RoomTitle = () => {
  const { selectedRoom } = useRoom();

  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold">{selectedRoom?.name}</h2>
    </div>
  );
};
