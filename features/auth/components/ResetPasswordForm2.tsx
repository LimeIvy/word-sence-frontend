"use client";

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
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { resetPasswordSchema } from "../schema/authValidate";
import { PasswordInput } from "./PasswordInput";

type Inputs = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordStep2Form() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const HandleSubmit = React.useCallback(
    (data: Inputs) => {
      if (!isLoaded) return;

      startTransition(async () => {
        try {
          const attemptFirstFactor = await signIn.attemptFirstFactor({
            strategy: "reset_password_email_code",
            code: data.code,
            password: data.password,
          });

          if (attemptFirstFactor.status === "needs_second_factor") {
            // TODO: implement 2FA (requires clerk pro plan)
          } else if (attemptFirstFactor.status === "complete") {
            await setActive({
              session: attemptFirstFactor.createdSessionId,
            });
            router.push(`${window.location.origin}/`);
          } else {
            console.error(attemptFirstFactor);
          }
        } catch (err) {
          console.error("申し訳ありませんが、何か問題が発生しました。再度お試しください。");
          console.error(err);
        }
      });
    },
    [isLoaded, signIn, setActive, router, startTransition]
  );

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(HandleSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>新しいパスワード</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
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
              <FormLabel>新しいパスワード再入力</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>確認コード</FormLabel>
              <FormControl>
                <Input
                  placeholder="169420"
                  {...field}
                  onChange={(e) => {
                    e.target.value = e.target.value.trim();
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          パスワードをリセット
          <span className="sr-only">パスワードをリセット</span>
        </Button>
      </form>
    </Form>
  );
}
