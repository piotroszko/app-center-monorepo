import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Sidebar } from "./_navigation";

export const metadata: Metadata = {
  title: "Apps",
  description: "Apps",
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <Sidebar>{children}</Sidebar>;
}
