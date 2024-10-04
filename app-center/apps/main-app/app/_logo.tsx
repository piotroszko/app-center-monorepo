"use client";

import * as React from "react";
import Image from "next/image";
import LightImage from "./logo-light.png";
import DarkImage from "./logo-dark.png";
import { useTheme } from "@repo/ui/theme/ThemeProvider";

export function Logo() {
  const { theme } = useTheme();
  console.log("theme", theme);
  return (
    <Image
      src={theme === "dark" ? LightImage : DarkImage}
      alt="favicon"
      className="max-w-full max-h-10 w-auto h-auto block mr-auto"
    />
  );
}
