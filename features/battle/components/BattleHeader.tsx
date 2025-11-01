"use client";

import type { BattlePhase } from "../types/phase";
import { PhaseIndicator } from "./PhaseIndicator";
import { Timer } from "./Timer";

export interface BattleHeaderProps {
  /** 現在のフェーズ */
  currentPhase: BattlePhase;
  /** 残り時間（秒） */
  timeRemaining: number;
  /** 自分のスコア */
  myScore: number;
  /** 相手のスコア */
  opponentScore: number;
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** 現在のラウンド数 */
  currentRound?: number;
  /** タイムアウト時のコールバック */
  onTimeout?: () => void;
  /** クラス名 */
  className?: string;
}

/**
 * バトルヘッダーコンポーネント（スコア表示、タイマー）
 */
export function BattleHeader({
  currentPhase,
  timeRemaining,
  myScore,
  opponentScore,
  myName = "あなた",
  opponentName = "相手",
  currentRound,
  onTimeout,
  className = "",
}: BattleHeaderProps) {
  return (
    <header
      className={`w-full px-4 py-4 bg-gradient-to-b from-amber-50/80 to-amber-100/60 border-b-2 border-amber-200 shadow-md ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(252,211,77,0.85) 100%)",
        borderBottom: "3px solid rgba(218,165,32,0.6)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* 上部: ラウンド情報とフェーズ */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* ラウンド表示 */}
          {currentRound !== undefined && (
            <div
              className="px-4 py-2 rounded-lg shadow-md"
              style={{
                background: "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                border: "2px solid rgba(218,165,32,0.7)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
              }}
            >
              <span
                className="font-bold text-base tracking-wider"
                style={{
                  color: "#FFF5E6",
                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                ラウンド {currentRound}
              </span>
            </div>
          )}

          {/* フェーズ表示 */}
          <PhaseIndicator currentPhase={currentPhase} />

          {/* タイマー */}
          <Timer timeRemaining={timeRemaining} onTimeout={onTimeout} />
        </div>

        {/* 下部: スコア表示 */}
        <div className="flex items-center justify-between gap-4">
          {/* 自分のスコア */}
          <div className="flex items-center gap-3 flex-1">
            <div
              className="px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 flex-1 max-w-md"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.9))",
                border: "2px solid rgba(96,165,250,0.7)",
                boxShadow: "0 4px 12px rgba(59,130,246,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-blue-100/90 mb-0.5 truncate">{myName}</div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-bold text-white"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    {myScore}
                  </span>
                  <span className="text-sm text-blue-100/90">/ 3</span>
                </div>
              </div>
            </div>
          </div>

          {/* VS表示 */}
          <div className="px-3 py-2">
            <span className="text-2xl font-bold" style={{ color: "rgba(139,69,19,0.8)" }}>
              VS
            </span>
          </div>

          {/* 相手のスコア */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div
              className="px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 flex-1 max-w-md justify-end"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))",
                border: "2px solid rgba(248,113,113,0.7)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              <div className="flex-1 min-w-0 text-right">
                <div className="text-xs text-red-100/90 mb-0.5 truncate">{opponentName}</div>
                <div className="flex items-baseline gap-2 justify-end">
                  <span
                    className="text-3xl font-bold text-white"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    {opponentScore}
                  </span>
                  <span className="text-sm text-red-100/90">/ 3</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
