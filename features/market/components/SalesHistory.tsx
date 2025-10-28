"use client";

import { useQuery } from "convex/react";
import { Gem, Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";

export function SalesHistory() {
  const sales = useQuery(api.market.getMySales);

  if (sales === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">販売履歴がありません</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {sales.map((sale) => {
        if (!sale.card) return null;

        const japaneseRarity = mapRarityToJapanese(sale.card.rarity);

        return (
          <div
            key={sale._id}
            className="flex flex-col items-center gap-2 p-3 bg-white/80 rounded-lg shadow-md"
          >
            <WordCard
              className="aspect-3/4 w-32"
              rarity={japaneseRarity}
              cardId={sale.card.card_number}
            >
              {sale.card.text}
            </WordCard>

            <div className="flex flex-col items-center gap-1 w-full">
              <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                <Gem className="size-5" />
                <span>+{sale.price.toString()}</span>
              </div>

              {sale.buyer && (
                <div className="text-xs text-gray-600">購入者: {sale.buyer.email}</div>
              )}

              <div className="text-xs text-gray-500">
                {new Date(sale.created_at).toLocaleDateString("ja-JP")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
