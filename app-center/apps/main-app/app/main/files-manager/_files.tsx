"use client";
import { useState } from "react";
import { Upload, FolderPlus, Settings, LogOut } from "lucide-react";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown";
import { FilesNavigation } from "./_nav";
import { FilesSearchBar } from "./_search-bar";
import { FilesGridView } from "./_view-grid";
import { FilesListView } from "./_view-list";
import { FilesBreadcrumbs } from "./_breadcrumbs";
import { FilesHeader } from "./_header";
import { AvatarComponent } from "@repo/ui/custom";

export default function FilesComponent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-background p-4 hidden md:block border-r">
        <FilesNavigation />
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-between items-center border-r">
          <FilesSearchBar />
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Choose a file to upload to your cloud storage.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" />
                </div>
                <Button type="submit">Upload</Button>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new folder.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input id="folder-name" placeholder="My New Folder" />
                </div>
                <Button type="submit">Create Folder</Button>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AvatarComponent
                  src="/placeholder-user.jpg"
                  alt="User"
                  fallback={"U"}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <FilesBreadcrumbs />

        <div className="flex-1 p-6 overflow-auto">
          <FilesHeader setViewMode={setViewMode} viewMode={viewMode} />
          {viewMode === "grid" ? <FilesGridView /> : <FilesListView />}
        </div>
      </main>
    </div>
  );
}
