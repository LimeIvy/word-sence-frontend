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
import { checkEmailSchema } from "../schema/authValidate";

type Inputs = z.infer<typeof checkEmailSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const HandleSubmit = React.useCallback(
    (data: Inputs) => {
      if (!isLoaded) return;

      startTransition(async () => {
        try {
          const firstFactor = await signIn.create({
            strategy: "reset_password_email_code",
            identifier: data.email,
          });

          if (firstFactor.status === "needs_first_factor") {
            router.push("/signin/reset-password/step2");
          }
        } catch (err) {
          const unknownError = "申し訳ありませんが、何か問題が発生しました。再度お試しください。";

          console.error(unknownError);
          console.error(err);
        }
      });
    },
    [isLoaded, signIn, router, startTransition]
  );

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(HandleSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="rodneymullen180@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          再設定メールを送信
          <span className="sr-only">パスワードのリセット確認を続けてください</span>
        </Button>
      </form>
    </Form>
  );
}
