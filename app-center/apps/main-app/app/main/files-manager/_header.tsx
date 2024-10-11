"use client";
import React from "react";
import { Grid, List } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui/components/ui/toggle-group";

interface FilesHeaderProps {
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
}

export const FilesHeader = ({ setViewMode, viewMode }: FilesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">Recent Files</h2>
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => setViewMode(value as "grid" | "list")}
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
