"use client";

import { useEffect, useState } from "react";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";
import type { GachaResultProps } from "../types/gacha";

export const GachaResult = ({ result }: GachaResultProps) => {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (result) {
      // 結果表示のアニメーション開始
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (!result) return null;

  const { card } = result;
  const rarity = mapRarityToJapanese(card.rarity);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-3xl font-bold text-center">
        {showResult ? "おめでとうございます！" : "結果発表..."}
      </div>

      <div
        className={`transition-all duration-1000 ${
          showResult ? "scale-110 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="relative">
          <WordCard
            rarity={rarity}
            cardId={card.card_number}
            className="w-48 h-64 relative z-10 shadow-2xl"
          >
            {card.text}
          </WordCard>
        </div>
      </div>
    </div>
  );
};
