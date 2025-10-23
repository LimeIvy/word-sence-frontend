"use client";

import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";
import type { GachaResultType } from "../types/gacha-state";

export const GachaResult10 = ({ result }: { result: GachaResultType }) => {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setShowResult(true), 400);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const requests = useMemo(() => {
    return result?.requests.map((r) => ({ rarity: r.rarity, cardNumber: r.cardNumber })) ?? [];
  }, [result?.requests]);

  const cards = useQuery(api.card.getCardsByDetails, requests.length > 0 ? { requests } : "skip");

  if (!result) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-3xl font-bold text-center">
        {showResult ? "10連の結果！" : "結果を準備中..."}
      </div>

      <div
        className={`grid grid-cols-2 sm:grid-cols-5 gap-4 transition-opacity duration-700 ${
          showResult ? "opacity-100" : "opacity-0"
        }`}
      >
        {cards?.map((card, idx) => {
          return (
            <div key={card._id} className="relative">
              <div
                className={`relative z-10 transition-transform duration-500 ${
                  showResult ? "scale-100" : "scale-90"
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <WordCard
                  rarity={mapRarityToJapanese(card.rarity)}
                  cardId={card.card_number}
                  className="w-32 h-44"
                >
                  {card.text}
                </WordCard>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
