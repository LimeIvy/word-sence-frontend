"use client";

import type { BattlePhase } from "../types/phase";
import { PHASE_DISPLAY_NAMES } from "../types/phase";

export interface PhaseIndicatorProps {
  /** 現在のフェーズ */
  currentPhase: BattlePhase;
  /** クラス名 */
  className?: string;
}

/**
 * フェーズ表示コンポーネント
 */
export function PhaseIndicator({ currentPhase, className = "" }: PhaseIndicatorProps) {
  const displayName = PHASE_DISPLAY_NAMES[currentPhase];

  // フェーズごとの色とアイコン
  const phaseConfig = {
    field_card_presentation: {
      color: "rgba(218,165,32,0.95)",
      borderColor: "rgba(255,215,0,0.7)",
      icon: "👑",
      bg: "linear-gradient(135deg, rgba(218,165,32,0.15), rgba(184,134,11,0.1))",
    },
    player_action: {
      color: "rgba(59,130,246,0.95)",
      borderColor: "rgba(96,165,250,0.7)",
      icon: "⚡",
      bg: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))",
    },
    word_submission: {
      color: "rgba(34,197,94,0.95)",
      borderColor: "rgba(74,222,128,0.7)",
      icon: "📝",
      bg: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.1))",
    },
    response: {
      color: "rgba(168,85,247,0.95)",
      borderColor: "rgba(192,132,252,0.7)",
      icon: "🤔",
      bg: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(147,51,234,0.1))",
    },
    point_calculation: {
      color: "rgba(245,158,11,0.95)",
      borderColor: "rgba(251,191,36,0.7)",
      icon: "✨",
      bg: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))",
    },
  };

  const config = phaseConfig[currentPhase];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* アイコン */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
        style={{
          background: config.color,
          border: `2px solid ${config.borderColor}`,
          boxShadow: `0 4px 12px ${config.color}40, inset 0 1px 2px rgba(255,255,255,0.3)`,
        }}
      >
        <span>{config.icon}</span>
      </div>

      {/* フェーズ名 */}
      <div
        className="px-5 py-2.5 rounded-lg shadow-md"
        style={{
          background: config.bg,
          border: `2px solid ${config.borderColor}`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.2)`,
        }}
      >
        <span
          className="font-bold text-base tracking-wider"
          style={{
            color: config.color.replace("0.95", "1"),
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          {displayName}
        </span>
      </div>

      {/* 装飾的な点 */}
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: config.color,
              opacity: 0.6,
              animation: `pulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
