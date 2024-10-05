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
} from "../../ui/navigation-menu";
import { cn } from "@ui/lib/utils";
import { text } from "stream/consumers";

interface ButtonWithDropdown {
  key: string;
  title: string;
  icon?: React.ReactNode;
  items?: {
    key: string;
    title: string;
    icon?: React.ReactNode;
    href: string;
    description?: string;
  }[];
}
interface ButtonWithoutDropdown {
  key: string;
  title: string;
  icon?: React.ReactNode;
  href: string;
}

interface MenuButtonsProps {
  buttons: (ButtonWithDropdown | ButtonWithoutDropdown)[];
}

const isButtonWithDropdown = (object: any): object is ButtonWithDropdown => {
  return "items" in object && Array.isArray(object.items);
};
const isButtonWithoutDropdown = (
  object: any,
): object is ButtonWithoutDropdown => {
  return "href" in object;
};

const ButtonWithoutDropdown = ({
  href,
  title,
  icon,
}: ButtonWithoutDropdown) => {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(navigationMenuTriggerStyle(), `flex gap-1`)}
        >
          {icon}
          {title}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};

const ButtonWithDropdown = ({ title, icon, items }: ButtonWithDropdown) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={"flex gap-1"}>
        {icon}
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[200px] gap-3 p-2 md:w-[300px] md:grid-cols-1 lg:w-[300px] ">
          {items?.map((item) => (
            <ListItem key={item.title} title={item.title} href={item.href}>
              {item.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export function NavButtonWrapper({ buttons }: MenuButtonsProps) {
  return (
    <NavigationMenu orientation="horizontal">
      <NavigationMenuList className="gap-2">
        {buttons.map((button) => {
          if (isButtonWithDropdown(button)) {
            return (
              <ButtonWithDropdown
                key={button.key}
                title={button.title}
                icon={button.icon}
                items={button.items}
              />
            );
          } else if (isButtonWithoutDropdown(button)) {
            return (
              <ButtonWithoutDropdown
                key={button.key}
                title={button.title}
                icon={button.icon}
                href={button.href}
              />
            );
          }
        })}
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
