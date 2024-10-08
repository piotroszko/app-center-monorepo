"use client";
import { Button } from "@ui/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@ui/components/ui/form";
import { Logo } from "@ui/components/custom";
import { useToast } from "@ui/components/ui/use-toast";
import { trpc } from "@repo/trpc/clients/client";
import { FormInput } from "@repo/ui/form-fields";

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

export function RegisterForm() {
  const { toast } = useToast();

  const { mutate } = trpc.auth.register.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate?.({
      login: values.login,
      email: values.email,
      password: values.password,
      repeatPassword: values.repeat,
    });
  }

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
          <FormInput
            control={form.control}
            name="login"
            label="Login"
            className="mb-4"
            placeholder="Coologin"
            type="text"
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            className="mb-4"
            placeholder="myemail@mail.com"
            type="email"
          />
          <FormInput
            control={form.control}
            name="password"
            label="Password"
            className="mb-4"
            placeholder="•••••••••"
            type="password"
          />
          <FormInput
            control={form.control}
            name="repeat"
            label="Repeat password"
            className="mb-8"
            placeholder="•••••••••"
            type="password"
          />
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
              sign in here.
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}
