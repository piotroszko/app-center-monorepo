import { ModeToggle } from "@repo/ui/theme/ThemeSelectButton";
import React from "react";
import { NavigationMenuDemo } from "./_navigation_buttons";

export default async function Page() {
  return (
    <main>
      <div className="h-14 bg-gray-50 dark:bg-gray-800 flex flex-row items-center justify-end px-4 gap-8">
        <NavigationMenuDemo />
        <ModeToggle />
      </div>
    </main>
  );
}
