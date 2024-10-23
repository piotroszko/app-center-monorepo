import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { FormFieldProps } from "@ui/models/form";
import { isNil } from "lodash";
import { FieldValues } from "react-hook-form";

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  placeholder,
  type,
}: {
  className?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
} & FormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {!isNil(label) && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              id={"input-" + name}
              placeholder={placeholder}
              type={type}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
