"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OAuthSignIn } from "../../../../features/auth/components/OauthSignin";
import { SignInForm } from "../../../../features/auth/components/SigninForm";

export default function SignInPage() {
  // ClerkとConvexの両方の認証状態を取得
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();

  const router = useRouter();

  // 両方の認証状態がロードされるまで待機
  const isLoading = !clerkLoaded || convexLoading;

  // どちらかが認証済みの場合は、トップページにリダイレクト
  useEffect(() => {
    if (!isLoading && (isSignedIn || isAuthenticated)) {
      router.push("/");
    }
  }, [isSignedIn, isAuthenticated, isLoading, router]);

  // ローディング中は何も表示しない
  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="shadow-lg border-0 w-full max-w-md">
        <CardHeader className="space-y-1 text-center mt-3 pb-5">
          <CardTitle className="text-3xl font-bold">ログイン</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <OAuthSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">または</span>
            </div>
          </div>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 pt-6">
          <Link
            aria-label="Reset password"
            href="/signin/reset-password"
            className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
          >
            パスワードを忘れた場合
          </Link>
          <div className="text-sm text-muted-foreground">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/signup"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              新規登録
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
