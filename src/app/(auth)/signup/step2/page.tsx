"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function SignupStep2Page() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsPending(true);
    setErrorMessage("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setErrorMessage("認証コードが正しくありません。もう一度お試しください。");
      }
    } catch (err) {
      console.error("Email verification error:", err);
      setErrorMessage("認証に失敗しました。もう一度お試しください。");
    } finally {
      setIsPending(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setErrorMessage("");
    } catch (err) {
      console.error("Resend code error:", err);
      setErrorMessage("認証コードの再送信に失敗しました。");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="shadow-lg border-0 w-full max-w-md">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-3xl font-bold">メール認証</CardTitle>
          <p className="text-muted-foreground">
            登録したメールアドレスに送信された認証コードを入力してください
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="min-h-[60px] flex items-start">
              {errorMessage && (
                <Alert variant="destructive" className="w-full">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">認証コード</Label>
              <Input
                id="code"
                type="text"
                placeholder="6桁の認証コード"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              認証する
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isPending}
              className="w-full"
            >
              認証コードを再送信
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 pt-6">
          <div className="text-sm text-muted-foreground">
            認証コードが届かない場合は、迷惑メールフォルダもご確認ください
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
