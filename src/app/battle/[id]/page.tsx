"use client";

import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { BattleContainer } from "../../../../features/battle/components/BattleContainer";

/**
 * バトルページ
 */
export default function BattlePage() {
  const params = useParams();
  const router = useRouter();
  const battleId = params.id as Id<"battle"> | undefined;

  // 現在のユーザーを取得
  const user = useQuery(api.user.getMyUser);

  // 認証チェック
  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  // ローディング状態
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">読み込み中...</div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // 認証されていない場合
  if (!user) {
    return null;
  }

  // バトルIDの検証
  if (!battleId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4 text-red-600">バトルIDが無効です</div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return <BattleContainer battleId={battleId} myUserId={user._id} />;
}
