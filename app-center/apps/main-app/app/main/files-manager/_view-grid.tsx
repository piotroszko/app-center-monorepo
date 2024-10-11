import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/components/ui/context-menu";
import {
  FileText,
  MoreVertical,
  Download,
  Trash,
  Share,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown";
import { Button } from "@repo/ui/components/ui/button";

export const FilesGridView = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <ContextMenu key={i}>
          <ContextMenuTrigger>
            <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-primary mb-2" />
              <p className="text-sm font-medium">Document {i + 1}.pdf</p>
              <p className="text-xs text-muted-foreground">Modified 2d ago</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mt-2">
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
