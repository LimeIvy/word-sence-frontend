"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown } from "lucide-react";
import type { Card } from "../../../common/types/card";
import type { TurnState } from "../../types/player";
import { HandArea } from "../HandArea";
import { OpponentHand } from "../OpponentHand";

export interface SubmissionPhaseProps {
  /** 自分の手札 */
  myHand: Card[];
  /** 相手の手札枚数 */
  opponentHandCount: number;
  /** 自分のターン状態 */
  myTurnState: TurnState;
  /** お題カードのテキスト */
  fieldCardText: string;
  /** 選択中のカードID */
  selectedCardId?: string;
  /** カードごとの類似度マップ */
  similarities?: Record<string, number>;
  /** カードごとのレアリティボーナスマップ */
  rarityBonuses?: Record<string, number>;
  /** カードごとのデッキカードフラグマップ */
  isDeckCards?: Record<string, boolean>;
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** カード選択時のコールバック */
  onCardSelect?: (cardId: string) => void;
  /** 通常提出クリック時のコールバック */
  onNormalSubmit?: (cardId: string) => void;
  /** 勝利宣言クリック時のコールバック */
  onVictoryDeclaration?: (cardId: string) => void;
  /** ローディング状態 */
  isLoading?: boolean;
  /** クラス名 */
  className?: string;
}

/**
 * 提出フェーズコンポーネント
 */
export function SubmissionPhase({
  myHand,
  opponentHandCount,
  myTurnState,
  fieldCardText,
  selectedCardId,
  similarities = {},
  rarityBonuses = {},
  isDeckCards = {},
  myName = "あなた",
  opponentName = "相手",
  onCardSelect,
  onNormalSubmit,
  onVictoryDeclaration,
  isLoading = false,
  className = "",
}: SubmissionPhaseProps) {
  const selectedCard = selectedCardId ? myHand.find((c) => c.id === selectedCardId) : undefined;
  const similarity = selectedCardId ? similarities[selectedCardId] : undefined;
  const rarityBonus = selectedCardId ? rarityBonuses[selectedCardId] : undefined;
  const finalScore =
    similarity !== undefined ? Math.min(1.0, similarity + (rarityBonus ?? 0)) : undefined;
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

      {/* 中央: お題カード表示エリア */}
      <div className="flex justify-center">
        <div
          className="px-6 py-4 rounded-lg shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(218,165,32,0.95), rgba(184,134,11,0.9))",
            border: "2px solid rgba(255,215,0,0.7)",
            boxShadow: "0 4px 12px rgba(218,165,32,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <div className="text-center">
            <div
              className="text-sm font-bold mb-2"
              style={{ color: "#FFF5E6", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
            >
              お題カード
            </div>
            <div
              className="text-3xl font-black"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: "0.15em",
                color: "#FFF5E6",
                textShadow: "0 2px 4px rgba(0,0,0,0.7), 0 0 8px rgba(218,165,32,0.4)",
              }}
            >
              {fieldCardText}
            </div>
          </div>
        </div>
      </div>

      {/* 類似度プレビュー */}
      {selectedCard && similarity !== undefined && (
        <div className="flex justify-center">
          <div
            className="px-6 py-4 rounded-lg shadow-md max-w-md"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.1))",
              border: "2px solid rgba(74,222,128,0.7)",
              boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
            }}
          >
            <div className="space-y-2">
              <div className="text-sm font-bold mb-3" style={{ color: "#16A34A" }}>
                スコアプレビュー
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">類似度</span>
                <span className="font-mono font-bold text-lg">
                  {Math.round((similarity + 1) * 50)}点
                </span>
              </div>
              {rarityBonus !== undefined && rarityBonus > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">レアリティボーナス</span>
                    <span className="font-mono font-bold text-lg text-yellow-600">
                      +{Math.round(rarityBonus * 50)}点
                    </span>
                  </div>
                  <div className="h-px bg-gray-300 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">最終スコア</span>
                    <span className="font-mono font-bold text-xl text-green-600">
                      {Math.round(((finalScore ?? 0) + 1) * 50)}点
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 下部: 自分の手札と提出ボタン */}
      <div className="flex flex-col gap-4">
        {/* 自分の手札 */}
        <div className="flex justify-center">
          <HandArea
            cards={myHand}
            selectedCardIds={selectedCardId ? [selectedCardId] : []}
            multiSelect={false}
            onCardSelect={onCardSelect}
            showSimilarity={true}
            playerName={myName}
            deckRemaining={myTurnState.deck_cards_remaining}
            similarities={similarities}
            rarityBonuses={rarityBonuses}
            isDeckCards={isDeckCards}
          />
        </div>

        {/* 提出ボタン */}
        {selectedCard && (
          <div className="flex justify-center gap-4">
            {/* 通常提出ボタン */}
            <Button
              onClick={() => onNormalSubmit?.(selectedCardId!)}
              disabled={isLoading || !selectedCardId}
              size="lg"
              className="flex items-center gap-2 min-w-[180px]"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.9))",
                border: "2px solid rgba(74,222,128,0.7)",
                color: "white",
                boxShadow: "0 4px 12px rgba(34,197,94,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold">通常提出</span>
            </Button>

            {/* 勝利宣言ボタン */}
            <Button
              onClick={() => onVictoryDeclaration?.(selectedCardId!)}
              disabled={isLoading || !selectedCardId}
              size="lg"
              className="flex items-center gap-2 min-w-[180px]"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.9))",
                border: "2px solid rgba(251,191,36,0.7)",
                color: "white",
                boxShadow: "0 4px 12px rgba(245,158,11,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              <Crown className="w-5 h-5" />
              <span className="font-bold">勝利宣言</span>
            </Button>
          </div>
        )}

        {/* 選択されていない場合のメッセージ */}
        {!selectedCard && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">提出するカードを選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
