import { ModeToggle } from "@repo/ui/theme/ThemeSelectButton";
import React from "react";
import { NavigationMenu } from "./_navigation_buttons";
import { Logo } from "./_logo";

export default async function Page() {
  return (
    <main>
      <div className="h-14 bg-gray-50 dark:bg-gray-800 flex flex-row items-center justify-end px-4 gap-8">
        <Logo />
        <NavigationMenu />
        <ModeToggle />
      </div>
    </main>
  );
}
