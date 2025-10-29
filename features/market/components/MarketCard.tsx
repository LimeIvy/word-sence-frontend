"use client";

import { Button } from "@/components/ui/button";
import { Gem, ShoppingCart } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";
import { MarketListingWithDetails } from "../types/market";

interface MarketCardProps {
  listing: MarketListingWithDetails;
  onBuy: (marketId: Id<"market">) => void;
  isLoading?: boolean;
  currentUserId?: Id<"user">;
}

export function MarketCard({ listing, onBuy, isLoading, currentUserId }: MarketCardProps) {
  const japaneseRarity = mapRarityToJapanese(listing.card.rarity);
  const isOwnListing = listing.user_id === currentUserId;

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <WordCard
        className="aspect-3/4 w-32 transition-transform duration-300 hover:scale-105"
        rarity={japaneseRarity}
        cardId={listing.card.card_number}
      >
        {listing.card.text}
      </WordCard>

      <div className="flex flex-col items-center gap-1 w-full">
        <div className="flex items-center gap-1 text-lg font-bold text-amber-600">
          <Gem className="size-5" />
          <span>{listing.price.toString()}</span>
        </div>

        {listing.seller?.profile && (
          <div className="text-xs text-gray-600">出品者: {listing.seller.profile.name}</div>
        )}

        <Button
          onClick={() => onBuy(listing._id)}
          disabled={isLoading || isOwnListing}
          className="w-full mt-2"
          size="sm"
        >
          {isOwnListing ? (
            "自分の出品"
          ) : (
            <>
              <ShoppingCart className="size-4 mr-1" />
              購入
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
