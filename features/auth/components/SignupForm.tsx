"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { signupSchema } from "../schema/authValidate";
import { PasswordInput } from "./PasswordInput";

type Inputs = z.infer<typeof signupSchema>;

type ClerkError = {
  errors?: Array<{ message?: string; longMessage?: string }>;
  message?: string;
};

// Clerkのエラーメッセージを日本語に
const translateClerkError = (rawMessage: string): string => {
  if (rawMessage.includes("That email address is taken")) {
    return "このメールアドレスは既に登録されています。別のメールアドレスをお試しください。";
  }
  if (rawMessage.includes("Password has been found in an online data breach")) {
    return "アカウントの安全性のため、別のパスワードをご使用ください。";
  }
  return rawMessage || "申し訳ありませんが、何か問題が発生しました。再度お試しください。";
};

export function SignupForm() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isPending, startTransition] = React.useTransition();
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const HandleSubmit = React.useCallback(
    (data: Inputs) => {
      if (!isLoaded) return;

      console.log("data", data);

      // エラーメッセージをクリア
      setErrorMessage("");

      startTransition(async () => {
        try {
          const result = await signUp.create({
            emailAddress: data.email,
            password: data.password,
          });

          // メール認証を準備
          if (result.status === "missing_requirements") {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          }

          if (result.status === "missing_requirements") {
            // メール認証が必要な場合、step2ページにリダイレクト
            router.push("/signup/step2");
          } else if (result.status === "complete") {
            await setActive({ session: result.createdSessionId });
            router.push(`${window.location.origin}/`);
          }
        } catch (err: unknown) {
          const rawMessage =
            (err as ClerkError)?.errors?.[0]?.message ||
            (err as ClerkError)?.errors?.[0]?.longMessage ||
            (err as ClerkError)?.message ||
            "";

          const errorMsg = translateClerkError(rawMessage);

          setErrorMessage(errorMsg);
        }
      });
    },
    [isLoaded, signUp, setActive, router, startTransition]
  );

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(HandleSubmit)(...args)}
      >
        <div className="flex items-start">
          {errorMessage && (
            <Alert variant="destructive" className="w-full">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード（確認）</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} className="mt-7">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          新規登録
          <span className="sr-only">新規登録</span>
        </Button>
      </form>
    </Form>
  );
}
