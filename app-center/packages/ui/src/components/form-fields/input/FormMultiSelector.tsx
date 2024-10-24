import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import MultipleSelector from "@ui/components/ui/multiselect";
import { cn } from "@ui/lib/utils";
import { FormFieldProps } from "@ui/models/form";
import { ComponentProps } from "react";
import { FieldValues } from "react-hook-form";

export const FormMultiSelector = <T extends FieldValues>({
  defaultValue,
  control,
  name,
  label,
  className,
  ...props
}: FormFieldProps<T> &
  Pick<
    ComponentProps<typeof MultipleSelector>,
    | "options"
    | "onSearch"
    | "onLastItemSeen"
    | "onSearchSync"
    | "inputProps"
    | "className"
  >) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <MultipleSelector
            {...props}
            {...field}
            placeholder="Select something..."
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-primary">
                No results found.
              </p>
            }
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
