"use client";

import { useState } from "react";
import type { Card } from "../../common/types/card";
import { mapRarityToJapanese } from "../../common/utils/rarity";

export interface HandCardProps {
  /** カード情報 */
  card: Card;
  /** 選択状態 */
  selected?: boolean;
  /** ホバー時に類似度を表示するか */
  showSimilarity?: boolean;
  /** お題カードとの類似度（0-1） */
  similarity?: number;
  /** デッキカードかどうか */
  isDeckCard?: boolean;
  /** レアリティボーナス */
  rarityBonus?: number;
  /** 無効化されているか */
  disabled?: boolean;
  /** クリック時のコールバック */
  onCardClick?: () => void;
  /** クラス名 */
  className?: string;
}

/**
 * 手札カードコンポーネント（選択可能）
 */
export function HandCard({
  card,
  selected = false,
  showSimilarity = false,
  similarity,
  isDeckCard = true,
  rarityBonus,
  disabled = false,
  onCardClick,
  className = "",
}: HandCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showVertical = true;
  const rarity = mapRarityToJapanese(card.rarity);

  // w-24サイズ用のフォント設定
  const fontSizes = {
    textSize: showVertical ? "13px" : "15px",
    raritySize: "11px",
    letterSpacing: showVertical ? "1.5px" : "2px",
    badgeSize: "w-10 h-10",
  };

  // 共通のテキストシャドウ
  const textShadow = `
    black 1px 1px 0, black -1px -1px 0,
    black -1px 1px 0, black 1px -1px 0,
    black 0px 1px 0, black 0px -1px 0,
    black -1px 0 0, black 1px 0 0
  `;

  // ランクごとに明確に色分け
  const colors = {
    並: {
      primary: "#4A4A4A",
      secondary: "#6B6B6B",
      accent: "#8C8C8C",
      glow: "#A8A8A8",
      name: "凡",
      flowerColor: "#999999",
    },
    良: {
      primary: "#2B5D3F",
      secondary: "#3D8B5B",
      accent: "#52B87A",
      glow: "#70D699",
      name: "良",
      flowerColor: "#7FE0A8",
    },
    優: {
      primary: "#1E5A8E",
      secondary: "#2B7DC4",
      accent: "#3FA0F0",
      glow: "#5CC4FF",
      name: "優",
      flowerColor: "#7DD4FF",
    },
    傑: {
      primary: "#6B2D8E",
      secondary: "#8E3FB8",
      accent: "#B055E0",
      glow: "#D070FF",
      name: "傑",
      flowerColor: "#E090FF",
    },
    極: {
      primary: "#B8860B",
      secondary: "#DAA520",
      accent: "#FFD700",
      glow: "#FFED4E",
      name: "極",
      flowerColor: "#FFF59D",
    },
  }[rarity];

  // 最終スコアの計算
  const finalScore =
    similarity !== undefined && rarityBonus !== undefined
      ? Math.min(1.0, similarity + rarityBonus)
      : similarity;

  return (
    <div
      className={`
        relative w-24 aspect-3/4 select-none
        transition-all duration-300 ease-out
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${selected ? "scale-110 -translate-y-4 z-10" : "hover:scale-105 hover:-translate-y-2"}
        ${className}
      `}
      style={{
        filter: selected
          ? `drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 8px ${colors.glow})`
          : "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
      }}
      onClick={!disabled ? onCardClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 外枠 */}
      <div
        className="w-full h-full relative"
        style={{
          background: "linear-gradient(135deg, #1A1410 0%, #0D0A08 100%)",
          padding: selected ? "2px" : "1px",
          boxShadow: selected ? `0 0 4px ${colors.glow}` : "none",
        }}
      >
        {/* メインカード部分 */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
            borderRadius: "4px",
            border: `2px solid #1A0F0A`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)`,
          }}
        >
          {/* 選択インジケーター */}
          {selected && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${colors.glow}20, transparent 70%)`,
              }}
            />
          )}

          {/* ベージュ系和紙テクスチャ */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,245,230,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,245,230,0.2) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255,245,230,0.15) 0%, transparent 50%)
              `,
              backgroundSize: "150px 150px, 200px 200px, 100px 100px",
            }}
          />

          {/* 水流模様 */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15"
            style={{ mixBlendMode: "overlay" }}
          >
            <defs>
              <pattern
                id={`wave-${rarity}-hand-${card.id}`}
                x="0"
                y="0"
                width="60"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 15 Q10 10, 20 15 T40 15 T60 15"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <path
                  d="M0 20 Q10 15, 20 20 T40 20 T60 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.8"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#wave-${rarity}-hand-${card.id})`} />
          </svg>

          {/* 桜吹雪 */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${10 + i * 15}%`,
                  top: `${15 + (i % 3) * 25}%`,
                  width: "8px",
                  height: "8px",
                  background: `radial-gradient(circle at 30% 30%, ${colors.flowerColor} 0%, transparent 70%)`,
                  borderRadius: "50% 0 50% 0",
                  transform: `rotate(${i * 45}deg)`,
                  opacity: 0.5,
                  animation: `sakura-fall ${3 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* 金箔 */}
          {(rarity === "極" || rarity === "傑") && (
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 15% 20%, ${colors.glow}50 0%, transparent 2%),
                  radial-gradient(circle at 85% 30%, ${colors.glow}40 0%, transparent 1.5%),
                  radial-gradient(circle at 30% 75%, ${colors.glow}45 0%, transparent 2%)
                `,
                animation: rarity === "極" ? "sparkle 3s ease-in-out infinite" : "none",
              }}
            />
          )}

          {/* 上部装飾 */}
          <div
            className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)`,
            }}
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "2px",
                    height: "2px",
                    background: colors.flowerColor,
                    borderRadius: "50%",
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          {/* デッキカードアイコン */}
          {isDeckCard && (
            <div
              className="absolute top-1 left-1 text-xl"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
              }}
            >
              <span className="select-none">🎴</span>
            </div>
          )}

          {/* レアリティ印章 */}
          <div
            aria-label={`レアリティ: ${rarity}`}
            className={`absolute top-1 right-1 flex items-center justify-center font-black ${fontSizes.badgeSize}`}
            style={{
              position: "relative",
            }}
          >
            {/* 梅の花 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                  radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                  radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                  radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                  radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%)
                `,
                backgroundPosition: "50% 0%, 5% 40%, 95% 40%, 23% 95%, 78% 95%",
                backgroundSize: "60% 60%",
                backgroundRepeat: "no-repeat",
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6)) ${rarity === "極" ? `drop-shadow(0 0 10px ${colors.glow})` : ""}`,
                animation: rarity === "極" ? "ume-pulse 2s ease-in-out infinite" : "none",
              }}
            />

            {/* 中央の文字 */}
            <div
              className="absolute inset-0 flex items-center justify-center text-white font-black z-10"
              style={{
                textShadow,
                fontSize: fontSizes.raritySize,
              }}
            >
              {colors.name}
            </div>
          </div>

          {/* メイン文字 */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-black leading-none text-white p-1 text-center break-words"
            style={{
              fontSize: fontSizes.textSize,
              letterSpacing: fontSizes.letterSpacing,
              writingMode: showVertical ? "vertical-rl" : "horizontal-tb",
              textOrientation: showVertical ? "upright" : "mixed",
              textShadow,
              fontWeight: "700",
            }}
          >
            {card.name}
          </div>

          {/* 類似度表示 */}
          {showSimilarity && similarity !== undefined && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-black/85 backdrop-blur-sm p-1.5 text-white text-[10px] space-y-0.5 z-20"
              style={{
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? "visible" : "hidden",
                pointerEvents: isHovered ? "auto" : "none",
                transition: isHovered
                  ? "opacity 0.3s ease-in-out, visibility 0s"
                  : "opacity 0.3s ease-in-out, visibility 0s linear 0.3s",
              }}
            >
              <div className="flex justify-between">
                <span className="text-gray-400">類似度</span>
                <span className="font-mono font-bold">{Math.round((similarity + 1) * 50)}点</span>
              </div>

              {rarityBonus !== undefined && rarityBonus > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ボーナス</span>
                    <span className="font-mono font-bold text-yellow-400">
                      +{Math.round(rarityBonus * 50)}点
                    </span>
                  </div>
                  <div className="h-px bg-gray-600 my-0.5" />
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-semibold">最終</span>
                    <span className="font-mono font-bold text-green-400">
                      {Math.round(((finalScore ?? 0) + 1) * 50)}点
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 下部装飾 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)`,
            }}
          >
            <svg className="w-full h-full opacity-40">
              <path
                d="M0 12 Q10 8, 20 12 T40 12 T60 12 T80 12 T100 12"
                stroke={colors.flowerColor}
                strokeWidth="1"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 選択チェックマーク */}
      {selected && (
        <div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg z-20"
          style={{
            background: `linear-gradient(135deg, ${colors.glow}, ${colors.accent})`,
            border: `2px solid white`,
          }}
        >
          <span className="text-sm font-bold">✓</span>
        </div>
      )}

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes ume-pulse {
          0%, 100% {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 0 10px ${colors.glow});
          }
          50% {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 0 20px ${colors.glow}) drop-shadow(0 0 30px ${colors.glow}80);
          }
        }
        @keyframes sakura-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateY(8px) rotate(180deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
