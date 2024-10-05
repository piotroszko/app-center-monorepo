import { ModeToggle } from "@repo/ui/theme/ThemeSelectButton";
import React from "react";
import { LogoWithRedirect, NavigationMenu } from "./_navigation_buttons";

export default async function Page() {
  return (
    <main>
      <div className="h-14 bg-secondary flex flex-row items-center justify-end px-4 gap-8">
        <LogoWithRedirect />
        <NavigationMenu />
        <ModeToggle />
      </div>
    </main>
  );
}
