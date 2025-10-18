import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "../../../../../features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl mb-2">パスワード再設定メールを送る</CardTitle>
          <CardDescription>
            メールアドレスを入力してください。確認コードを送信します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
