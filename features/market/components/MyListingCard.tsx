"use client";

import { Button } from "@/components/ui/button";
import { CirclePoundSterling, X } from "lucide-react";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";
import { MyListing } from "../types/market";

interface MyListingCardProps {
  listing: MyListing;
  onCancel: (marketId: string) => void;
  isLoading?: boolean;
}

export function MyListingCard({ listing, onCancel, isLoading }: MyListingCardProps) {
  if (!listing.card) return null;

  const japaneseRarity = mapRarityToJapanese(listing.card.rarity);
  const statusText = {
    listed: "出品中",
    sold: "売却済",
    canceled: "キャンセル済",
  }[listing.status];

  const statusColor = {
    listed: "text-green-600",
    sold: "text-blue-600",
    canceled: "text-gray-600",
  }[listing.status];

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-white/80 rounded-lg shadow-md">
      <WordCard
        className="aspect-3/4 w-32 transition-transform duration-300"
        rarity={japaneseRarity}
        cardId={listing.card.card_number}
      >
        {listing.card.text}
      </WordCard>

      <div className="flex flex-col items-center gap-1 w-full">
        <div className={`text-sm font-bold ${statusColor}`}>{statusText}</div>

        <div className="flex items-center gap-1 text-lg font-bold text-amber-600">
          <CirclePoundSterling className="size-5" />
          <span>{listing.price.toString()}</span>
        </div>

        {listing.status === "listed" && (
          <Button
            onClick={() => onCancel(listing._id)}
            disabled={isLoading}
            variant="destructive"
            className="w-full mt-2"
            size="sm"
          >
            <X className="size-4 mr-1" />
            出品取消
          </Button>
        )}
      </div>
    </div>
  );
}
