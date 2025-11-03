import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordStep2Form } from "../../../../../../features/auth/components/ResetPasswordForm2";

export default function ResetPasswordStep2Page() {
  return (
    <div className="flex items-center justify-center">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl mb-2">パスワードをリセット</CardTitle>
          <CardDescription>メールアドレスと確認コードを入力してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordStep2Form />
        </CardContent>
      </Card>
    </div>
  );
}
