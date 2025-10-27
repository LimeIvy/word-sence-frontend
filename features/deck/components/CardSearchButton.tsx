"use client";

import { SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { OwnedCardWithDetail } from "../types/deck";
import { mapRarityToJapanese } from "../utils/rarity-utils";
import { CardItem } from "./CardItem";

interface CardSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (card: OwnedCardWithDetail) => void;
  excludeCardIds: string[];
  ownedCards: OwnedCardWithDetail[];
}

const CardSearchModal = ({
  isOpen,
  onClose,
  onSelectCard,
  excludeCardIds,
  ownedCards,
}: CardSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);

  if (!isOpen) return null;

  // 検索対象のカードをフィルタリング
  const filteredCards = ownedCards.filter((card) => {
    const matchesSearch = card.card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity =
      selectedRarities.length === 0 || selectedRarities.includes(card.card.rarity);
    const notExcluded = !excludeCardIds.includes(card.id);
    return matchesSearch && matchesRarity && notExcluded;
  });

  const rarities = ["common", "rare", "super_rare", "epic", "legendary"];

  // レアリティの選択/解除を切り替える
  const toggleRarity = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    );
  };

  // すべて選択/解除を切り替える
  const toggleAllRarities = () => {
    setSelectedRarities(selectedRarities.length === rarities.length ? [] : [...rarities]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">所持カード検索</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* 検索バー */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="カード名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* フィルター */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleAllRarities}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedRarities.length === rarities.length
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {selectedRarities.length === rarities.length ? "すべて解除" : "すべて選択"}
              </button>
              {rarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => toggleRarity(rarity)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedRarities.includes(rarity)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {mapRarityToJapanese(rarity)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* カード一覧 */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredCards.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              検索条件に一致するカードがありません
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
              {filteredCards.map((card, index) => {
                // 有効なキーを生成（card.idがNaNや無効な値の場合はindexを使用）
                const validKey =
                  card.id && !isNaN(Number(card.id)) ? `${card.id}-${index}` : `card-${index}`;
                return (
                  <div key={validKey} onClick={() => onSelectCard(card)}>
                    <CardItem ownedCard={card} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredCards.length}件のカードが見つかりました
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardSearchButton = ({
  onSelectCard,
  excludeCardIds = [],
  ownedCards,
}: {
  onSelectCard: (card: OwnedCardWithDetail) => void;
  excludeCardIds?: string[];
  ownedCards: OwnedCardWithDetail[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 cursor-pointer hover:scale-105"
        title="カード検索"
      >
        <SearchIcon className="w-6 h-6" />
      </button>

      <CardSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCard={onSelectCard}
        excludeCardIds={excludeCardIds}
        ownedCards={ownedCards}
      />
    </>
  );
};
