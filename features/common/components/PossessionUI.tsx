"use client";
import { useQuery } from "convex/react";
import { CirclePoundSterling } from "lucide-react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";

export const PossessionUI = () => {
  const myUser = useQuery(api.user.getMyUserWithProfile);
  const myCards = useQuery(api.card.getUserCards);
  if (!myUser || !myCards) return null;
  const { profile } = myUser;
  const gem = profile.gem.toString();
  const cardCount = myCards.length;
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2 rounded-xl p-3 border border-primary/30 bg-white/90 shadow-sm">
        <Image src="/cardicon.svg" alt="カード" width={32} height={32} />
        <span className="text-2xl font-bold">{cardCount}</span>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl p-3 border border-primary/30 bg-white/90 shadow-sm">
        <CirclePoundSterling className="size-8" />
        <span className="text-2xl font-bold">{gem}</span>
      </div>
    </div>
  );
};
