"use client";

import { Option } from "@ui/components/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { cn } from "@ui/lib/utils";
import { FormFieldProps } from "@ui/models/form";
import { FieldValues } from "react-hook-form";

interface FormSelectProps {
  options: Option[];
  placeholder?: string;
  className?: string;
}

export const FormSelect = <T extends FieldValues>({
  options,
  label,
  placeholder,
  control,
  name,
  defaultValue,
  className,
}: FormSelectProps & FormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
