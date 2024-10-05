import { trpc } from "@repo/trpc/clients/client";
import { RegisterForm } from "@repo/ui/forms";

export const RegisterFormClient = () => {
  const { mutate, error } = trpc.auth.register.useMutation();

  return (
    <RegisterForm
      error={error?.message}
      onRegister={({ email, login, password, repeat }) => {
        mutate({
          email,
          login,
          password,
          repeatPassword: repeat,
        });
      }}
    />
  );
};
