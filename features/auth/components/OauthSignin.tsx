"use client";

import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { FaGoogle } from "react-icons/fa6";

// 認証可能なプロバイダ
const oauthProviders = [{ name: "Google", strategy: "oauth_google" }] satisfies {
  name: string;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  const OAuthSignIn = React.useCallback(
    async (provider: OAuthStrategy) => {
      if (!signInLoaded) return null;
      try {
        setIsLoading(provider);
        await signIn.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        });
      } catch (err) {
        setIsLoading(null);
        const unknownError = "申し訳ありませんが、何か問題が発生しました。再度お試しください。";
        console.error(unknownError);
        console.error(err);
      }
    },
    [signInLoaded, signIn]
  );

  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-1 sm:gap-2">
      <div id="clerk-captcha" className="hidden" />
      {oauthProviders.map((provider) => {
        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant="outline"
            className="w-full bg-background sm:w-auto"
            onClick={() => void OAuthSignIn(provider.strategy)}
            disabled={isLoading !== null}
          >
            {isLoading === provider.strategy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <FaGoogle className="h-2 w-2" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
