"use client";

import { useMutation, useQuery } from "convex/react";
import { Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import type { Card } from "../../common/types/card";
import type { Rarity } from "../../common/types/rarity";
import { OwnedCardWithDetail } from "../types/deck";
import { CardSearchButton } from "./CardSearchButton";
import { CardSortButton, SortOption } from "./CardSortButton";
import { CardComponent } from "./OwnerCard";

export default function BuildDeck() {
  const maxDeckSize = 20;
  const { id } = useParams();
  const deckId = id as Id<"deck">;

  // Convexクエリ
  const user = useQuery(api.user.getMyUser);
  const deck = useQuery(
    api.deck.getUserDeckCards,
    user?._id ? { userId: user._id, deckId } : "skip"
  );
  const ownedCards = useQuery(api.card.getUserCardsWithDetails);

  // Convexミューテーション
  const saveDeckCards = useMutation(api.deck.saveDeckCards);

  // ローカル状態
  const [localDeck, setLocalDeck] = useState<
    Array<{
      position: number;
      user_card_id: string;
      card: Card;
    }>
  >([]);
  const [localOwnedCards, setLocalOwnedCards] = useState<OwnedCardWithDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("cardNumber");

  // データが読み込まれたらローカル状態を更新
  useEffect(() => {
    if (deck && ownedCards) {
      const deckData = deck
        .filter((card): card is NonNullable<typeof card> => card !== null)
        .map((card) => ({
          position: Number(card.position),
          user_card_id: String(card.user_card_id),
          card: {
            id: String(card.card._id),
            name: card.card.text,
            rarity: card.card.rarity as Rarity,
            card_number: card.card.card_number,
          },
        }));

      setLocalDeck(deckData);

      // デッキに入っているカードのuser_card_idを取得
      const deckCardIds = new Set(deckData.map((card) => card.user_card_id));

      // 所持カードからデッキに入っているカードを除外
      setLocalOwnedCards(
        ownedCards
          .filter(
            (card): card is NonNullable<typeof card> =>
              card !== null && !deckCardIds.has(String(card.id))
          )
          .map((card) => ({
            id: String(card.id), // Convex IDを文字列として保持
            user_id: String(card.user_id),
            card_id: String(card.card_id),
            is_locked: card.is_locked,
            quantity: Number(card.quantity),
            card: {
              id: String(card.card._id),
              name: card.card.text,
              rarity: card.card.rarity as Rarity,
              card_number: card.card.card_number,
            },
          }))
      );
    }
  }, [deck, ownedCards]);

  // ローディング状態: user, deck, ownedCardsがundefinedの時
  if (user === undefined || deck === undefined || ownedCards === undefined) {
    return (
      <div className="flex items-center justify-center h-full relative">
        {/* ローディング中のプレースホルダー */}
        <div className="relative rounded-lg p-8 select-none">
          {/* 背景 - 和風スタイル */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(139,115,85,0.15), rgba(101,84,63,0.2))",
              border: "2px solid rgba(218,165,32,0.3)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 rounded-lg opacity-20"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,245,230,0.1) 10px,
                  rgba(255,245,230,0.1) 20px
                )
              `,
            }}
          />
          {/* ローディングアニメーション */}
          <div className="relative flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 border-4 border-t-amber-600 border-r-amber-500 border-b-amber-400 border-l-transparent rounded-full animate-spin"
              style={{
                borderWidth: "4px",
              }}
            />
            <div
              className="text-base font-semibold"
              style={{
                color: "#654321",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              読み込み中...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ユーザーが見つからない場合（認証エラーなど）
  if (user === null) {
    return (
      <div className="flex items-center justify-center h-full relative">
        <div className="relative rounded-lg p-8 select-none">
          {/* 背景 - 和風スタイル */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(139,115,85,0.15), rgba(101,84,63,0.2))",
              border: "2px solid rgba(218,165,32,0.3)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
          <div
            className="text-lg font-semibold"
            style={{
              color: "#654321",
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            ユーザー情報が見つかりません
          </div>
        </div>
      </div>
    );
  }

  // デッキが見つからない場合
  if (deck === null) {
    return (
      <div className="flex items-center justify-center h-full relative">
        <div className="relative rounded-lg p-8 select-none">
          {/* 背景 - 和風スタイル */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(139,115,85,0.15), rgba(101,84,63,0.2))",
              border: "2px solid rgba(218,165,32,0.3)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
          <div
            className="text-lg font-semibold"
            style={{
              color: "#654321",
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            デッキが見つかりません
          </div>
        </div>
      </div>
    );
  }

  /**
   * 所持カードを並び替える
   */
  const sortOwnedCards = (
    cards: OwnedCardWithDetail[],
    sortBy: SortOption
  ): OwnedCardWithDetail[] => {
    const sortedCards = [...cards];

    switch (sortBy) {
      case "cardNumber":
        return sortedCards.sort((a, b) => {
          const aNum = parseInt(a.card.card_number, 10);
          const bNum = parseInt(b.card.card_number, 10);
          // 数値変換に失敗した場合は文字列として比較
          if (isNaN(aNum) || isNaN(bNum)) {
            return a.card.card_number.localeCompare(b.card.card_number);
          }
          return aNum - bNum;
        });
      case "name":
        return sortedCards.sort((a, b) => a.card.name.localeCompare(b.card.name));
      case "acquired":
        return sortedCards.sort((a, b) => a.id.localeCompare(b.id)); // ID順（入手順、文字列比較）
      default:
        return sortedCards;
    }
  };

  /**
   * 並び替えオプションが変更された時の処理
   */
  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  /**
   * デッキを保存する
   */
  const handleSaveDeck = async () => {
    if (localDeck.length < maxDeckSize) {
      alert(`デッキは${maxDeckSize}枚必要です。現在${localDeck.length}枚です。`);
      return;
    }

    try {
      setIsLoading(true);
      await saveDeckCards({
        deckId,
        cards: localDeck.map((deckCard) => ({
          card_id: deckCard.card.id as Id<"card">,
          position: BigInt(deckCard.position),
        })),
      });
      setHasUnsavedChanges(false);
      toast.success("デッキを保存しました");
    } catch (error) {
      console.error("デッキ保存エラー:", error);
      alert("デッキの保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 所持カードをデッキに移動する
   * @param userCardId 所持カードID（文字列形式のID）
   */
  const handleMoveToDeck = async (userCardId: string) => {
    if (localDeck.length >= maxDeckSize) return;
    const selectedOwnedCard = localOwnedCards.find((ownedCard) => ownedCard.id === userCardId);
    if (!selectedOwnedCard) return;

    // 同名カードが既にデッキに含まれているかチェック
    const isCardAlreadyInDeck = localDeck.some(
      (deckCard) => deckCard.card.name === selectedOwnedCard.card.name
    );
    if (isCardAlreadyInDeck) {
      alert("同名のカードは1枚までしかデッキに追加できません");
      return;
    }

    // 空いている最初のスロットを見つける
    const usedPositions = localDeck.map((deckCard) => deckCard.position).sort((a, b) => a - b);
    let nextPosition = 1;
    for (const pos of usedPositions) {
      if (pos === nextPosition) {
        nextPosition++;
      } else {
        break;
      }
    }

    // ローカル状態を更新
    const newDeckCard = {
      position: nextPosition,
      user_card_id: userCardId,
      card: selectedOwnedCard.card,
    };

    setLocalDeck([...localDeck, newDeckCard]);
    setLocalOwnedCards(localOwnedCards.filter((ownedCard) => ownedCard.id !== userCardId));
    setHasUnsavedChanges(true);
  };

  /**
   * デッキから所持カードに移動する
   * @param userCardId 所持カードID（文字列形式のID）
   */
  const handleMoveToOwned = async (userCardId: string) => {
    const selectedDeckCard = localDeck.find((deckCard) => deckCard.user_card_id === userCardId);
    if (!selectedDeckCard) return;

    // ローカル状態を更新（デッキから削除し、所持カードに追加）
    const updatedDeck = localDeck.filter((deckCard) => deckCard.user_card_id !== userCardId);

    // user_card_idをそのままidとして使用（両方ともConvex ID文字列）
    const ownedCard: OwnedCardWithDetail = {
      id: userCardId, // Convex ID文字列をそのまま使用
      user_id: String(user._id),
      card_id: selectedDeckCard.card.id,
      is_locked: false,
      quantity: 1,
      card: {
        ...selectedDeckCard.card,
        rarity: selectedDeckCard.card.rarity as Rarity,
      },
    };

    setLocalDeck(updatedDeck);
    setLocalOwnedCards([...localOwnedCards, ownedCard]);
    setHasUnsavedChanges(true);
  };

  /**
   * 検索からカードを選択してデッキに追加
   * @param selectedCard 選択されたカード
   */
  const handleSelectCardFromSearch = async (selectedCard: OwnedCardWithDetail) => {
    if (localDeck.length >= maxDeckSize) return;

    // 同名カードが既にデッキに含まれているかチェック
    const isCardAlreadyInDeck = localDeck.some(
      (deckCard) => deckCard.card.name === selectedCard.card.name
    );
    if (isCardAlreadyInDeck) {
      alert("同名のカードは1枚までしかデッキに追加できません");
      return;
    }

    // 空いている最初のスロットを見つける
    const usedPositions = localDeck.map((deckCard) => deckCard.position).sort((a, b) => a - b);
    let nextPosition = 1;
    for (const pos of usedPositions) {
      if (pos === nextPosition) {
        nextPosition++;
      } else {
        break;
      }
    }

    // ローカル状態を更新
    const newDeckCard = {
      position: nextPosition,
      user_card_id: selectedCard.id, // 既に文字列型
      card: selectedCard.card,
    };

    setLocalDeck([...localDeck, newDeckCard]);
    setLocalOwnedCards(localOwnedCards.filter((ownedCard) => ownedCard.id !== selectedCard.id));
    setHasUnsavedChanges(true);
  };

  /* デッキスロット */
  const deckSlots = Array.from({ length: maxDeckSize }, (_, i) => {
    return localDeck.find((deckCard) => deckCard.position === i + 1) || null;
  });

  return (
    <div className="flex flex-col max-w-6xl mx-auto gap-4 h-[calc(90vh-5.5rem)] overflow-hidden mb-10">
      {/* 保存ボタン */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSaveDeck}
          disabled={!hasUnsavedChanges || isLoading || localDeck.length < maxDeckSize}
          className="relative px-6 py-3 rounded-lg font-semibold text-base transition-all overflow-hidden select-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              !hasUnsavedChanges || isLoading || localDeck.length < maxDeckSize
                ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
            border:
              !hasUnsavedChanges || isLoading || localDeck.length < maxDeckSize
                ? "2px solid rgba(100,100,100,0.6)"
                : "2px solid rgba(218,165,32,0.6)",
            boxShadow:
              !hasUnsavedChanges || isLoading || localDeck.length < maxDeckSize
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
            cursor:
              !hasUnsavedChanges || isLoading || localDeck.length < maxDeckSize
                ? "not-allowed"
                : "pointer",
          }}
          onMouseEnter={(e) => {
            if (hasUnsavedChanges && !isLoading && localDeck.length >= maxDeckSize) {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (hasUnsavedChanges && !isLoading && localDeck.length >= maxDeckSize) {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
            }
          }}
        >
          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,245,230,0.1) 10px,
                  rgba(255,245,230,0.1) 20px
                )
              `,
            }}
          />
          <span
            className="relative flex items-center gap-2"
            style={{
              color:
                !hasUnsavedChanges || isLoading || localDeck.length < maxDeckSize
                  ? "#D3D3D3"
                  : "#F5DEB3",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            <Save className="w-4 h-4" />
            {isLoading
              ? "保存中..."
              : localDeck.length < maxDeckSize
                ? `デッキを保存 (${localDeck.length}/${maxDeckSize}枚)`
                : "デッキを保存"}
          </span>
        </button>
      </div>

      <div className="flex flex-row gap-4 flex-1 overflow-hidden">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="relative rounded-lg p-8 select-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,248,235,0.98), rgba(255,245,230,0.95))",
                border: "3px solid rgba(101,67,33,0.6)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {/* 和紙テクスチャ */}
              <div
                className="absolute inset-0 rounded-lg opacity-10"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(255,245,230,0.1) 10px,
                      rgba(255,245,230,0.1) 20px
                    )
                  `,
                }}
              />
              {/* ローディングアニメーション */}
              <div className="relative flex flex-col items-center justify-center gap-4">
                <div
                  className="w-16 h-16 border-4 border-t-amber-600 border-r-amber-500 border-b-amber-400 border-l-transparent rounded-full animate-spin"
                  style={{
                    borderWidth: "4px",
                  }}
                />
                <div
                  className="text-lg font-semibold"
                  style={{
                    color: "#654321",
                    textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  保存中...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* デッキ */}
        <div className="w-1/2 flex flex-col border border-primary/30 p-4">
          <h2 className="flex items-center justify-center text-lg font-bold mb-5">デッキ</h2>
          <div className="rounded-lg p-2 bg-gray-50 flex-1 overflow-y-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
              {deckSlots.map((deckSlotCard, index) => (
                <div key={`deck-slot-${index}`}>
                  {deckSlotCard ? (
                    <CardComponent
                      ownedCard={{
                        id: deckSlotCard.user_card_id, // Convex ID文字列をそのまま使用
                        user_id: String(user._id),
                        card_id: deckSlotCard.card.id,
                        is_locked: false,
                        quantity: 1, // デッキ内のカードは1枚
                        card: deckSlotCard.card,
                      }}
                      onClick={() => handleMoveToOwned(deckSlotCard.user_card_id)}
                    />
                  ) : (
                    <div className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg bg-white/50 flex items-center justify-center w-20 sm:w-24 md:w-30 lg:w-36">
                      <span className="text-gray-400 select-none text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 所持カード */}
        <div className="w-1/2 flex flex-col border border-primary/30 p-4">
          <div className="flex items-center justify-center mb-5 relative">
            <h2 className="text-lg font-bold">所持カード</h2>
            <div className="absolute right-0 flex items-center gap-2">
              <CardSortButton onSortChange={handleSortChange} currentSort={sortOption} />
              <CardSearchButton
                onSelectCard={handleSelectCardFromSearch}
                excludeCardIds={[]}
                ownedCards={localOwnedCards}
              />
            </div>
          </div>

          <div className="border-2 border-dashed rounded-lg p-2 bg-gray-50 border-gray-300 flex-1 overflow-y-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
              {sortOwnedCards(localOwnedCards, sortOption).map((ownedCardItem, index) => {
                // 有効なキーを生成
                const validKey = `owned-card-${ownedCardItem.id}-${index}`;
                return (
                  <CardComponent
                    key={validKey}
                    ownedCard={ownedCardItem}
                    onClick={() => handleMoveToDeck(ownedCardItem.id)}
                  />
                );
              })}
              {localOwnedCards.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-full text-gray-400 mt-10">
                  <p>所持カードがありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
