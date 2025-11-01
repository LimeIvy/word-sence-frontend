"use client";

export interface FieldCardProps {
  /** お題の単語 */
  word: string;
  /** アニメーション表示するか */
  animated?: boolean;
  /** サイズ */
  size?: "small" | "medium" | "large";
  /** クラス名 */
  className?: string;
}

const SIZE_CLASSES = {
  small: {
    container: "w-32 h-44",
    text: "text-2xl",
  },
  medium: {
    container: "w-40 h-56",
    text: "text-3xl",
  },
  large: {
    container: "w-48 h-64",
    text: "text-4xl",
  },
};

/**
 * お題カード表示コンポーネント
 */
export function FieldCard({
  word,
  animated = true,
  size = "medium",
  className = "",
}: FieldCardProps) {
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* ラベル - 和風 */}
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(218,165,32,0.95), rgba(184,134,11,0.9))",
            border: "2px solid rgba(255,215,0,0.7)",
            boxShadow: "0 4px 12px rgba(218,165,32,0.5), inset 0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          <span
            className="font-bold text-base tracking-wider"
            style={{
              color: "#FFF5E6",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            お題カード
          </span>
          <span className="text-2xl">🎴</span>
        </div>
      </div>

      {/* カード本体 */}
      <div className={`relative flex justify-center ${animated ? "animate-bounce-in" : ""}`}>
        {/* グローエフェクト */}
        <div
          className={`absolute ${sizeClasses.container} rounded-2xl z-0`}
          style={{
            background: "radial-gradient(circle, rgba(218,165,32,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
            opacity: 0.6,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* カード - 和風花札デザイン */}
        <div
          className={`
            relative ${sizeClasses.container}
            rounded-2xl
            flex items-center justify-center
            transform transition-all duration-300
            z-10
            ${animated ? "hover:scale-105 hover:rotate-1" : ""}
          `}
          style={{
            background:
              "linear-gradient(135deg, rgba(218,165,32,0.95) 0%, rgba(184,134,11,0.9) 50%, rgba(139,69,19,0.85) 100%)",
            border: "3px solid rgba(218,165,32,0.8)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(218,165,32,0.3)",
          }}
        >
          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 opacity-50 rounded-2xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255,245,230,0.2) 0%, transparent 60%)
              `,
              backgroundSize: "200px 200px, 250px 250px, 150px 150px",
            }}
          />

          {/* 水流模様 */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15 rounded-2xl"
            style={{ mixBlendMode: "overlay" }}
          >
            <defs>
              <pattern
                id={`wave-field-${size}`}
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
            <rect width="100%" height="100%" fill={`url(#wave-field-${size})`} />
          </svg>

          {/* 桜の花びら装飾 */}
          <div className="absolute top-3 left-3 text-xl opacity-30 animate-pulse">🌸</div>
          <div className="absolute top-3 right-3 text-xl opacity-30 animate-pulse delay-150">
            🌸
          </div>
          <div className="absolute bottom-3 left-3 text-xl opacity-30 animate-pulse delay-300">
            🌸
          </div>
          <div className="absolute bottom-3 right-3 text-xl opacity-30 animate-pulse delay-450">
            🌸
          </div>

          {/* キラキラエフェクト */}
          <div
            className="absolute top-6 right-6 w-3 h-3 rounded-full animate-ping"
            style={{ background: "rgba(255,245,230,0.8)" }}
          />
          <div
            className="absolute bottom-8 left-6 w-2 h-2 rounded-full animate-ping delay-150"
            style={{ background: "rgba(255,245,230,0.7)" }}
          />

          {/* 単語テキスト */}
          <div className="relative z-10 px-4">
            <p
              className={`${sizeClasses.text} font-black text-center`}
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: "0.15em",
                color: "#FFF5E6",
                textShadow:
                  "0 2px 4px rgba(0,0,0,0.7), 0 0 8px rgba(218,165,32,0.4), 0 4px 8px rgba(0,0,0,0.5)",
              }}
            >
              {word}
            </p>
          </div>

          {/* 王冠アイコン（トップ中央） */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div
              className="text-4xl animate-bounce-slow"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
              }}
            >
              👑
            </div>
          </div>

          {/* 装飾的な上下の縁 */}
          <div
            className="absolute inset-x-0 top-0 h-3 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(218,165,32,0.8) 0%, rgba(184,134,11,0.9) 50%, rgba(218,165,32,0.8) 100%)",
              borderBottom: "1px solid rgba(255,215,0,0.4)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-3 rounded-b-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(218,165,32,0.8) 0%, rgba(184,134,11,0.9) 50%, rgba(218,165,32,0.8) 100%)",
              borderTop: "1px solid rgba(255,215,0,0.4)",
            }}
          />
        </div>
      </div>

      {/* 説明テキスト */}
      <div className="text-center mt-4">
        <p
          className="text-sm font-medium"
          style={{
            color: "rgba(139,69,19,0.8)",
            textShadow: "0 1px 2px rgba(255,255,255,0.3)",
          }}
        >
          このカードに近い単語を提出しよう！
        </p>
      </div>

      {/* アニメーション用のカスタムCSS */}
      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}
