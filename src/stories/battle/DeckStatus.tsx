export interface DeckStatusProps {
  /** デッキ残り枚数 */
  remaining: number;
  /** デッキ総枚数 (現在は未使用) */
  total?: number;
  /** サイズ */
  size?: "small" | "medium" | "large";
  /** 警告しきい値（この値以下で警告色） */
  warningThreshold?: number;
  /** 危険しきい値（この値以下で危険色） */
  dangerThreshold?: number;
  className?: string;
}

const SIZE_CLASSES = {
  small: {
    icon: "text-xl",
    text: "text-sm",
    container: "px-3 py-1.5",
  },
  medium: {
    icon: "text-2xl",
    text: "text-base",
    container: "px-4 py-2",
  },
  large: {
    icon: "text-3xl",
    text: "text-lg",
    container: "px-5 py-3",
  },
};

export const DeckStatus = ({
  remaining,
  size = "medium",
  warningThreshold = 5,
  dangerThreshold = 2,
  className = "",
}: DeckStatusProps) => {
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={`inline-flex ${className}`}>
      {/* メイン表示 - 和風デザイン */}
      <div
        className={`
          flex items-center gap-2
          ${sizeClasses.container}
          rounded-full
        `}
        style={{
          background:
            remaining === 0
              ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
              : remaining <= dangerThreshold
                ? "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))"
                : remaining <= warningThreshold
                  ? "linear-gradient(135deg, rgba(139,69,19,0.9), rgba(101,67,33,0.85))"
                  : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
          border:
            remaining === 0
              ? "2px solid rgba(100,100,100,0.6)"
              : remaining <= dangerThreshold
                ? "2px solid rgba(220,38,38,0.6)"
                : remaining <= warningThreshold
                  ? "2px solid rgba(251,146,60,0.6)"
                  : "2px solid rgba(218,165,32,0.6)",
          boxShadow:
            remaining === 0
              ? "0 2px 8px rgba(0,0,0,0.3)"
              : remaining <= dangerThreshold
                ? "0 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(220,38,38,0.3), inset 0 1px 2px rgba(255,245,230,0.2)"
                : remaining <= warningThreshold
                  ? "0 2px 8px rgba(0,0,0,0.3), 0 0 10px rgba(251,146,60,0.2), inset 0 1px 2px rgba(255,245,230,0.2)"
                  : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
        }}
      >
        {/* アイコン */}
        <span className={`${sizeClasses.icon}`}>🎴</span>

        {/* テキスト情報 */}
        <div className="flex items-baseline gap-1">
          <span
            className={`${sizeClasses.text} font-medium`}
            style={{
              color:
                remaining === 0
                  ? "rgba(200,200,200,0.9)"
                  : remaining <= dangerThreshold
                    ? "rgba(255,200,200,0.95)"
                    : "rgba(255,245,230,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            残り
          </span>
          <span
            className={`${sizeClasses.text} font-black`}
            style={{
              color:
                remaining === 0
                  ? "rgba(200,200,200,0.9)"
                  : remaining <= dangerThreshold
                    ? "rgba(255,230,230,0.95)"
                    : "rgba(255,245,230,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {remaining}
          </span>
          <span
            className={`${sizeClasses.text} font-medium`}
            style={{
              color:
                remaining === 0
                  ? "rgba(200,200,200,0.9)"
                  : remaining <= dangerThreshold
                    ? "rgba(255,200,200,0.95)"
                    : "rgba(255,245,230,0.95)",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            枚
          </span>
        </div>

        {/* 警告インジケーター */}
        {remaining > 0 && remaining <= dangerThreshold && (
          <span className="text-sm animate-pulse">⚠️</span>
        )}
      </div>
    </div>
  );
};
