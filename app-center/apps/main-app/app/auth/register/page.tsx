import { RegisterForm } from "@repo/ui/forms";
import React from "react";

export default async function Page() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <RegisterForm onSubmit={console.log} />
      </div>
    </main>
  );
}
