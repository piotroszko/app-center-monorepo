"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@repo/ui/components/ui/navigation-menu";
import { cn } from "@repo/ui/lib/utils";
import { IconBrandGithub } from "@repo/ui/icons";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Login",
    href: "/auth/login",
    description: "Login to your account to access your apps and services.",
  },
  {
    title: "Register",
    href: "/auth/register",
    description: "Create a new account to access the latest apps and services.",
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu orientation="horizontal">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Login</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-2 md:w-[300px] md:grid-cols-1 lg:w-[300px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="https://github.com/piotroszko/app-center-monorepo"
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), "flex gap-1")}
            >
              <IconBrandGithub />
              Github repository
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
