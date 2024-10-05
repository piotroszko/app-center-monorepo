"use client";

import * as React from "react";
import { Logo, NavButtonWrapper } from "@repo/ui/custom";
import { IconBrandGithub } from "@repo/ui/icons";
import { useRouter } from "next/navigation";

export function NavigationMenu() {
  return (
    <NavButtonWrapper
      buttons={[
        {
          key: "login-nav",
          title: "Login",
          items: [
            {
              key: "login",
              title: "Login",
              href: "/auth/login",
              description:
                "Login to your account to access your apps and services.",
            },
            {
              key: "register",
              title: "Register",
              href: "/auth/register",
              description:
                "Create a new account to access the latest apps and services.",
            },
          ],
        },
        {
          key: "github-nav",
          title: "Github repository",
          href: "https://github.com/piotroszko/app-center-monorepo",
          icon: <IconBrandGithub />,
          customColors: {
            github: true,
          },
        },
      ]}
    />
  );
}

export const LogoWithRedirect = () => {
  const { push } = useRouter();
  return <Logo onClick={() => push("/")} />;
};
