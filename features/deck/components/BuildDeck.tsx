"use client";

import { useEffect, useState } from "react";
import { userCardMockDataList } from "../mock/userMockData";
import { DeckCardDetail, OwnedCardWithDetail } from "../types/deck";
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
    const activeOwnedCard = ownedCards.find((oc) => oc.id === userCardId);
    if (!activeOwnedCard) return;

    // 空いている最初のスロットを見つける
    const usedPositions = deck.map((dc) => dc.position).sort((a, b) => a - b);
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
        card: activeOwnedCard.card,
      },
    ]);
    setOwnedCards(ownedCards.filter((oc) => oc.id !== userCardId));
  };

  /**
   * デッキから所持カードに移動する
   * @param userCardId 所持カードID
   */
  const handleMoveToOwned = async (userCardId: number) => {
    const deckCard = deck.find((dc) => dc.user_card_id === userCardId);
    if (!deckCard) return;
    setDeck(deck.filter((dc) => dc.user_card_id !== userCardId));
    setOwnedCards([
      ...ownedCards,
      {
        id: userCardId,
        user_id: userId,
        card_id: deckCard.card.id,
        is_locked: false,
        card: deckCard.card,
      },
    ]);
  };

  /* デッキスロット */
  const deckSlots = Array.from({ length: maxDeckSize }, (_, i) => {
    return deck.find((dc) => dc.position === i + 1) || null;
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
            {deckSlots.map((deckCard, index) => (
              <div key={`deck-slot-${index}`}>
                {deckCard ? (
                  <CardComponent
                    ownedCard={{
                      id: deckCard.user_card_id,
                      user_id: userId,
                      card_id: deckCard.card.id,
                      card: deckCard.card,
                    }}
                    onDoubleClick={() => handleMoveToOwned(deckCard.user_card_id)}
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
        <h2 className="flex items-center justify-center text-lg font-bold mb-5">所持カード</h2>
        <div className="border-2 border-dashed rounded-lg p-2 bg-gray-50 border-gray-300 flex-1 overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
            {ownedCards.map((ownedCard, index) => (
              <CardComponent
                key={`owned-card-${ownedCard.id}-${index}`}
                ownedCard={ownedCard}
                onDoubleClick={() => handleMoveToDeck(ownedCard.id)}
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
