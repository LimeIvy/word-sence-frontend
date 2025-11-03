import React from "react";

export interface ActionButtonsProps {
  /** カード交換ボタンのコールバック */
  onExchange?: () => void;
  /** 単語生成ボタンのコールバック */
  onGenerate?: () => void;
  /** 準備完了ボタンのコールバック */
  onReady?: () => void;
  /** カード交換ボタンが無効か */
  exchangeDisabled?: boolean;
  /** 単語生成ボタンが無効か */
  generateDisabled?: boolean;
  /** 準備完了ボタンが無効か */
  readyDisabled?: boolean;
  /** デッキ残り枚数 */
  deckRemaining?: number;
  className?: string;
}

export const ActionButtons = React.memo(
  ({
    onExchange,
    onGenerate,
    onReady,
    exchangeDisabled = false,
    generateDisabled = false,
    readyDisabled = false,
    deckRemaining,
    className = "",
  }: ActionButtonsProps) => {
    return (
      <div className={`w-full ${className}`}>
        {/* アクションボタン群 */}
        <div className="flex flex-col gap-2">
          {/* カード交換ボタン */}
          <button
            onClick={onExchange}
            disabled={exchangeDisabled}
            className="relative group flex items-center justify-between px-4 py-2.5 rounded-lg font-bold text-base transition-all duration-200 overflow-hidden"
            style={{
              background: exchangeDisabled
                ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
              border: exchangeDisabled
                ? "2px solid rgba(100,100,100,0.6)"
                : "2px solid rgba(218,165,32,0.6)",
              boxShadow: exchangeDisabled
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
              cursor: exchangeDisabled ? "not-allowed" : "pointer",
              opacity: exchangeDisabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!exchangeDisabled) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!exchangeDisabled) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
              }
            }}
            onMouseDown={(e) => {
              if (!exchangeDisabled) {
                e.currentTarget.style.transform = "scale(0.98)";
              }
            }}
            onMouseUp={(e) => {
              if (!exchangeDisabled) {
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
          >
            {/* 和紙テクスチャ */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%)
              `,
              }}
            />

            <div className="flex items-center gap-2 relative z-10">
              <span className="text-xl">🔄</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span
                    className="select-none"
                    style={{
                      color: "#FFF5E6",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    カード交換
                  </span>
                </div>
                <span
                  className="text-xs font-normal select-none"
                  style={{
                    color: "rgba(255,245,230,0.7)",
                    textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  {exchangeDisabled && deckRemaining === 0 ? "デッキが空です" : "手札を入れ替える"}
                </span>
              </div>
            </div>

            {!exchangeDisabled && deckRemaining !== undefined && (
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full relative z-10"
                style={{
                  background: "rgba(218,165,32,0.3)",
                  border: "1px solid rgba(218,165,32,0.5)",
                }}
              >
                <span className="text-sm">🎴</span>
                <span
                  className="text-sm font-bold select-none"
                  style={{
                    color: "#FFF5E6",
                    textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  {deckRemaining}枚
                </span>
              </div>
            )}
          </button>

          {/* 単語生成ボタン */}
          <button
            onClick={onGenerate}
            disabled={generateDisabled}
            className="relative group flex items-center justify-between px-4 py-2.5 rounded-lg font-bold text-base transition-all duration-200 overflow-hidden"
            style={{
              background: generateDisabled
                ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
              border: generateDisabled
                ? "2px solid rgba(100,100,100,0.6)"
                : "2px solid rgba(218,165,32,0.6)",
              boxShadow: generateDisabled
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
              cursor: generateDisabled ? "not-allowed" : "pointer",
              opacity: generateDisabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!generateDisabled) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!generateDisabled) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
              }
            }}
            onMouseDown={(e) => {
              if (!generateDisabled) {
                e.currentTarget.style.transform = "scale(0.98)";
              }
            }}
            onMouseUp={(e) => {
              if (!generateDisabled) {
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
          >
            {/* 和紙テクスチャ */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%)
              `,
              }}
            />

            <div className="flex items-center gap-2 relative z-10">
              <span className="text-xl">⚗️</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span
                    className="select-none"
                    style={{
                      color: "#FFF5E6",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    単語生成
                  </span>
                </div>
                <span
                  className="text-xs font-normal select-none"
                  style={{
                    color: "rgba(255,245,230,0.7)",
                    textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  ベクトル演算で新しい単語を作る
                </span>
              </div>
            </div>

            {!generateDisabled && (
              <div
                className="text-xl relative z-10"
                style={{
                  color: "rgba(255,245,230,0.8)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                →
              </div>
            )}
          </button>

          {/* 準備完了ボタン */}
          <div className="relative">
            {/* グローエフェクト */}
            <div
              className="absolute inset-0 rounded-xl opacity-50 animate-pulse"
              style={{
                background: "linear-gradient(135deg, rgba(139,69,19,0.8), rgba(101,67,33,0.7))",
                filter: "blur(8px)",
              }}
            />
            <button
              onClick={onReady}
              disabled={readyDisabled}
              className="relative w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-black text-lg transition-all duration-200 overflow-hidden"
              style={{
                background: readyDisabled
                  ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                  : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                border: readyDisabled
                  ? "2px solid rgba(100,100,100,0.6)"
                  : "2px solid rgba(218,165,32,0.7)",
                boxShadow: readyDisabled
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 6px 20px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 12px rgba(218,165,32,0.4)",
                cursor: readyDisabled ? "not-allowed" : "pointer",
                opacity: readyDisabled ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!readyDisabled) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 16px rgba(218,165,32,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!readyDisabled) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 12px rgba(218,165,32,0.4)";
                }
              }}
              onMouseDown={(e) => {
                if (!readyDisabled) {
                  e.currentTarget.style.transform = "scale(0.98)";
                }
              }}
              onMouseUp={(e) => {
                if (!readyDisabled) {
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
            >
              {/* 和紙テクスチャ */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%)
                `,
                }}
              />

              {/* 桜の花びら装飾 */}
              <div className="absolute top-2 left-2 text-lg opacity-30">🌸</div>
              <div className="absolute top-2 right-2 text-lg opacity-30">🌸</div>

              <span className="text-2xl relative z-10">✅</span>
              <span
                className="relative z-10 select-none"
                style={{
                  color: "#FFF5E6",
                  textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                }}
              >
                準備完了
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ActionButtons.displayName = "ActionButtons";
