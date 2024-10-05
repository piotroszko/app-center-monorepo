import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mode, useForm as useFormRh } from "react-hook-form";
import { ComponentProps } from "react";
import { Input } from "./input";

export const useForm = <T extends Record<string, any>>(
  schema?: ZodType<FormData>,
  initialValues?: T,
  mode?: Mode,
) => {
  const form = useFormRh<FormData>({
    ...(schema && { resolver: zodResolver(schema) }),
    ...(initialValues && { defaultValues: initialValues }),
    ...(mode && { mode }),
  });
  return { ...form };
};
