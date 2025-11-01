export type ActionType =
  | "card_exchange_deck"
  | "card_exchange_pool"
  | "word_generation"
  | "card_submission"
  | "victory_declaration"
  | "call"
  | "fold"
  | "ready";

export interface ActionLogEntry {
  /** アクションID（一意） */
  id: string;
  /** プレイヤー名 */
  playerName: string;
  /** 自分のアクションかどうか */
  isOwnAction: boolean;
  /** アクションタイプ */
  actionType: ActionType;
  /** アクションの詳細情報 */
  details?: {
    /** カード交換の場合：交換した枚数 */
    exchangedCount?: number;
    /** 単語生成の場合：生成された単語 */
    generatedWord?: string;
    /** 提出カードの場合：カードの単語 */
    submittedWord?: string;
    /** 勝利宣言の場合：宣言した単語 */
    declaredWord?: string;
  };
  /** タイムスタンプ */
  timestamp: number;
}

export interface ActionLogProps {
  /** ログエントリの配列 */
  logs: ActionLogEntry[];
  /** 最大表示数 */
  maxItems?: number;
  className?: string;
}

const ACTION_LABELS: Record<ActionType, string> = {
  card_exchange_deck: "デッキからカードを交換しました",
  card_exchange_pool: "プールからカードを交換しました",
  word_generation: "単語を生成しました",
  card_submission: "カードを提出しました",
  victory_declaration: "勝利宣言をしました",
  call: "コールしました",
  fold: "フォールドしました",
  ready: "準備完了しました",
};

export const ActionLog = ({ logs, maxItems = 10, className = "" }: ActionLogProps) => {
  const displayLogs = logs.slice(-maxItems).reverse(); // 最新のものが上に来るように

  return (
    <div className={`w-full max-w-full flex-shrink-0 flex flex-col ${className}`}>
      {/* ヘッダー - 和風 */}
      <div className="relative mb-4 px-4 flex-shrink-0">
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
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-3xl opacity-30"
          style={{ transform: "translateY(-50%) rotate(-15deg)" }}
        >
          🌸
        </div>
        <div
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-3xl opacity-30"
          style={{ transform: "translateY(-50%) rotate(15deg)" }}
        >
          🌸
        </div>

        <div className="relative flex items-center justify-center py-3 px-4">
          <span className="text-base">📜</span>
          <span
            className="font-bold text-lg ml-2 select-none"
            style={{
              color: "#654321",
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            行動ログ
          </span>
        </div>
      </div>

      {/* ログエリア - 和風 */}
      <div className="relative w-full flex-1 min-h-0">
        {/* 背景プレート */}
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
        <div className="absolute top-4 left-4 text-xl opacity-20">🌸</div>
        <div className="absolute top-4 right-4 text-xl opacity-20">🌸</div>
        <div className="absolute bottom-4 left-4 text-xl opacity-20">🌸</div>
        <div className="absolute bottom-4 right-4 text-xl opacity-20">🌸</div>

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

        {/* ログリスト - 固定幅・固定高さでスクロール */}
        <div
          className="relative p-4 space-y-2 h-full overflow-y-auto overflow-x-hidden"
          style={{ width: "100%" }}
        >
          {displayLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-4xl mb-2 opacity-30">📜</span>
              <span
                className="text-sm font-semibold select-none"
                style={{
                  color: "rgba(101,67,33,0.9)",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                まだ行動がありません
              </span>
            </div>
          ) : (
            displayLogs.map((log) => {
              const actionLabel = ACTION_LABELS[log.actionType];

              // 詳細情報を含むメッセージを構築
              let message = `${log.playerName}さんが${actionLabel}`;
              if (log.details) {
                if (log.details.exchangedCount) {
                  message = `${log.playerName}さんが${log.details.exchangedCount}枚${actionLabel}`;
                } else if (log.details.generatedWord) {
                  message = `${log.playerName}さんが「${log.details.generatedWord}」を${actionLabel}`;
                } else if (log.details.submittedWord) {
                  message = `${log.playerName}さんが「${log.details.submittedWord}」を${actionLabel}`;
                } else if (log.details.declaredWord) {
                  message = `${log.playerName}さんが「${log.details.declaredWord}」で${actionLabel}`;
                }
              }

              return (
                <div
                  key={log.id}
                  className="relative p-3 rounded-lg transition-all duration-200 w-full"
                  style={{
                    background: log.isOwnAction
                      ? "linear-gradient(135deg, rgba(218,165,32,0.25), rgba(184,134,11,0.2))"
                      : "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.2))",
                    border: log.isOwnAction
                      ? "1px solid rgba(218,165,32,0.5)"
                      : "1px solid rgba(139,69,19,0.4)",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* ユーザーアイコン */}
                  <div className="flex items-start gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.8))",
                        boxShadow:
                          "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                      }}
                    >
                      <span className="text-white text-xs font-bold">👤</span>
                    </div>
                    <div className="flex-1 min-w-0 break-words">
                      <p
                        className="text-sm font-medium leading-relaxed select-none"
                        style={{
                          color: log.isOwnAction ? "rgba(139,69,19,0.95)" : "rgba(60,45,30,0.95)",
                          textShadow: "0 1px 2px rgba(255,255,255,0.6)",
                          fontWeight: 500,
                        }}
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
