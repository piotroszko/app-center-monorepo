"use client";

import { Button } from "@repo/ui/components/ui/button";
import React from "react";
import { AlertCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { AvatarComponent } from "@repo/ui/custom";
import { Check, X } from "lucide-react";
import { useChat } from "@repo/trpc/ws";

export const InvitesButton = () => {
  const { invites, isNewInvites } = useChat();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button onClick={() => null} variant={"ghost"} className="relative">
          {isNewInvites && (
            <AlertCircle className="w-4 h-4 absolute top-0 right-0 text-destructive/90 animate-pulse duration-1000" />
          )}
          Invites
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <h3 className="font-semibold text-center">Invites</h3>
          {invites.map((invite, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 p-2 rounded-lg transition-all duration-300 bg-muted`}
            >
              <AvatarComponent
                className="h-10 w-10"
                src={invite.channel.id}
                alt={invite.channel.name}
                fallback={invite.channel.name[0]}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {invite.channel.name}
                </p>
                <div className="flex items-center pt-2">
                  <AvatarComponent
                    className="h-6 w-6 mr-2"
                    src={invite.user.avatar_url}
                    alt={invite.user.name}
                    fallback={invite.user.name[0]}
                  />
                  <p className="text-xs text-muted-foreground">
                    Invited by {invite.user.name}
                  </p>
                </div>
                {invite?.data && (
                  <p className="text-xs text-muted-foreground pt-1">
                    {invite?.data}
                  </p>
                )}
                <div className="flex space-x-2 pt-2 w-full">
                  <Button size="sm" className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
