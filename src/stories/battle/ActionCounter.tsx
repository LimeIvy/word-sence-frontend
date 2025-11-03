import React from "react";

export interface ActionCounterProps {
  /** 残り行動回数 */
  actionsRemaining: number;
  /** 最大行動回数 */
  maxActions?: number;
  /** サイズ */
  size?: "small" | "medium" | "large";
  /** 警告しきい値（この値以下で警告色） */
  warningThreshold?: number;
  className?: string;
}

const SIZE_CLASSES = {
  small: {
    container: "gap-2",
    star: "text-xl",
    text: "text-sm",
  },
  medium: {
    container: "gap-3",
    star: "text-2xl",
    text: "text-base",
  },
  large: {
    container: "gap-4",
    star: "text-3xl",
    text: "text-lg",
  },
};

export const ActionCounter = React.memo(
  ({
    actionsRemaining,
    maxActions = 3,
    size = "medium",
    warningThreshold = 1,
    className = "",
  }: ActionCounterProps) => {
    const sizeClasses = SIZE_CLASSES[size];

    return (
      <div className={`inline-flex items-center ${className}`}>
        {/* 和風コンパクト表示 */}
        <div
          className={`flex items-center ${sizeClasses.container} px-4 py-2 rounded-full transition-all duration-300`}
          style={{
            background:
              actionsRemaining === 0
                ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                : actionsRemaining <= warningThreshold
                  ? "linear-gradient(135deg, rgba(139,69,19,0.9), rgba(101,67,33,0.85))"
                  : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
            border:
              actionsRemaining === 0
                ? "2px solid rgba(100,100,100,0.6)"
                : actionsRemaining <= warningThreshold
                  ? "2px solid rgba(251,146,60,0.6)"
                  : "2px solid rgba(218,165,32,0.6)",
            boxShadow:
              actionsRemaining === 0
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : actionsRemaining <= warningThreshold
                  ? "0 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(251,146,60,0.3), inset 0 1px 2px rgba(255,245,230,0.2)"
                  : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
          }}
        >
          {/* ラベル */}
          <span
            className={`${sizeClasses.text} font-semibold select-none`}
            style={{
              color: actionsRemaining === 0 ? "rgba(200,200,200,0.9)" : "rgba(255,245,230,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            残り行動
          </span>

          {/* 星アイコン */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxActions }).map((_, index) => (
              <div
                key={index}
                className={`${sizeClasses.star} transition-all duration-300 ${
                  index < actionsRemaining && actionsRemaining > warningThreshold
                    ? "animate-pulse-subtle"
                    : ""
                }`}
                style={{
                  filter:
                    index < actionsRemaining ? "drop-shadow(0 0 4px rgba(218,165,32,0.8))" : "none",
                }}
              >
                {index < actionsRemaining ? "⭐" : "☆"}
              </div>
            ))}
          </div>

          {/* 数値表示 */}
          <span
            className={`${sizeClasses.text} font-black select-none`}
            style={{
              color: actionsRemaining === 0 ? "rgba(200,200,200,0.9)" : "rgba(255,245,230,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {actionsRemaining}
          </span>
        </div>

        {/* カスタムアニメーション */}
        <style>{`
        @keyframes pulse-subtle {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
      </div>
    );
  }
);

ActionCounter.displayName = "ActionCounter";
