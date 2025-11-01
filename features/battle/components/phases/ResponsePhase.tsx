"use client";

import { Button } from "@/components/ui/button";
import { Handshake, SkipForward } from "lucide-react";
import type { Card } from "../../../common/types/card";
import type { SubmittedCard, TurnState } from "../../types/player";
import { HandArea } from "../HandArea";
import { OpponentHand } from "../OpponentHand";

export interface ResponsePhaseProps {
  /** 自分の手札 */
  myHand: Card[];
  /** 相手の手札枚数 */
  opponentHandCount: number;
  /** 自分のターン状態 */
  myTurnState: TurnState;
  /** 相手の提出カード情報 */
  opponentSubmission?: SubmittedCard;
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** コールクリック時のコールバック */
  onCall?: () => void;
  /** フォールドクリック時のコールバック */
  onFold?: () => void;
  /** ローディング状態 */
  isLoading?: boolean;
  /** クラス名 */
  className?: string;
}

/**
 * 対応フェーズコンポーネント
 */
export function ResponsePhase({
  myHand,
  opponentHandCount,
  myTurnState,
  opponentSubmission,
  myName = "あなた",
  opponentName = "相手",
  onCall,
  onFold,
  isLoading = false,
  className = "",
}: ResponsePhaseProps) {
  const hasVictoryDeclaration = opponentSubmission?.submission_type === "victory_declaration";

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* 上部: 相手の手札 */}
      <div className="flex justify-center">
        <OpponentHand
          handCount={opponentHandCount}
          opponentName={opponentName}
          deckRemaining={myTurnState.deck_cards_remaining}
        />
      </div>

      {/* 中央: 相手の宣言表示 */}
      {hasVictoryDeclaration && (
        <div className="flex justify-center">
          <div
            className="px-8 py-6 rounded-lg shadow-lg max-w-md animate-pulse"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.9))",
              border: "3px solid rgba(251,191,36,0.8)",
              boxShadow: "0 8px 24px rgba(245,158,11,0.5), inset 0 1px 2px rgba(255,255,255,0.3)",
            }}
          >
            <div className="text-center space-y-3">
              <div className="text-4xl mb-2">👑</div>
              <div
                className="text-xl font-bold text-white"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
              >
                {opponentName}が勝利宣言をしました！
              </div>
              {opponentSubmission && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-100">類似度</span>
                    <span className="font-mono font-bold text-white">
                      {Math.round((opponentSubmission.similarity_score + 1) * 50)}点
                    </span>
                  </div>
                  {opponentSubmission.rarity_bonus > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-100">ボーナス</span>
                      <span className="font-mono font-bold text-yellow-200">
                        +{Math.round(opponentSubmission.rarity_bonus * 50)}点
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-amber-200/30">
                    <span className="text-amber-100">最終スコア</span>
                    <span className="font-mono font-bold text-white">
                      {Math.round((opponentSubmission.final_score + 1) * 50)}点
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 説明テキスト */}
      {hasVictoryDeclaration && (
        <div className="text-center px-4">
          <div
            className="inline-block px-6 py-3 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.1))",
              border: "2px solid rgba(239,68,68,0.6)",
            }}
          >
            <p className="text-sm font-semibold text-gray-800">
              コール: 相手の勝利宣言を受け入れる（勝てば+2点、負ければ-2点）
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              フォールド: 相手の勝利宣言を認める（相手+1点、自分0点）
            </p>
          </div>
        </div>
      )}

      {/* 下部: 自分の手札と対応ボタン */}
      <div className="flex flex-col gap-4">
        {/* 自分の手札 */}
        <div className="flex justify-center">
          <HandArea
            cards={myHand}
            selectedCardIds={[]}
            multiSelect={false}
            showSimilarity={false}
            playerName={myName}
            deckRemaining={myTurnState.deck_cards_remaining}
          />
        </div>

        {/* 対応ボタン */}
        {hasVictoryDeclaration && (
          <div className="flex justify-center gap-4">
            {/* コールボタン */}
            <Button
              onClick={onCall}
              disabled={isLoading}
              size="lg"
              className="flex items-center gap-2 min-w-[180px]"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))",
                border: "2px solid rgba(248,113,113,0.7)",
                color: "white",
                boxShadow: "0 4px 12px rgba(239,68,68,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              <Handshake className="w-5 h-5" />
              <span className="font-bold">コール</span>
            </Button>

            {/* フォールドボタン */}
            <Button
              onClick={onFold}
              disabled={isLoading}
              size="lg"
              className="flex items-center gap-2 min-w-[180px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(156,163,175,0.95), rgba(107,114,128,0.9))",
                border: "2px solid rgba(209,213,219,0.7)",
                color: "white",
                boxShadow:
                  "0 4px 12px rgba(156,163,175,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              <SkipForward className="w-5 h-5" />
              <span className="font-bold">フォールド</span>
            </Button>
          </div>
        )}

        {/* 通常提出の場合のメッセージ */}
        {!hasVictoryDeclaration && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">相手が通常提出をしました。判定を待っています...</p>
          </div>
        )}
      </div>
    </div>
  );
}
