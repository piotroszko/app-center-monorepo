import React from "react";
import FilesComponent from "./_files";
import { ClientPageTransition } from "@repo/ui/components/ui/client-page-transition";

const FileManagerPage = () => {
  return (
    <ClientPageTransition>
      <FilesComponent />
    </ClientPageTransition>
  );
};

export default FileManagerPage;
