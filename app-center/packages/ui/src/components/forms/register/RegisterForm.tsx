"use client";
import React from "react";
import { Label } from "@ui/components/ui/label";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import z from "zod";

interface RegisterFormProps {
  onSubmit: (data: { login: string; email: string; password: string }) => void;
}

const zodSchema = z
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

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const result = zodSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      return;
    }
    onSubmit(result.data);
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Register to App Center
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="login">Login</Label>
          <Input id="login" placeholder="Coologin" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="myemail@mail.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="•••••••••" type="password" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="repeat">Repeat Password</Label>
          <Input id="repeat" placeholder="•••••••••" type="password" />
        </LabelInputContainer>

        <Button
          variant={"secondary"}
          className="block relative group/btn w-full font-medium"
          type="submit"
        >
          Sign up&rarr;
        </Button>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
