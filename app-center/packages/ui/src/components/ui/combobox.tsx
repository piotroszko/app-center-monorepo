"use client";

import { UIEventHandler, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "@ui/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  onChange?: (value: SelectOption, close?: () => void) => void;
  options: SelectOption[];
  defaultText?: string;
  defaultSelectText?: string;
  notFoundText?: string;
  className?: string;
  defaultValue?: SelectOption;
}

export function Combobox(props: ComboboxProps) {
  const [value, setValue] = useState<SelectOption | null>(
    props.defaultValue || null,
  );

  return <ComboboxBase {...props} value={value} setValue={setValue} />;
}

interface ComboboxBaseProps {
  value: SelectOption | null | undefined;
  setValue: (value: SelectOption | null) => void;
  modal?: boolean;
  onScrolledToBottom?: () => void;
}

export function ComboboxBase({
  onChange,
  options,
  defaultText,
  defaultSelectText,
  notFoundText,
  className,
  setValue,
  value,
  modal = false,
  onScrolledToBottom,
}: ComboboxProps & ComboboxBaseProps) {
  const [lastItemScrolledTo, setLastItemScrolledTo] =
    useState<SelectOption | null>(null);
  const [open, setOpen] = useState(false);

  const handleOnScroll: UIEventHandler<HTMLDivElement> = onScrolledToBottom
    ? (e) => {
        if (lastItemScrolledTo === options[options.length - 1]) {
          return;
        }
        const target = e.target as HTMLDivElement;
        const bottom =
          target.scrollHeight - target.scrollTop === target.clientHeight;
        if (bottom) {
          onScrolledToBottom?.();
          setLastItemScrolledTo(options[options.length - 1]!);
        }
      }
    : () => {};
  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value.value)?.label
            : defaultText || ""}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-0">
        <Command>
          <CommandInput placeholder={defaultSelectText || ""} />
          <CommandList onScroll={handleOnScroll}>
            <CommandEmpty>{notFoundText || ""}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    if (currentValue === value?.value) {
                      setValue(null);
                    }
                    const findCurrentOption = options.find(
                      (option) => option.value === currentValue,
                    );
                    if (findCurrentOption) {
                      setValue(findCurrentOption);
                    }
                    setOpen(false);
                    onChange?.(option, () => setOpen(false));
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.value === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
