import React from "react";
import { RegisterForm } from "./_form";

export default async function Page() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <RegisterForm />
      </div>
    </main>
  );
}
