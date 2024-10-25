"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export const ClientPageTransition = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      // exit={{ opacity: 1, scale: 0.9 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};
