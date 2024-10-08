"use client";
import React, { useState, PropsWithChildren } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconMessage,
} from "@tabler/icons-react";
import { cn } from "@repo/ui/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarBody,
  SidebarLink,
} from "@repo/ui/components/ui/sidebar";
import { trpc } from "@repo/trpc/clients/client";
import { Button } from "@repo/ui/components/ui/button";
import { Logo } from "@repo/ui/custom";
import { usePathname } from "next/navigation";

export const TestChat = () => {
  const register = trpc.auth.register.useMutation();
  const login = trpc.auth.login.useMutation();

  const testRegister = () => {
    console.log("register");
    register.mutate({
      email: "test2@test.com",
      login: "piotroszko",
      password: "password",
      repeatPassword: "password",
    });
  };
  return (
    <div className="flex flex-col">
      <Button onClick={testRegister}>Register</Button>
      <Button
        onClick={() =>
          login.mutate(
            { login: "piotroszko", password: "password" },
            {
              onSuccess: (data) => {
                console.log(data);
              },
            },
          )
        }
      >
        Login
      </Button>
    </div>
  );
};

export function Sidebar({ children }: PropsWithChildren) {
  const path = usePathname();
  const links = [
    {
      label: "Dashboard",
      href: "/main/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chat",
      href: "/main/chat",
      icon: (
        <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/main/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen",
      )}
    >
      <SidebarComponent open={open} setOpen={setOpen} active={path}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? (
              <Logo
                key="logo-full"
                href={"/main/dashboard"}
                size={"full"}
                className={cn("transition-all", "w-48")}
              />
            ) : (
              <Logo
                key="logo-icon"
                href={"/main/dashboard"}
                size={"icon"}
                className={cn("transition-all", "w-8")}
              />
            )}

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </SidebarComponent>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
