"use client";

import { useQuery } from "convex/react";
import { ArrowLeft, CirclePoundSterling } from "lucide-react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { SellCardModal } from "./SellCardModal";

export function MarketHeader() {
  const userWithProfile = useQuery(api.user.getMyUserWithProfile);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-full p-2 border border-primary/30 bg-white/90 text-xl shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:scale-103 active:scale-90"
            >
              <ArrowLeft className="size-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">マーケット</h1>
          </div>

          <div className="flex items-center gap-4">
            {userWithProfile?.profile && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
                <CirclePoundSterling className="size-5" />
                <span className="font-bold text-amber-800">
                  {userWithProfile.profile.gem.toString()}
                </span>
              </div>
            )}
            <SellCardModal />
          </div>
        </div>
      </div>
    </header>
  );
}
