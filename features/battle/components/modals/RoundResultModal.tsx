"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
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
  myUserId: Id<"user">;
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
      <DialogContent
        className="max-w-2xl border-4 border-amber-700/50 bg-[#FDF6E3]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a373' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <DialogHeader className="border-b-2 border-amber-700/20 pb-4">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-black text-amber-900 tracking-widest">
            <Trophy className="w-8 h-8 text-amber-600" />
            <span style={{ fontFamily: "'Noto Serif JP', serif" }}>
              第{roundResult.round_number}回戦 結果
            </span>
            <Trophy className="w-8 h-8 text-amber-600" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* お題カード表示 */}
          <div className="text-center py-6 bg-amber-50 rounded-xl border-2 border-amber-200 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
            <div className="text-sm font-bold mb-3 text-amber-800 tracking-widest">◆ お題 ◆</div>
            <div
              className="text-4xl font-black text-amber-900"
              style={{
                fontFamily: "'Noto Serif JP', serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {roundResult.field_card_text}
            </div>
          </div>

          {/* 提出結果 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 自分の結果 */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                isWinner
                  ? "bg-amber-100 border-amber-500 shadow-md transform scale-105"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-black/10 pb-2">
                <span className="font-bold text-amber-900">{myName}</span>
                {isWinner && <CheckCircle2 className="w-6 h-6 text-amber-600" />}
              </div>
              {mySubmission && (
                <div className="space-y-3">
                  <div className="font-black text-xl text-center py-2 text-stone-800">
                    {mySubmission.card_text}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>類似度</span>
                      <span className="font-mono font-bold">
                        {Math.round((mySubmission.similarity_score + 1) * 50)}
                      </span>
                    </div>
                    {mySubmission.rarity_bonus > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>希少性</span>
                        <span className="font-mono font-bold">
                          +{Math.round(mySubmission.rarity_bonus * 50)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-black/10 pt-2 mt-2">
                      <span className="font-bold text-amber-900">合計</span>
                      <span className="font-mono font-black text-xl text-amber-900">
                        {Math.round((mySubmission.final_score + 1) * 50)}
                      </span>
                    </div>
                  </div>
                  {mySubmission.submission_type === "victory_declaration" && (
                    <div className="text-xs text-center font-bold text-red-600 bg-red-100 py-1 rounded border border-red-200">
                      勝利宣言
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 相手の結果 */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                !isWinner && !isDraw
                  ? "bg-amber-100 border-amber-500 shadow-md transform scale-105"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-black/10 pb-2">
                <span className="font-bold text-amber-900">{opponentName}</span>
                {!isWinner && !isDraw && <CheckCircle2 className="w-6 h-6 text-amber-600" />}
              </div>
              {opponentSubmission && (
                <div className="space-y-3">
                  <div className="font-black text-xl text-center py-2 text-stone-800">
                    {opponentSubmission.card_text}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>類似度</span>
                      <span className="font-mono font-bold">
                        {Math.round((opponentSubmission.similarity_score + 1) * 50)}
                      </span>
                    </div>
                    {opponentSubmission.rarity_bonus > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>希少性</span>
                        <span className="font-mono font-bold">
                          +{Math.round(opponentSubmission.rarity_bonus * 50)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-black/10 pt-2 mt-2">
                      <span className="font-bold text-amber-900">合計</span>
                      <span className="font-mono font-black text-xl text-amber-900">
                        {Math.round((opponentSubmission.final_score + 1) * 50)}
                      </span>
                    </div>
                  </div>
                  {opponentSubmission.submission_type === "victory_declaration" && (
                    <div className="text-xs text-center font-bold text-red-600 bg-red-100 py-1 rounded border border-red-200">
                      勝利宣言
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ポイント変動 */}
          <div className="bg-white/50 rounded-lg p-4 border border-amber-200">
            <div className="text-xs font-bold text-amber-800 mb-2 text-center tracking-widest">
              - ポイント変動 -
            </div>
            <div className="grid grid-cols-2 gap-8">
              {myPoints && (
                <div className="text-center">
                  <div
                    className={`text-2xl font-black ${
                      myPoints.points > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {myPoints.points > 0 ? "+" : ""}
                    {myPoints.points}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {getPointReasonText(myPoints.reason)}
                  </div>
                </div>
              )}
              {opponentPoints && (
                <div className="text-center">
                  <div
                    className={`text-2xl font-black ${
                      opponentPoints.points > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {opponentPoints.points > 0 ? "+" : ""}
                    {opponentPoints.points}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {getPointReasonText(opponentPoints.reason)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 勝敗結果 */}
          <div className="text-center py-4">
            {isDraw ? (
              <div className="text-3xl font-black text-stone-600 tracking-widest">引き分け</div>
            ) : isWinner ? (
              <div className="text-4xl font-black text-amber-600 tracking-widest drop-shadow-sm animate-bounce">
                勝 利
              </div>
            ) : (
              <div className="text-3xl font-black text-stone-500 tracking-widest">敗 北</div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-4 border-t-2 border-amber-700/20 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            閉じる
          </Button>
          {onNextRound && (
            <Button
              onClick={handleNextRound}
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-lg"
            >
              次のラウンドへ
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
