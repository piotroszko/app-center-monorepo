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
import Link from "next/link";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

const loginSchema = z.object({
  login: z.string().min(5, {
    message: "Login must be at least 5 characters long",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export function LoginForm() {
  const [, setCookie] = useCookies(["Authorization", "RefreshToken"]);
  const { toast } = useToast();
  const { push } = useRouter();

  const { mutate } = trpc.auth.login.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      if (isNil(data)) {
        toast({
          title: "Error",
          description: "Server error",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem("token", data);
      setCookie("Authorization", data, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        domain: "localhost",
        path: "/",
      });
      toast({
        title: "Success",
        description: "Successfully logged in. Redirecting...",
        variant: "default",
      });

      push("/main/dashboard");
    },
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate?.({
      login: values.login,
      password: values.password,
    });
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <div className="flex justify-center items-center mb-8 w-full h-auto">
        <Logo href={"/"} className="w-3/4" />
      </div>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Login
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
          <FormInput
            control={form.control}
            name="login"
            label="Login or Email"
            className="mb-4"
            placeholder="Coologin"
            type="text"
          />
          <FormInput
            control={form.control}
            name="password"
            label="Password"
            className="mb-4"
            placeholder="•••••••••"
            type="password"
          />
          <Button
            variant={"secondary"}
            className="block relative group/btn w-full font-medium"
            type="submit"
          >
            Login&rarr;
          </Button>
          <div className="text-center text-neutral-600 dark:text-neutral-400 mt-8 text-sm">
            If you don't have an account yet,{" "}
            <Link
              href={"/auth/register"}
              className="text-primary hover:underline"
            >
              register here.
            </Link>{" "}
          </div>
        </form>
      </Form>
    </div>
  );
}
