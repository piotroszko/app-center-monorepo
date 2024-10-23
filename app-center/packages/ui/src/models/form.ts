import { Control, FieldValues, Path, PathValue } from "react-hook-form";

export interface FormFieldProps<T extends FieldValues> {
  defaultValue?: PathValue<T, Path<T>>;
  control: Control<T>;
  name: Path<T>;
  label?: string;
}
