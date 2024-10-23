import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import React from "react";
import { Users } from "lucide-react";
import { useChat } from "@repo/trpc/ws";
import { AvatarComponent, UserPopover } from "@repo/ui/custom";

export const ChannelUsers = () => {
  const { currentChannel } = useChat();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Users />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Users</DialogHeader>
        <div className="flex flex-col gap-2 mt-4 font-bold">
          {currentChannel?.users?.map((user) => (
            <UserPopover userId={user?.id}>
              <div className="flex flex-row gap-4  items-center">
                <AvatarComponent
                  className="h-8 w-8"
                  src={user?.id}
                  alt={user?.name}
                  fallback={user?.name?.[0]}
                />
                {user?.name}
              </div>
            </UserPopover>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
