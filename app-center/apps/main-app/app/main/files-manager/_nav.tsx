import { Button } from "@repo/ui/components/ui/button";
import React from "react";
import { FileText, Image, Film, Music } from "lucide-react";

export const FilesNavigation = () => {
  return (
    <nav className="space-y-2">
      <NavItem icon={<FileText className="mr-2 h-4 w-4" />} title="My Files" />
      <NavItem icon={<Image className="mr-2 h-4 w-4" />} title="Photos" />
      <NavItem icon={<Film className="mr-2 h-4 w-4" />} title="Videos" />
      <NavItem icon={<Music className="mr-2 h-4 w-4" />} title="Music" />
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
