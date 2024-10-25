import { Spinner } from "@repo/ui/components/ui/spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Spinner size={"large"} />
    </div>
  );
};

export default Loading;
