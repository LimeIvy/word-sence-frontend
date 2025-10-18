"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthSignIn } from "../../../../features/auth/components/OauthSignin";
import { SignInForm } from "../../../../features/auth/components/SigninForm";

export default function SignInPage() {
  // 認証済みのユーザー情報を取得
  const { user } = useUser();

  // 認証済みの場合は、トップページにリダイレクト
  if (user) redirect("/");

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-3xl font-bold">ログイン</CardTitle>
        <CardDescription className="text-base">
          お好みのサインイン方法を選択してください
        </CardDescription>
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
  );
}
