"use client";

import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MarketCard } from "./MarketCard";

export function MarketListings() {
  const listings = useQuery(api.market.getMarketListings, { status: "listed" });
  const buyCard = useMutation(api.market.buyCard);
  const currentUser = useQuery(api.user.getMyUser);

  const handleBuy = async (marketId: string) => {
    try {
      await buyCard({ marketId: marketId as Id<"market"> });
      toast.success("カードを購入しました！");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "購入に失敗しました");
    }
  };

  if (listings === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        現在出品されているカードはありません
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {listings.map((listing) => (
        <MarketCard
          key={listing._id}
          listing={listing}
          onBuy={handleBuy}
          currentUserId={currentUser?._id}
        />
      ))}
    </div>
  );
}
