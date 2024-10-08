import React from "react";
import { LoginForm } from "./_form";

export default async function Page() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <LoginForm />
      </div>
    </main>
  );
}
