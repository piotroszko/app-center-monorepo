import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Sidebar } from "./_navigation";
import { PageTransition } from "@repo/ui/components/ui/page-transition";

export const metadata: Metadata = {
  title: "Apps",
  description: "Apps",
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Sidebar>
      <PageTransition>{children}</PageTransition>
    </Sidebar>
  );
}
