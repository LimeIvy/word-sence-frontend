"use client";

import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MyListingCard } from "./MyListingCard";

export function MyListings() {
  const myListings = useQuery(api.market.getMyListings);
  const cancelListing = useMutation(api.market.cancelListing);

  const handleCancel = async (marketId: string) => {
    try {
      await cancelListing({ marketId: marketId as Id<"market"> });
      toast.success("出品を取り下げました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "取り下げに失敗しました");
    }
  };

  if (myListings === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (myListings.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">出品履歴がありません</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {myListings.map((listing) => (
        <MyListingCard key={listing._id} listing={listing} onCancel={handleCancel} />
      ))}
    </div>
  );
}
