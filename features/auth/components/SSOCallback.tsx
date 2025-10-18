"use client";

import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { SSOCallbackPageProps } from "../types";

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
  const { handleRedirectCallback } = useClerk();

  React.useEffect(() => {
    void handleRedirectCallback(searchParams);
  }, [searchParams, handleRedirectCallback]);

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Loader2 className="h-16 w-16 animate-spin" aria-hidden="true" />
    </div>
  );
}
