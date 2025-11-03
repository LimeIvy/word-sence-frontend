"use client";

export interface OpponentHandProps {
  /** 相手の手札枚数 */
  handCount: number;
  /** 相手の名前 */
  opponentName?: string;
  /** 残りデッキ枚数 */
  deckRemaining?: number;
  /** クラス名 */
  className?: string;
}

/**
 * 相手の手札表示コンポーネント（裏面表示）
 */
export function OpponentHand({
  handCount,
  opponentName = "相手",
  deckRemaining,
  className = "",
}: OpponentHandProps) {
  const maxHandSize = 5;

  return (
    <div className={`w-full max-w-xl md:max-w-2xl lg:max-w-4xl ${className}`}>
      {/* ヘッダー情報 */}
      {(opponentName || deckRemaining !== undefined) && (
        <div className="relative mb-4 px-4">
          {/* 装飾的な背景 */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.15), rgba(101,67,33,0.1))",
              border: "1px solid rgba(139,69,19,0.3)",
            }}
          />

          {/* 左右の扇装飾 */}
          <div
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-3xl opacity-30 select-none"
            style={{ transform: "translateY(-50%) rotate(-15deg)" }}
          >
            🌸
          </div>
          <div
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-3xl opacity-30 select-none"
            style={{ transform: "translateY(-50%) rotate(15deg)" }}
          >
            🌸
          </div>

          <div className="relative flex items-center justify-between py-3 px-4 gap-4">
            {opponentName && (
              <div className="flex items-center gap-3 flex-shrink min-w-0 flex-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(185,28,28,0.8))",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                  }}
                >
                  <span className="text-white text-sm font-bold select-none">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-bold text-lg truncate"
                      style={{
                        color: "#654321",
                        textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                      }}
                      title={opponentName}
                    >
                      {opponentName}
                    </span>
                    <span className="text-red-800/70 text-sm flex-shrink-0">の手札</span>
                  </div>
                </div>
              </div>
            )}

            {deckRemaining !== undefined && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                  border: "2px solid rgba(218,165,32,0.6)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                }}
              >
                <span className="text-2xl select-none">🎴</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-amber-100/90">残り</span>
                  <span className="text-xl font-bold text-amber-50">{deckRemaining}</span>
                  <span className="text-xs text-amber-100/90">枚</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 手札エリア - 畳風デザイン */}
      <div className="relative overflow-hidden">
        {/* 畳の質感 - ベース */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(to bottom, rgba(139,115,85,0.3), rgba(101,84,63,0.4))",
            border: "3px solid rgba(101,67,33,0.6)",
            boxShadow:
              "inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(255,245,230,0.1), 0 8px 16px rgba(0,0,0,0.3)",
          }}
        />

        {/* 畳の目模様 */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 8px,
                rgba(101,67,33,0.3) 8px,
                rgba(101,67,33,0.3) 9px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(101,67,33,0.2) 2px,
                rgba(101,67,33,0.2) 3px
              )
            `,
          }}
        />

        {/* 畳の縁装飾 */}
        <div
          className="absolute inset-x-0 top-0 h-3 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
            borderBottom: "1px solid rgba(218,165,32,0.4)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-3 rounded-b-2xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
            borderTop: "1px solid rgba(218,165,32,0.4)",
          }}
        />

        {/* 和風装飾 - 四隅の桜 */}
        <div className="absolute top-4 left-4 text-xl opacity-20 select-none">🌸</div>
        <div className="absolute top-4 right-4 text-xl opacity-20 select-none">🌸</div>
        <div className="absolute bottom-4 left-4 text-xl opacity-20 select-none">🌸</div>
        <div className="absolute bottom-4 right-4 text-xl opacity-20 select-none">🌸</div>

        {/* 和紙テクスチャの上乗せ */}
        <div
          className="absolute inset-0 rounded-2xl opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,245,230,0.2) 0%, transparent 60%)
            `,
            backgroundSize: "300px 300px, 350px 350px, 250px 250px",
          }}
        />

        {/* カード配置エリア */}
        <div className="relative flex justify-center items-end gap-3 px-8 py-6 min-h-[160px] overflow-hidden">
          {handCount === 0 ? (
            // 手札が空の場合
            <div className="flex flex-col items-center justify-center h-32">
              <div
                className="mb-3 p-4 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(139,69,19,0.2), rgba(101,67,33,0.15))",
                  border: "2px dashed rgba(139,69,19,0.3)",
                }}
              >
                <span className="text-5xl select-none">🎴</span>
              </div>
              <span
                className="text-sm font-semibold"
                style={{
                  color: "rgba(101,67,33,0.7)",
                  textShadow: "0 1px 1px rgba(255,255,255,0.3)",
                }}
              >
                手札がありません
              </span>
            </div>
          ) : (
            // カード表示 - 扇形配置（裏面）
            Array.from({ length: Math.min(handCount, maxHandSize) }).map((_, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  transform: `rotate(${(index - 2) * 3}deg)`,
                  zIndex: handCount - index,
                }}
              >
                {/* 裏面カード */}
                <div className="relative w-24 aspect-3/4 select-none">
                  <div
                    className="w-full h-full relative"
                    style={{
                      background: "linear-gradient(135deg, #1A1410 0%, #0D0A08 100%)",
                      padding: "1px",
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden rounded"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(139,69,19,0.95) 0%, rgba(101,67,33,0.9) 50%, rgba(70,50,30,0.85) 100%)",
                        borderRadius: "4px",
                        border: "2px solid #1A0F0A",
                        boxShadow:
                          "inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)",
                      }}
                    >
                      {/* 和紙テクスチャ */}
                      <div
                        className="absolute inset-0 opacity-50"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(255,245,230,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(255,245,230,0.2) 0%, transparent 50%)
                          `,
                          backgroundSize: "150px 150px, 200px 200px",
                        }}
                      />

                      {/* 裏面模様 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="text-4xl opacity-40"
                          style={{
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
                          }}
                        >
                          <span className="select-none">🎴</span>
                        </div>
                      </div>

                      {/* 装飾的な点 */}
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/30" />
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/30" />
                      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/30" />
                      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 手札枚数表示 */}
      {handCount > 0 && (
        <div className="mt-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.85), rgba(101,67,33,0.9))",
              border: "2px solid rgba(218,165,32,0.7)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0px rgba(255,245,230,0.2)",
            }}
          >
            <span className="text-sm font-bold" style={{ color: "rgba(255,245,230,0.95)" }}>
              {handCount}枚
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
