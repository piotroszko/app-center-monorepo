"use client";

import React from "react";
import { useRoom } from "./_room-context";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";

export const RoomTitle = () => {
  const { selectedRoom } = useRoom();

  return (
    <div className="p-4 border-b flex flex-row items-center justify-between">
      <h2 className="text-xl font-semibold">{selectedRoom?.name}</h2>
      <div className="flex flex-row gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-2 bg-primary text-primary-foreground">
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-6">
            <DialogHeader>
              <DialogTitle>Invite user to room</DialogTitle>
              <DialogDescription>
                Enter the email or login of the user you want to invite to this
                room.
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file">User login or email</Label>
              <Input id="login" type="text" className="w-full" />
            </div>
            <Button type="submit">Invite</Button>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-2 bg-secondary text-secondary-foreground">
              Leave Room
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-6">
            <DialogHeader>
              <DialogTitle>Leave room</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this room?
              </DialogDescription>
            </DialogHeader>
            <Button type="submit" variant={"destructive"}>
              Leave
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
