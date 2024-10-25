import React from "react";
import Files from "./_files";
import { ClientPageTransition } from "@repo/ui/components/ui/client-page-transition";

const FileManagerPage = () => {
  return (
    <ClientPageTransition>
      <Files />
    </ClientPageTransition>
  );
};

export default FileManagerPage;
