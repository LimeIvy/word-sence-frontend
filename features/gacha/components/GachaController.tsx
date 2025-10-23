"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { Home, RotateCcw, Star } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { RarityEnum } from "../types/gacha";
import { GachaResultType, GachaState } from "../types/gacha-state";
import { rollGacha10, type GachaRoll } from "../utils/gacha-utils";
import { DischargeCard } from "./dischargeCard";
import { GachaResult10 } from "./gachaResult10";

export function GachaController() {
  const [gachaState, setGachaState] = useState<GachaState>("idle");
  const [gachaResult, setGachaResult] = useState<GachaResultType>(null);
  const addUserCardMutation = useMutation(api.card.addUserCard);

  const handleGachaRoll = async () => {
    setGachaState("rolling");

    setTimeout(async () => {
      const tenRolls: GachaRoll[] = rollGacha10();
      const requests = tenRolls.map((r) => ({
        rarity: r.rarity as RarityEnum,
        cardNumber: r.cardNumber,
      }));

      for (const request of requests) {
        await addUserCardMutation({ cardNumber: request.cardNumber });
      }
      setGachaResult({ requests });
      setGachaState("result");
    }, 1200);
  };

  switch (gachaState) {
    case "idle":
      return (
        <>
          <DischargeCard />
          <Button onClick={handleGachaRoll} className="text-2xl font-bold px-12 py-8 rounded-full">
            <Star className="size-8 animate-pulse" />
            <span>ガチャを引く</span>
          </Button>
        </>
      );
    case "rolling":
      return (
        <div className="flex flex-col items-center space-y-8">
          <div className="text-2xl font-bold">ガチャを引いています...</div>
          <div className="w-32 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg animate-spin shadow-lg">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              ???
            </div>
          </div>
          <Button disabled className="text-2xl font-bold px-12 py-8 rounded-full opacity-50">
            <Star className="size-8" />
            <span>ガチャを引く</span>
          </Button>
        </div>
      );
    case "result":
      return (
        <div className="flex flex-col items-center space-y-8">
          <GachaResult10 result={gachaResult} />
          <div className="flex gap-4">
            <Button onClick={handleGachaRoll} className="text-xl font-bold px-8 py-6 rounded-full">
              <RotateCcw className="size-6 mr-2" />
              <span>もう一度10連</span>
            </Button>
            <Button
              onClick={() => setGachaState("idle")}
              variant="outline"
              className="text-xl font-bold px-8 py-6 rounded-full"
            >
              <Home className="size-6 mr-2" />
              <span>最初の画面に戻る</span>
            </Button>
          </div>
        </div>
      );
    default:
      return null;
  }
}
