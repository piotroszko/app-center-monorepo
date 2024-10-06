"use client";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { cn } from "@ui/lib/utils";
import { isNil } from "lodash";
import { Logo } from "@ui/components/custom";

interface RegisterFormProps {
  onRegister?: (data: {
    login: string;
    email: string;
    password: string;
    repeat: string;
  }) => void;
  error?: string;
}

const registerSchema = z
  .object({
    login: z.string().min(5, {
      message: "Login must be at least 5 characters long",
    }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    repeat: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.repeat, {
    message: "Passwords do not match",
    path: ["repeat"],
  });

export function RegisterForm({ onRegister, error }: RegisterFormProps) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    onRegister?.(values);
  }
  const isError = !isNil(error);

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <div className="flex justify-center items-center mb-8 w-full h-auto">
        <Logo href={"/"} className="w-3/4" />
      </div>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Registration
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input
                    id="login"
                    placeholder="Coologin"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="myemail@mail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="•••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeat"
            render={({ field }) => (
              <FormItem className={isError ? "mb-4" : "mb-8"}>
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <Input
                    id="repeat"
                    placeholder="•••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isError && (
            <p className={cn("text-[0.8rem] text-destructive mb-4")}>{error}</p>
          )}
          <Button
            variant={"secondary"}
            className="block relative group/btn w-full font-medium"
            type="submit"
          >
            Sign up&rarr;
          </Button>
          <div className="text-center text-neutral-600 dark:text-neutral-400 mt-8 text-sm">
            If you already have an account, you can{" "}
            <a href="/login" className="text-primary hover:underline">
              sign in
            </a>{" "}
            here.
          </div>
        </form>
      </Form>
    </div>
  );
}
