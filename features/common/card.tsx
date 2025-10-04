import type { HTMLAttributes, ReactNode } from "react";

export type CardRarity = "並" | "良" | "優" | "傑" | "極";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  rarity?: CardRarity;
}

export const Card = ({ children, className = "", rarity = "並", ...props }: CardProps) => {
  const showVertical = true;

  // カードサイズに応じたフォントサイズを計算
  const getFontSizes = (className: string) => {
    // w-20 (80px) の場合
    if (className.includes("w-20")) {
      return {
        textSize: showVertical ? "10px" : "12px",
        raritySize: "11px",
        letterSpacing: showVertical ? "1px" : "1.5px",
      };
    }
    // w-24 (96px) の場合
    if (className.includes("w-24")) {
      return {
        textSize: showVertical ? "13px" : "15px",
        raritySize: "13px",
        letterSpacing: showVertical ? "1.5px" : "2px",
      };
    }
    // w-30 (120px) の場合
    if (className.includes("w-30")) {
      return {
        textSize: showVertical ? "15px" : "17px",
        raritySize: "15px",
        letterSpacing: showVertical ? "1.2px" : "1.8px",
      };
    }
    // w-36 (144px) の場合
    if (className.includes("w-36")) {
      return {
        textSize: showVertical ? "18px" : "20px",
        raritySize: "18px",
        letterSpacing: showVertical ? "1.5px" : "2px",
      };
    }
    // デフォルト（大きめ）
    return {
      textSize: showVertical ? "22px" : "24px",
      raritySize: "15px",
      letterSpacing: showVertical ? "2px" : "3px",
    };
  };

  const fontSizes = getFontSizes(className);

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

  return (
    <div
      className={`relative overflow-hidden select-none cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 transform-gpu ${className}`}
      style={{
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = `drop-shadow(0 20px 50px rgba(0,0,0,0.7)) drop-shadow(0 0 40px ${colors.glow}80)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "drop-shadow(0 10px 30px rgba(0,0,0,0.5))";
      }}
      {...props}
    >
      {/* 外枠 - 細い黒縁 */}
      <div
        className="w-full h-full relative"
        style={{
          background: "linear-gradient(135deg, #1A1410 0%, #0D0A08 100%)",
          padding: "1px",
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

          {/* 水流模様（ロゴの波紋に合わせて） */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15"
            style={{ mixBlendMode: "overlay" }}
          >
            <defs>
              <pattern
                id={`wave-${rarity}`}
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
                <path
                  d="M0 10 Q10 5, 20 10 T40 10 T60 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.6"
                  opacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#wave-${rarity})`} />
          </svg>

          {/* 桜吹雪（ロゴの桜に合わせて） */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${10 + i * 12}%`,
                  top: `${15 + (i % 3) * 25}%`,
                  width: "10px",
                  height: "10px",
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

          {/* 金箔・光の粒子エフェクト */}
          {(rarity === "極" || rarity === "傑") && (
            <div
              className="absolute inset-0"
              style={{
                background: `
                radial-gradient(circle at 15% 20%, ${colors.glow}50 0%, transparent 2%),
                radial-gradient(circle at 85% 30%, ${colors.glow}40 0%, transparent 1.5%),
                radial-gradient(circle at 30% 75%, ${colors.glow}45 0%, transparent 2%),
                radial-gradient(circle at 70% 80%, ${colors.glow}35 0%, transparent 1.5%),
                radial-gradient(circle at 50% 50%, ${colors.glow}40 0%, transparent 2%)
              `,
                animation: rarity === "極" ? "sparkle 3s ease-in-out infinite" : "none",
              }}
            />
          )}

          {/* 上部装飾帯 */}
          <div
            className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)`,
            }}
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "3px",
                    height: "3px",
                    background: colors.flowerColor,
                    borderRadius: "50%",
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          {/* レアリティ印章 - 梅の花 */}
          <div
            aria-label={`レアリティ: ${rarity}`}
            className="absolute top-1 right-1 flex items-center justify-center font-black"
            style={{
              width:
                fontSizes.raritySize === "11px"
                  ? "32px"
                  : fontSizes.raritySize === "13px"
                    ? "40px"
                    : fontSizes.raritySize === "15px"
                      ? "48px"
                      : "56px",
              height:
                fontSizes.raritySize === "11px"
                  ? "32px"
                  : fontSizes.raritySize === "13px"
                    ? "40px"
                    : fontSizes.raritySize === "15px"
                      ? "48px"
                      : "56px",
              position: "relative",
            }}
          >
            {/* 梅の花パターン */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%),
                radial-gradient(circle, ${colors.flowerColor} 25%, transparent 26%)
              `,
                backgroundPosition: "50% 0%, 5% 40%, 95% 40%, 23% 95%, 78% 95%",
                backgroundSize:
                  fontSizes.raritySize === "11px"
                    ? "20px 20px"
                    : fontSizes.raritySize === "13px"
                      ? "24px 24px"
                      : fontSizes.raritySize === "15px"
                        ? "28px 28px"
                        : "32px 32px",
                backgroundRepeat: "no-repeat",
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6)) ${rarity === "極" ? `drop-shadow(0 0 10px ${colors.glow})` : ""}`,
                animation: rarity === "極" ? "ume-pulse 2s ease-in-out infinite" : "none",
              }}
            />

            {/* 中央の文字 - 見やすく */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSizes.raritySize,
                color: "#FFFFFF",
                textShadow: `
                -1px -1px 0 #000,
                1px -1px 0 #000,
                -1px 1px 0 #000,
                1px 1px 0 #000,
                0 2px 4px rgba(0,0,0,0.9),
                0 0 8px rgba(0,0,0,0.8)
              `,
                fontWeight: "900",
                WebkitTextStroke: "0.1px #000",
                zIndex: 1,
              }}
            >
              {colors.name}
            </div>
          </div>

          {/* メイン文字 - シンプルに */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-black leading-none"
            style={{
              fontSize: fontSizes.textSize,
              letterSpacing: fontSizes.letterSpacing,
              writingMode: showVertical ? "vertical-rl" : "horizontal-tb",
              textOrientation: showVertical ? "upright" : "mixed",
              color: "#FFFFFF",
              textShadow: `
                -2px -2px 0 #000,
                2px -2px 0 #000,
                -2px 2px 0 #000,
                2px 2px 0 #000,
                0 3px 6px rgba(0,0,0,0.8)
              `,
              fontWeight: "900",
            }}
          >
            {children}
          </div>

          {/* 下部装飾 - 波模様 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)`,
            }}
          >
            <svg className="w-full h-full opacity-40">
              <path
                d="M0 16 Q15 10, 30 16 T60 16 T90 16 T120 16 T150 16 T180 16 T210 16 T240 16 T270 16 T300 16"
                stroke={colors.flowerColor}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

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
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          100% { 
            transform: translateY(10px) rotate(180deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};
