"use client";
import { Button } from "@repo/ui/components/ui/button";
import React from "react";
import {
  FileText,
  FileArchive,
  FileSearch,
  MessageCircle,
  FileJson,
} from "lucide-react";

export const FilesNavigation = () => {
  return (
    <nav className="space-y-2">
      <NavItem icon={<FileText className="mr-2 h-4 w-4" />} title="My files" />
      <NavItem
        icon={<MessageCircle className="mr-2 h-4 w-4" />}
        title="Chat files"
      />
      <NavItem
        icon={<FileJson className="mr-2 h-4 w-4" />}
        title="Wiki files"
      />
      <NavItem icon={<FileSearch className="mr-2 h-4 w-4" />} title="Shared" />

      <NavItem icon={<FileArchive className="mr-2 h-4 w-4" />} title="Recent" />
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
}

const NavItem = ({ icon, title }: NavItemProps) => {
  return (
    <Button variant="ghost" className="w-full justify-start">
      {icon}
      {title}
    </Button>
  );
};
