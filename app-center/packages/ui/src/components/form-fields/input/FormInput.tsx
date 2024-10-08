import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { isNil } from "lodash";
import { Control, FieldValues, Path } from "react-hook-form";

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  placeholder,
  type,
}: {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}) => {
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
