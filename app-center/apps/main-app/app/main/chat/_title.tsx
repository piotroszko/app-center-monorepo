"use client";

import React, { PropsWithChildren } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { useChat } from "@repo/trpc/ws";
import { ChannelUsers } from "./_channel_users";
import { Separator } from "@repo/ui/components/ui/separator";

export const ChannelTitle = () => {
  const { currentChannel } = useChat();

  return (
    <div className="p-4 border-b flex flex-row items-center justify-between">
      <h2 className="text-xl font-semibold">{currentChannel?.name}</h2>

      <div className="flex flex-row gap-4 justify-center items-center ml-4">
        <ChannelUsers />
        <Separator orientation="vertical" className="mx-5" />

        <InviteDialog>
          <Button>Invite</Button>
        </InviteDialog>

        <LeaveDialog>
          <Button variant={"secondary"}>Leave channel</Button>
        </LeaveDialog>
      </div>
    </div>
  );
};

const InviteDialog = ({ children }: PropsWithChildren) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Invite user to channel</DialogTitle>
          <DialogDescription>
            Enter the email or login of the user you want to invite to this
            channel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="file">User login or email</Label>
          <Input id="login" type="text" className="w-full" />
        </div>
        <Button type="submit">Invite</Button>
      </DialogContent>
    </Dialog>
  );
};

const LeaveDialog = ({ children }: PropsWithChildren) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Leave channel</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this channel?
          </DialogDescription>
        </DialogHeader>
        <Button type="submit" variant={"destructive"}>
          Leave
        </Button>
      </DialogContent>
    </Dialog>
  );
};
