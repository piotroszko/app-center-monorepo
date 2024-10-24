"use client";
import { ComboboxBase } from "@ui/components/ui/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { FormFieldProps } from "@ui/models/form";
import { ComponentProps } from "react";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

export const FormCombobox = <T extends FieldValues>({
  defaultValue,
  control,
  name,
  label,
  options,
  ...props
}: Omit<ComponentProps<typeof ComboboxBase>, "setValue" | "value"> &
  FormFieldProps<T>) => {
  const { setValue } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <ComboboxBase
            {...props}
            setValue={(value) => {
              setValue(name, value?.value as PathValue<T, Path<T>>);
            }}
            options={options}
            value={options.find((option) => option.value === field.value)}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
