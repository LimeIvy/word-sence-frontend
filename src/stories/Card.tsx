import type { HTMLAttributes, ReactNode } from "react";

export type CardRarity = "並" | "良" | "優" | "傑" | "極";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  rarity?: CardRarity;
}

export const Card = ({ children, className = "", rarity = "並", ...props }: CardProps) => {
  const showVertical = true;

  const colors = {
    並: { primary: "#8B4513", secondary: "#A0522D", accent: "#DEB887" },
    良: { primary: "#228B22", secondary: "#32CD32", accent: "#90EE90" },
    優: { primary: "#1E90FF", secondary: "#4169E1", accent: "#87CEEB" },
    傑: { primary: "#8A2BE2", secondary: "#9370DB", accent: "#DDA0DD" },
    極: { primary: "#B8860B", secondary: "#DAA520", accent: "#F0E68C" },
  }[rarity];

  return (
    <div
      className={`relative overflow-hidden select-none rounded-[12px] cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:rotate-x-1 transform-gpu shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${className}`}
      {...props}
    >
      <div
        className="w-full h-full rounded-[12px] relative overflow-hidden border-[2px]"
        style={{
          borderColor: "#2F1B14",
          background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.secondary} 40%, ${colors.primary} 100%)`,
        }}
      >
        {/* 和風パターン背景 */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(255,255,255,0.08) 1px, transparent 1px),
              radial-gradient(circle at 75% 15%, rgba(255,255,255,0.06) 1px, transparent 1px),
              radial-gradient(circle at 35% 70%, rgba(255,255,255,0.07) 1px, transparent 1px),
              radial-gradient(circle at 85% 80%, rgba(255,255,255,0.05) 1px, transparent 1px),
              radial-gradient(circle at 55% 45%, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "25px 25px, 30px 30px, 35px 35px, 20px 20px, 40px 40px",
          }}
        />

        {/* レアリティバッジ */}
        <div
          aria-label={`レアリティ: ${rarity}`}
          className="absolute top-1 right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black border-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_3px_rgba(255,255,255,0.2)]"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))",
            color: colors.accent,
            borderColor: colors.primary,
            textShadow: `0 0 10px ${colors.primary}`,
            ...(rarity === "極" && {
              animation: "ultimate-glow 2s ease-in-out infinite alternate",
            }),
            ...(rarity === "傑" && {
              boxShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 15px ${colors.primary}, inset 0 1px 3px rgba(255,255,255,0.2)`,
            }),
            ...(rarity === "優" && {
              boxShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 10px ${colors.primary}, inset 0 1px 3px rgba(255,255,255,0.2)`,
            }),
          }}
        >
          {rarity}
        </div>

        {/* 文字表示 */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold text-white leading-tight"
          style={{
            fontSize: showVertical ? "18px" : "20px",
            letterSpacing: showVertical ? "1px" : "2px",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            ...(showVertical &&
              ({ writingMode: "vertical-rl", textOrientation: "upright" } as React.CSSProperties)),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
