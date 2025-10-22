"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { SSOCallbackPageProps } from "../types";

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
  const { handleRedirectCallback } = useClerk();
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const processCallback = async () => {
      try {
        console.log("Processing OAuth callback...");
        await handleRedirectCallback(searchParams);
        console.log("OAuth callback processed successfully");
        setIsProcessing(false);
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        setError("認証の処理中にエラーが発生しました。");
        setIsProcessing(false);
      }
    };

    void processCallback();
  }, [searchParams, handleRedirectCallback]);

  // ClerkとConvexの両方の認証状態が更新されたらリダイレクト
  React.useEffect(() => {
    if (!isProcessing && clerkLoaded && convexLoading === false) {
      if (isSignedIn || isAuthenticated) {
        console.log("Authentication successful, redirecting to home...");
        router.push("/");
      } else if (!isSignedIn && !isAuthenticated) {
        console.log("Authentication failed, redirecting to signin...");
        router.push("/signin");
      }
    }
  }, [isSignedIn, isAuthenticated, clerkLoaded, convexLoading, isProcessing, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push("/signin")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          サインインページに戻る
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <Loader2 className="h-16 w-16 animate-spin" aria-hidden="true" />
      <p className="mt-4 text-sm text-gray-600">認証を処理中です...</p>
    </div>
  );
}
