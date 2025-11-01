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
import { ArrowRight, CheckCircle2, Trophy, XCircle } from "lucide-react";
import type { RoundResult } from "../../types/battle";
import { getPointReasonText } from "../../utils/score-calculator";

export interface RoundResultModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** ラウンド結果 */
  roundResult: RoundResult;
  /** 自分のユーザーID */
  myUserId: string;
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** 次のラウンドへ進む */
  onNextRound?: () => void;
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * ラウンド結果モーダルコンポーネント
 */
export function RoundResultModal({
  isOpen,
  onClose,
  roundResult,
  myUserId,
  myName = "あなた",
  opponentName = "相手",
  onNextRound,
  isLoading = false,
}: RoundResultModalProps) {
  const mySubmission = roundResult.submissions.find((s) => s.user_id === myUserId);
  const opponentSubmission = roundResult.submissions.find((s) => s.user_id !== myUserId);

  const myPoints = roundResult.points_awarded.find((p) => p.user_id === myUserId);
  const opponentPoints = roundResult.points_awarded.find((p) => p.user_id !== myUserId);

  const isWinner = roundResult.winner_id === myUserId;
  const isDraw = !roundResult.winner_id;

  const handleNextRound = () => {
    if (onNextRound) {
      onNextRound();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-5 h-5" />
            ラウンド{roundResult.round_number} 結果
          </DialogTitle>
          <DialogDescription>ラウンドの結果とポイント付与状況</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* お題カード表示 */}
          <div className="text-center py-4 bg-amber-50 rounded-lg border-2 border-amber-200">
            <div className="text-sm font-bold mb-2" style={{ color: "#B45309" }}>
              お題カード
            </div>
            <div
              className="text-2xl font-black"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: "0.15em",
                color: "#B45309",
                display: "inline-block",
              }}
            >
              {roundResult.field_card_text}
            </div>
          </div>

          {/* 提出結果 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 自分の結果 */}
            <div
              className={`p-4 rounded-lg border-2 ${
                isWinner ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{myName}</span>
                {isWinner && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </div>
              {mySubmission && (
                <div className="space-y-2 text-sm">
                  <div className="font-bold text-lg">{mySubmission.card_text}</div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">類似度:</span>
                    <span className="font-mono">
                      {Math.round((mySubmission.similarity_score + 1) * 50)}点
                    </span>
                  </div>
                  {mySubmission.rarity_bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">レアボーナス:</span>
                      <span className="font-mono text-yellow-600">
                        +{Math.round(mySubmission.rarity_bonus * 50)}点
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">最終スコア:</span>
                    <span className="font-mono font-bold text-lg">
                      {Math.round((mySubmission.final_score + 1) * 50)}点
                    </span>
                  </div>
                  {mySubmission.submission_type === "victory_declaration" && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      勝利宣言
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 相手の結果 */}
            <div
              className={`p-4 rounded-lg border-2 ${
                !isWinner && !isDraw ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{opponentName}</span>
                {!isWinner && !isDraw && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </div>
              {opponentSubmission && (
                <div className="space-y-2 text-sm">
                  <div className="font-bold text-lg">{opponentSubmission.card_text}</div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">類似度:</span>
                    <span className="font-mono">
                      {Math.round((opponentSubmission.similarity_score + 1) * 50)}点
                    </span>
                  </div>
                  {opponentSubmission.rarity_bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">レアボーナス:</span>
                      <span className="font-mono text-yellow-600">
                        +{Math.round(opponentSubmission.rarity_bonus * 50)}点
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">最終スコア:</span>
                    <span className="font-mono font-bold text-lg">
                      {Math.round((opponentSubmission.final_score + 1) * 50)}点
                    </span>
                  </div>
                  {opponentSubmission.submission_type === "victory_declaration" && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      勝利宣言
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ポイント付与 */}
          <div className="space-y-3">
            <div className="text-sm font-semibold">ポイント付与</div>
            <div className="grid grid-cols-2 gap-4">
              {/* 自分のポイント */}
              {myPoints && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{myName}</span>
                    <span
                      className={`font-bold text-lg ${
                        myPoints.points > 0
                          ? "text-green-600"
                          : myPoints.points < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {myPoints.points > 0 ? "+" : ""}
                      {myPoints.points}点
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getPointReasonText(myPoints.reason)}
                  </div>
                </div>
              )}

              {/* 相手のポイント */}
              {opponentPoints && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{opponentName}</span>
                    <span
                      className={`font-bold text-lg ${
                        opponentPoints.points > 0
                          ? "text-green-600"
                          : opponentPoints.points < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {opponentPoints.points > 0 ? "+" : ""}
                      {opponentPoints.points}点
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getPointReasonText(opponentPoints.reason)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 勝敗結果 */}
          <div className="text-center py-4 bg-purple-50 rounded-lg border-2 border-purple-300">
            {isDraw ? (
              <div className="text-xl font-bold text-purple-700">引き分け</div>
            ) : isWinner ? (
              <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6" />
                勝利！
              </div>
            ) : (
              <div className="text-xl font-bold text-red-600 flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" />
                敗北
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            閉じる
          </Button>
          {onNextRound && (
            <Button
              onClick={handleNextRound}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              次のラウンドへ
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
