import { ModeToggle } from "@repo/ui/theme/ThemeSelectButton";
import React from "react";
import { NavigationMenu } from "./_navigation_buttons";
import { Logo } from "@repo/ui/custom";
import { cn } from "@repo/ui/lib/utils";

export default async function Page() {
  return (
    <main>
      <div className="h-14 bg-secondary flex flex-row items-center justify-end px-4 gap-8">
        <Logo href={"/"} className={cn("h-10 mr-auto")} />
        <NavigationMenu />
        <ModeToggle />
      </div>
    </main>
  );
}
