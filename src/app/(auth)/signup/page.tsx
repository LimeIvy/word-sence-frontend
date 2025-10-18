"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignupForm } from "../../../../features/auth/components/SignupForm";

export default function SignUpPage() {
  // 認証済みのユーザー情報を取得
  const { isAuthenticated, isLoading } = useConvexAuth();

  const router = useRouter();

  // ローディング中は何も表示しない
  if (isLoading) {
    return null;
  }

  // 認証済みの場合は、トップページにリダイレクト
  if (isAuthenticated) {
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="shadow-lg border-0 w-full max-w-md">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-3xl font-bold">新規登録</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SignupForm />
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 pt-6">
          <div className="text-sm text-muted-foreground">
            既にアカウントをお持ちの方は
            <Link
              href="/signin"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              ログイン
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
