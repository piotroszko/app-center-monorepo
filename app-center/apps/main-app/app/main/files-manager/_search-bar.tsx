"use client";
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";

export const FilesSearchBar = () => {
  return (
    <div className="flex items-center w-full max-w-sm">
      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
      <Input type="search" placeholder="Search files..." className="w-full" />
    </div>
  );
};
