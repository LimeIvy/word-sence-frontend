"use client";

import { useQuery } from "convex/react";
import { CirclePoundSterling, Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";

export function PurchaseHistory() {
  const purchases = useQuery(api.market.getMyPurchases);

  if (purchases === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">購入履歴がありません</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {purchases.map((purchase) => {
        if (!purchase.card) return null;

        const japaneseRarity = mapRarityToJapanese(purchase.card.rarity);

        return (
          <div
            key={purchase._id}
            className="flex flex-col items-center gap-2 p-3 bg-white/80 rounded-lg shadow-md"
          >
            <WordCard
              className="aspect-3/4 w-32"
              rarity={japaneseRarity}
              cardId={purchase.card.card_number}
            >
              {purchase.card.text}
            </WordCard>

            <div className="flex flex-col items-center gap-1 w-full">
              <div className="flex items-center gap-1 text-lg font-bold text-amber-600">
                <CirclePoundSterling className="size-5" />
                <span>{purchase.price.toString()}</span>
              </div>

              {purchase.seller?.profile && (
                <div className="text-xs text-gray-600">売主: {purchase.seller.profile.name}</div>
              )}

              <div className="text-xs text-gray-500">
                {new Date(purchase.created_at).toLocaleDateString("ja-JP")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
