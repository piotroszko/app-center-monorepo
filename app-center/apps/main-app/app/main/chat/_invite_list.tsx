"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import React from "react";
import { AlertCircle } from "lucide-react";

export const CreateChannelButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => null} variant={"ghost"} className="relative">
          {/* blinking icon 1sec */}
          <AlertCircle className="w-4 h-4 absolute top-0 right-0 text-destructive/90 animate-pulse duration-1000" />
          Invites
        </Button>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
};
