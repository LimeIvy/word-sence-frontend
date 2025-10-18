import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  password: z
    .string()
    .min(8, {
      message: "パスワードは少なくとも8文字以上である必要があります。",
    })
    .max(100, { message: "パスワードは100文字以内である必要があります。" })
    .regex(/^(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
      message: "パスワードは少なくとも8文字以上で、1つの小文字と1つの数字を含めてください。",
    }),
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "確認コードは6文字である必要があります。",
    })
    .max(6),
});

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。もう一度確認してください。",
    path: ["confirmPassword"],
  });

export const userPrivateMetadataSchema = z.object({
  role: z.enum(["user", "admin"]),
  stripePriceId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeCurrentPeriodEnd: z.string().optional().nullable(),
});
