"use client";

import { useEffect, useState } from "react";
import { userCardMockDataList } from "../mock/userMockData";
import { DeckCardDetail, OwnedCardWithDetail } from "../types/deck";
import { CardSearchButton } from "./CardSearchButton";
import { CardComponent } from "./OwnerCard";

export default function BuildDeck() {
  const maxDeckSize = 20;
  const userId = "user-123";

  const [deck, setDeck] = useState<DeckCardDetail[]>([]);
  const [ownedCards, setOwnedCards] = useState<OwnedCardWithDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dummyOwned: OwnedCardWithDetail[] = Object.values(userCardMockDataList);
        setDeck([]);
        setOwnedCards(dummyOwned);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  /**
   * 所持カードをデッキに移動する
   * @param userCardId 所持カードID
   */
  const handleMoveToDeck = async (userCardId: number) => {
    if (deck.length >= maxDeckSize) return;
    const selectedOwnedCard = ownedCards.find((ownedCard) => ownedCard.id === userCardId);
    if (!selectedOwnedCard) return;

    // 空いている最初のスロットを見つける
    const usedPositions = deck.map((deckCard) => deckCard.position).sort((a, b) => a - b);
    let nextPosition = 1;
    for (const pos of usedPositions) {
      if (pos === nextPosition) {
        nextPosition++;
      } else {
        break;
      }
    }

    setDeck([
      ...deck,
      {
        position: nextPosition,
        user_card_id: userCardId,
        card: selectedOwnedCard.card,
      },
    ]);
    setOwnedCards(ownedCards.filter((ownedCard) => ownedCard.id !== userCardId));
  };

  /**
   * デッキから所持カードに移動する
   * @param userCardId 所持カードID
   */
  const handleMoveToOwned = async (userCardId: number) => {
    const selectedDeckCard = deck.find((deckCard) => deckCard.user_card_id === userCardId);
    if (!selectedDeckCard) return;
    setDeck(deck.filter((deckCard) => deckCard.user_card_id !== userCardId));
    setOwnedCards([
      ...ownedCards,
      {
        id: userCardId,
        user_id: userId,
        card_id: selectedDeckCard.card.id,
        is_locked: false,
        card: selectedDeckCard.card,
      },
    ]);
  };

  /**
   * 検索からカードを選択してデッキに追加
   * @param selectedCard 選択されたカード
   */
  const handleSelectCardFromSearch = (selectedCard: OwnedCardWithDetail) => {
    if (deck.length >= maxDeckSize) return;

    // 空いている最初のスロットを見つける
    const usedPositions = deck.map((deckCard) => deckCard.position).sort((a, b) => a - b);
    let nextPosition = 1;
    for (const pos of usedPositions) {
      if (pos === nextPosition) {
        nextPosition++;
      } else {
        break;
      }
    }

    // デッキに追加
    setDeck([
      ...deck,
      {
        position: nextPosition,
        user_card_id: selectedCard.id,
        card: selectedCard.card,
      },
    ]);

    // 所持カードから削除
    setOwnedCards(ownedCards.filter((ownedCard) => ownedCard.id !== selectedCard.id));
  };

  /* デッキスロット */
  const deckSlots = Array.from({ length: maxDeckSize }, (_, i) => {
    return deck.find((deckCard) => deckCard.position === i + 1) || null;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row max-w-6xl mx-auto gap-4 h-[calc(90vh-5.5rem)] overflow-hidden mb-10">
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
                      id: deckSlotCard.user_card_id,
                      user_id: userId,
                      card_id: deckSlotCard.card.id,
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
          <div className="absolute right-0">
            <CardSearchButton
              onSelectCard={handleSelectCardFromSearch}
              excludeCardIds={deck.map((deckCard) => deckCard.user_card_id)}
            />
          </div>
        </div>

        <div className="border-2 border-dashed rounded-lg p-2 bg-gray-50 border-gray-300 flex-1 overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
            {ownedCards.map((ownedCardItem, index) => (
              <CardComponent
                key={`owned-card-${ownedCardItem.id}-${index}`}
                ownedCard={ownedCardItem}
                onClick={() => handleMoveToDeck(ownedCardItem.id)}
              />
            ))}
            {ownedCards.length === 0 && (
              <div className="col-span-full flex items-center justify-center h-full text-gray-400 mt-10">
                <p>所持カードがありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
