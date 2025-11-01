import { HandCard, type CardRarity } from "./HandCard";

export interface Card {
  id: string;
  word: string;
  rarity: CardRarity;
  similarity?: number;
  isDeckCard?: boolean;
  rarityBonus?: number;
}

export interface HandAreaProps {
  /** 手札のカード（常に5枚） */
  cards: Card[];
  /** 選択中のカードID */
  selectedCardIds?: string[];
  /** 複数選択可能か */
  multiSelect?: boolean;
  /** カード選択時のコールバック */
  onCardSelect?: (cardId: string) => void;
  /** 類似度を表示するか */
  showSimilarity?: boolean;
  /** プレイヤー名 */
  playerName?: string;
  /** 残りデッキ枚数 */
  deckRemaining?: number;
  className?: string;
}

export const HandArea = ({
  cards,
  selectedCardIds = [],
  multiSelect = false,
  onCardSelect,
  showSimilarity = false,
  playerName,
  deckRemaining,
  className = "",
}: HandAreaProps) => {
  const handleCardClick = (cardId: string) => {
    if (!onCardSelect) return;

    if (multiSelect) {
      onCardSelect(cardId);
    } else {
      // 単一選択の場合、既に選択されているなら解除
      if (selectedCardIds.includes(cardId)) {
        onCardSelect("");
      } else {
        onCardSelect(cardId);
      }
    }
  };

  return (
    <div className={`w-full max-w-xl md:max-w-2xl lg:max-w-4xl flex flex-col h-full ${className}`}>
      {/* ヘッダー情報 - 和風装飾 */}
      {(playerName || deckRemaining !== undefined) && (
        <div className="relative mb-1 px-3 flex-shrink-0">
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
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-2xl opacity-30"
            style={{ transform: "translateY(-50%) rotate(-15deg)" }}
          >
            🌸
          </div>
          <div
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-2xl opacity-30"
            style={{ transform: "translateY(-50%) rotate(15deg)" }}
          >
            🌸
          </div>

          <div className="relative flex items-center justify-between py-2 px-3 gap-3">
            {playerName && (
              <div className="flex items-center gap-2 flex-shrink min-w-0 flex-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.8))",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                  }}
                >
                  <span className="text-white text-xs font-bold">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-bold text-base truncate select-none"
                      style={{
                        color: "#654321",
                        textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                      }}
                      title={playerName}
                    >
                      {playerName}
                    </span>
                    <span className="text-amber-800/70 text-xs flex-shrink-0 select-none">
                      の手札
                    </span>
                  </div>
                </div>
              </div>
            )}

            {deckRemaining !== undefined && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                  border: "2px solid rgba(218,165,32,0.6)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                }}
              >
                <span className="text-xl">🎴</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-amber-100/90 select-none">残り</span>
                  <span className="text-lg font-bold text-amber-50 select-none">
                    {deckRemaining}
                  </span>
                  <span className="text-xs text-amber-100/90 select-none">枚</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 手札エリア - 畳風デザイン */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="relative overflow-visible">
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

          {/* カード配置エリア */}
          <div className="relative flex justify-center items-end gap-4 px-6 pt-8 pb-6">
            {cards.length === 0 ? (
              // 手札が空の場合 - 和風
              <div className="flex flex-col items-center justify-center h-32">
                <div
                  className="mb-3 p-4 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,69,19,0.2), rgba(101,67,33,0.15))",
                    border: "2px dashed rgba(139,69,19,0.3)",
                  }}
                >
                  <span className="text-5xl">🎴</span>
                </div>
                <span
                  className="text-sm font-semibold select-none"
                  style={{
                    color: "rgba(101,67,33,0.7)",
                    textShadow: "0 1px 1px rgba(255,255,255,0.3)",
                  }}
                >
                  手札がありません
                </span>
              </div>
            ) : (
              // カード表示 - 扇形配置
              cards.map((card, index) => (
                <div
                  key={card.id}
                  className="relative"
                  style={{
                    // 扇形配置のための微妙な回転
                    transform: `rotate(${(index - 2) * 3}deg)`,
                    zIndex: selectedCardIds.includes(card.id) ? 10 : cards.length - index,
                  }}
                >
                  <HandCard
                    word={card.word}
                    rarity={card.rarity}
                    similarity={card.similarity}
                    isDeckCard={card.isDeckCard}
                    rarityBonus={card.rarityBonus}
                    selected={selectedCardIds.includes(card.id)}
                    showSimilarity={showSimilarity}
                    onCardClick={() => handleCardClick(card.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* 選択情報 - 和風 */}
        {selectedCardIds.length > 0 && (
          <div className="flex-shrink-0 pt-3 text-center">
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(139,69,19,0.85), rgba(101,67,33,0.9))",
                border: "2px solid rgba(218,165,32,0.7)",
                boxShadow:
                  "0 4px 0px rgba(0,0,0,0.3), inset 0 1px 0px rgba(255,245,230,0.2), 0 0 0px rgba(218,165,32,0.4)",
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(218,165,32,0.9)",
                  boxShadow: "0 0 0px rgba(218,165,32,0.6)",
                }}
              >
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span
                className="text-base font-bold select-none"
                style={{
                  color: "rgba(255,245,230,0.95)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {multiSelect ? `${selectedCardIds.length}枚選択中` : "1枚選択中"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
