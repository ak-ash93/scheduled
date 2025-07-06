"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { FiCopy, FiCheck, FiX } from "react-icons/fi";

type CopyEventProps = {
  id: string;
  clerkUserId: string;
  className?: string;
};
const CopyEvent: React.FC<CopyEventProps> = ({
  id,
  clerkUserId,
  className,
}) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const handleCopy = async () => {
    const url = `${location.origin}/book/${clerkUserId}/${id}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      toast.success("Link copied to clipboard", {
        duration: 2000,
      });
    } catch (error: unknown) {
      setCopyState("error");
      if (error instanceof Error) {
        toast.error(`Failed to copy link : ${error.message}`, {
          duration: 2000,
        });
      } else {
        toast.error(`Failed to copy link : Unknown error`, {
          duration: 2000,
        });
      }
    } finally {
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "bold",
        gap: "4px",
        padding: "12px 5px",
      }}>
      {copyState === "copied" && <FiCheck color="green" />}
      {copyState === "error" && <FiX color="red" />}
      {copyState === "idle" && <FiCopy />}
      {copyState === "copied"
        ? "Copied!"
        : copyState === "error"
        ? "Failed"
        : "Copy Link"}
    </button>
  );
};

export default CopyEvent;
