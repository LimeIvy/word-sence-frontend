"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Home, Trophy } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { Battle } from "../../types/battle";

export interface BattleResultModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** バトル情報 */
  battle: Battle;
  /** 自分のユーザーID */
  myUserId: Id<"user">;
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** ホームに戻る */
  onGoHome?: () => void;
}

/**
 * バトル結果モーダルコンポーネント
 */
export function BattleResultModal({
  isOpen,
  onClose,
  battle,
  myUserId,
  myName = "あなた",
  opponentName = "相手",
  onGoHome,
}: BattleResultModalProps) {
  const myPlayer = battle.players.find((p) => p.user_id === myUserId);
  const opponentPlayer = battle.players.find((p) => p.user_id !== myUserId);

  const isWinner = battle.winner_ids?.includes(myUserId) ?? false;
  const isDraw = battle.winner_ids === undefined || battle.winner_ids.length === 0;

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      // デフォルトの動作: ホームページに遷移
      window.location.href = "/";
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-5 h-5" />
            バトル終了
          </DialogTitle>
          <DialogDescription>最終結果</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 勝敗結果 */}
          <div className="text-center py-6">
            {isDraw ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-700">引き分け</div>
                <div className="text-sm text-gray-600">どちらも勝利条件を満たしていません</div>
              </div>
            ) : isWinner ? (
              <div className="space-y-2">
                <Crown className="w-16 h-16 text-yellow-500 mx-auto" />
                <div className="text-3xl font-bold text-green-600">勝利！</div>
                <div className="text-sm text-gray-600">おめでとうございます！</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-red-600">敗北</div>
                <div className="text-sm text-gray-600">次回は頑張りましょう</div>
              </div>
            )}
          </div>

          {/* 最終スコア */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-center">最終スコア</div>
            <div className="grid grid-cols-2 gap-4">
              {/* 自分のスコア */}
              {myPlayer && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isWinner ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">{myName}</div>
                    <div className="text-3xl font-bold">{myPlayer.score}点</div>
                  </div>
                </div>
              )}

              {/* 相手のスコア */}
              {opponentPlayer && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    !isWinner && !isDraw
                      ? "bg-green-50 border-green-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">{opponentName}</div>
                    <div className="text-3xl font-bold">{opponentPlayer.score}点</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ラウンド情報 */}
          <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-center text-gray-700">
              総ラウンド数: {battle.current_round}ラウンド
            </div>
          </div>

          {/* 勝利者リスト（複数人の場合） */}
          {battle.winner_ids && battle.winner_ids.length > 1 && (
            <div className="px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm font-semibold text-yellow-900 mb-2">勝利者</div>
              <div className="text-sm text-yellow-800">
                {battle.winner_ids.length}人で引き分け（同点勝利）
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleGoHome} className="flex items-center gap-2 w-full">
            <Home className="w-4 h-4" />
            ホームに戻る
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
