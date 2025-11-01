import { useId } from "react";
export interface TimerProps {
  /** 残り時間（秒） */
  remainingTime: number;
  /** 最大時間（秒） */
  maxTime: number;
  /** タイマーのサイズ */
  size?: "small" | "medium" | "large";
  /** 警告しきい値（秒）- この値以下で警告色になる */
  warningThreshold?: number;
  /** 危険しきい値（秒）- この値以下で危険色になる */
  dangerThreshold?: number;
  className?: string;
}

const SIZE_CLASSES = {
  small: {
    circle: "w-32 h-32",
    text: "text-xl",
    stroke: "6",
  },
  medium: {
    circle: "w-48 h-48",
    text: "text-2xl",
    stroke: "8",
  },
  large: {
    circle: "w-64 h-64",
    text: "text-4xl",
    stroke: "10",
  },
};

export const Timer = ({
  remainingTime,
  maxTime,
  size = "medium",
  warningThreshold = 20,
  dangerThreshold = 10,
  className = "",
}: TimerProps) => {
  const sizeClasses = SIZE_CLASSES[size];
  const uniqueId = useId();
  // 進捗率（0-100）
  const progress = (remainingTime / maxTime) * 100;

  // 時間を分:秒形式に変換
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timeDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // 円形プログレスバー用の計算
  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // タイマーの状態に応じた色（紅葉風のグラデーション）
  const getTimerColor = () => {
    if (remainingTime <= dangerThreshold) {
      return {
        gradientStart: "#C84A3A", // 濃い赤茶色
        gradientEnd: "#D2691E", // オレンジがかった茶色
        textColor: "#8B3A2A", // 落ち着いた赤茶色
        pulse: "animate-pulse",
      };
    }
    if (remainingTime <= warningThreshold) {
      return {
        gradientStart: "#CD853F", // オレンジがかった茶色
        gradientEnd: "#D2691E", // オレンジがかった茶色
        textColor: "#8B4513", // サドルブラウン
        pulse: "",
      };
    }
    return {
      gradientStart: "#B8860B", // 濃いゴールド
      gradientEnd: "#CD853F", // オレンジがかった茶色
      textColor: "#8B4513", // サドルブラウン
      pulse: "",
    };
  };

  const colors = getTimerColor();

  // ユニークなIDを生成
  const gradientId = `timer-gradient-${uniqueId}`;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 桜の花びら装飾 */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 z-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${i * 8}px`,
              top: `${(i % 2) * 6 - 3}px`,
              width: "12px",
              height: "12px",
              background: `radial-gradient(circle at 30% 30%, rgba(255,182,193,0.6) 0%, rgba(255,192,203,0.3) 50%, transparent 70%)`,
              borderRadius: "50% 0 50% 0",
              transform: `rotate(${i * 45}deg)`,
              opacity: 0.6,
              animation: `sakura-float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* 円形タイマー */}
      <div className="relative">
        {/* 背景円（クリーム色） */}
        <div
          className={`${sizeClasses.circle} rounded-full flex items-center justify-center`}
          style={{
            background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%)",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(139,69,19,0.1)",
          }}
        >
          {/* SVGプログレスバー */}
          <svg
            className="absolute inset-0 transform -rotate-90"
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.gradientStart} />
                <stop offset="100%" stopColor={colors.gradientEnd} />
              </linearGradient>
            </defs>
            {/* 背景円（薄いグレー） */}
            <circle
              cx="50"
              cy="50"
              r={circleRadius}
              stroke="rgba(139,69,19,0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* プログレス円 */}
            <circle
              cx="50"
              cy="50"
              r={circleRadius}
              stroke={`url(#${gradientId})`}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s linear",
                filter: "drop-shadow(0 2px 4px rgba(139,69,19,0.3))",
              }}
            />
          </svg>

          {/* 中央の時間表示 */}
          <div
            className={`absolute inset-0 flex items-center justify-center flex-col ${colors.pulse}`}
          >
            <div
              className="font-mono font-bold select-none"
              style={{
                fontSize: size === "large" ? "2.5rem" : size === "medium" ? "2rem" : "1.5rem",
                color: colors.textColor,
                textShadow: "0 1px 2px rgba(139,69,19,0.2)",
                letterSpacing: "0.05em",
              }}
            >
              {timeDisplay}
            </div>
          </div>
        </div>
      </div>

      {/* アニメーション用のCSS */}
      <style>{`
          @keyframes sakura-float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-8px) rotate(180deg);
              opacity: 0.8;
            }
          }
        `}</style>
    </div>
  );
};
