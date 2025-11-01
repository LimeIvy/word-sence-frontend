"use client";

import type { TurnState } from "../types/player";

export interface DeckStatusProps {
  /** ターン状態 */
  turnState: TurnState;
  /** クラス名 */
  className?: string;
}

/**
 * デッキ残り枚数表示コンポーネント
 */
export function DeckStatus({ turnState, className = "" }: DeckStatusProps) {
  const { deck_cards_remaining } = turnState;
  const isLow = deck_cards_remaining <= 5;
  const isCritical = deck_cards_remaining === 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* アイコン */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-all ${
          isCritical ? "animate-pulse" : ""
        }`}
        style={{
          background: isCritical
            ? "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))"
            : isLow
              ? "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.9))"
              : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
          boxShadow: isCritical
            ? "0 0 12px rgba(239,68,68,0.6)"
            : isLow
              ? "0 0 8px rgba(245,158,11,0.5)"
              : "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <span className="select-none">🎴</span>
      </div>

      {/* デッキ枚数表示 */}
      <div
        className={`px-4 py-2.5 rounded-lg font-bold transition-all ${
          isCritical ? "animate-pulse" : ""
        }`}
        style={{
          background: isCritical
            ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.1))"
            : isLow
              ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))"
              : "linear-gradient(135deg, rgba(139,69,19,0.15), rgba(101,67,33,0.1))",
          border: `2px solid ${
            isCritical
              ? "rgba(239,68,68,0.6)"
              : isLow
                ? "rgba(245,158,11,0.6)"
                : "rgba(218,165,32,0.6)"
          }`,
          color: isCritical ? "#DC2626" : isLow ? "#D97706" : "#8B4513",
          boxShadow: isCritical
            ? "0 0 8px rgba(239,68,68,0.4)"
            : isLow
              ? "0 0 4px rgba(245,158,11,0.3)"
              : "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-2xl">{deck_cards_remaining}</span>
          <span className="text-sm opacity-80">枚</span>
        </div>
        <div className="text-xs mt-0.5 opacity-70">デッキ残り</div>
      </div>

      {/* 警告メッセージ */}
      {isCritical && (
        <div
          className="px-3 py-1 rounded-full text-xs font-bold animate-pulse"
          style={{
            background: "rgba(239,68,68,0.9)",
            color: "white",
            boxShadow: "0 0 8px rgba(239,68,68,0.6)",
          }}
        >
          デッキ枯渇
        </div>
      )}
      {isLow && !isCritical && (
        <div
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: "rgba(245,158,11,0.9)",
            color: "white",
            boxShadow: "0 0 6px rgba(245,158,11,0.5)",
          }}
        >
          残りわずか
        </div>
      )}
    </div>
  );
}
