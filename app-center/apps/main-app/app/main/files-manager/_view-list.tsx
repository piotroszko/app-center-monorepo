import React from "react";
import {
  FileText,
  MoreVertical,
  Download,
  Trash,
  Share,
  Pencil,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown";
import { Button } from "@repo/ui/components/ui/button";

export const FilesListView = () => {
  return (
    <div className="space-y-2">
      {[...Array(8)].map((_, i) => (
        <ContextMenu key={i}>
          <ContextMenuTrigger>
            <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-4" />
                <div>
                  <p className="text-sm font-medium">Document {i + 1}.pdf</p>
                  <p className="text-xs text-muted-foreground">
                    Modified 2d ago
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </ContextMenuItem>
            <ContextMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem>
              <Share className="mr-2 h-4 w-4" />
              Share
            </ContextMenuItem>
            <ContextMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
};
