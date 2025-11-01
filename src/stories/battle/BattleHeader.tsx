export interface BattleHeaderProps {
  /** プレイヤー1の名前 */
  player1Name: string;
  /** プレイヤー1のスコア（0-3） */
  player1Score: number;
  /** プレイヤー2の名前 */
  player2Name: string;
  /** プレイヤー2のスコア（0-3） */
  player2Score: number;
  /** 現在のラウンド */
  currentRound: number;
  /** 現在のフェーズ */
  currentPhase:
    | "field_card_presentation"
    | "player_action"
    | "word_submission"
    | "response"
    | "point_calculation";
  className?: string;
}

const PHASE_LABELS: Record<BattleHeaderProps["currentPhase"], string> = {
  field_card_presentation: "お題カード提示",
  player_action: "アクションフェーズ",
  word_submission: "提出フェーズ",
  response: "対応フェーズ",
  point_calculation: "判定フェーズ",
};

export const BattleHeader = ({
  player1Name,
  player1Score,
  player2Name,
  player2Score,
  currentRound,
  currentPhase,
  className = "",
}: BattleHeaderProps) => {
  // スコア表示用のドット（和風デザイン）
  const renderScoreDots = (score: number, maxScore: number = 3) => {
    return (
      <div className="flex gap-1.5">
        {Array.from({ length: maxScore }).map((_, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full transition-all duration-300"
            style={{
              background:
                index < score
                  ? "linear-gradient(135deg, rgba(218,165,32,0.95), rgba(184,134,11,0.9))"
                  : "linear-gradient(135deg, rgba(80,60,40,0.8), rgba(60,45,30,0.85))",
              border:
                index < score ? "2px solid rgba(255,215,0,0.6)" : "2px solid rgba(101,67,33,0.5)",
              boxShadow:
                index < score
                  ? "0 0 8px rgba(218,165,32,0.8), inset 0 1px 1px rgba(255,255,255,0.3)"
                  : "inset 0 2px 3px rgba(0,0,0,0.4)",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full max-w-xl md:max-w-2xl lg:max-w-4xl relative rounded-2xl ${className}`}>
      {/* 和風背景 */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))",
          border: "3px solid rgba(101,67,33,0.6)",
          boxShadow:
            "inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(255,245,230,0.1), 0 8px 16px rgba(0,0,0,0.3)",
        }}
      />

      {/* 和紙テクスチャ */}
      <div
        className="absolute inset-0 rounded-2xl opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%)
          `,
          backgroundSize: "300px 300px, 350px 350px",
        }}
      />

      {/* 装飾的な上下の縁 */}
      <div
        className="absolute inset-x-0 top-0 h-2 rounded-t-2xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
          borderBottom: "1px solid rgba(218,165,32,0.4)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
          borderTop: "1px solid rgba(218,165,32,0.4)",
        }}
      />

      {/* 四隅の桜装飾 */}
      <div className="absolute top-3 left-3 text-lg opacity-20">🌸</div>
      <div className="absolute top-3 right-3 text-lg opacity-20">🌸</div>
      <div className="absolute bottom-3 left-3 text-lg opacity-20">🌸</div>
      <div className="absolute bottom-3 right-3 text-lg opacity-20">🌸</div>

      {/* メインコンテンツ */}
      <div className="relative p-3">
        {/* 上部：プレイヤー情報とスコア */}
        <div className="flex items-center justify-between mb-2 gap-3">
          {/* プレイヤー1 */}
          <div className="flex items-center gap-2 flex-shrink min-w-0 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.8))",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}
            >
              <span className="text-white text-base">👤</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="text-xs font-medium select-none"
                style={{
                  color: "rgba(139,69,19,0.7)",
                  textShadow: "0 1px 1px rgba(255,255,255,0.3)",
                }}
              >
                相手
              </span>
              <span
                className="text-base font-bold truncate select-none"
                style={{
                  color: "#654321",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  maxWidth: "100%",
                }}
                title={player1Name}
              >
                {player1Name}
              </span>
            </div>
            <div className="flex-shrink-0">{renderScoreDots(player1Score)}</div>
          </div>

          {/* ラウンド表示 */}
          <div
            className="flex flex-col items-center px-4 py-2 rounded-lg flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
              border: "2px solid rgba(218,165,32,0.6)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
            }}
          >
            <span
              className="text-xs font-medium tracking-wider select-none"
              style={{
                color: "rgba(255,245,230,0.7)",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              第
            </span>
            <span
              className="text-3xl font-black select-none"
              style={{
                color: "#FFF5E6",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {currentRound}
            </span>
            <span
              className="text-xs font-medium tracking-wider select-none"
              style={{
                color: "rgba(255,245,230,0.7)",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              回戦
            </span>
          </div>

          {/* プレイヤー2 */}
          <div className="flex items-center gap-2 flex-shrink min-w-0 flex-1 justify-end">
            <div className="flex-shrink-0">{renderScoreDots(player2Score)}</div>
            <div className="flex flex-col items-end min-w-0 flex-1">
              <span
                className="text-xs font-medium select-none"
                style={{
                  color: "rgba(139,69,19,0.7)",
                  textShadow: "0 1px 1px rgba(255,255,255,0.3)",
                }}
              >
                あなた
              </span>
              <span
                className="text-base font-bold truncate text-right w-full select-none"
                style={{
                  color: "#654321",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  maxWidth: "100%",
                }}
                title={player2Name}
              >
                {player2Name}
              </span>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.8))",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}
            >
              <span className="text-white text-base">👤</span>
            </div>
          </div>
        </div>

        {/* 中部：フェーズ表示 */}
        <div>
          <div
            className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full mx-auto w-fit"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.8), rgba(101,67,33,0.75))",
              border: "1px solid rgba(218,165,32,0.5)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,245,230,0.15)",
            }}
          >
            <span className="text-sm">📜</span>
            <span
              className="text-xs font-semibold tracking-wide select-none"
              style={{
                color: "#FFF5E6",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {PHASE_LABELS[currentPhase]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
