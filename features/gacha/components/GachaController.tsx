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
  const spendGemsMutation = useMutation(api.user.spendGems);

  const handleGachaRoll = async () => {
    try {
      // gemを100消費
      await spendGemsMutation({ amount: 100 });
    } catch (error) {
      setGachaState("idle");
      throw error;
    }
    setGachaState("rolling");

    setTimeout(async () => {
      const tenRolls: GachaRoll[] = rollGacha10();
      const requests = tenRolls.map((r) => ({
        rarity: r.rarity as RarityEnum,
        cardNumber: r.cardNumber,
      }));

      try {
        // 並列実行で高速化
        await Promise.all(
          requests.map((request) => addUserCardMutation({ cardNumber: request.cardNumber }))
        );
      } catch (error) {
        // カード追加に失敗した場合、ジェムを戻す
        await spendGemsMutation({ amount: 100 });
        setGachaState("idle");
        throw error;
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
          {/* タイトル - 和風スタイル */}
          <div
            className="relative text-3xl font-bold px-8 py-4 rounded-lg select-none"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))",
              border: "3px solid rgba(101,67,33,0.6)",
              color: "#654321",
              textShadow: "0 2px 4px rgba(255,255,255,0.5), 0 0 8px rgba(218,165,32,0.3)",
              boxShadow:
                "inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(255,245,230,0.1), 0 8px 16px rgba(0,0,0,0.3)",
            }}
          >
            {/* 和紙テクスチャ */}
            <div
              className="absolute inset-0 rounded-lg opacity-10"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,245,230,0.1) 10px,
                    rgba(255,245,230,0.1) 20px
                  )
                `,
              }}
            />
            {/* 四隅の桜装飾 */}
            <div className="absolute top-2 left-2 text-sm opacity-20 select-none">🌸</div>
            <div className="absolute top-2 right-2 text-sm opacity-20 select-none">🌸</div>
            <div className="absolute bottom-2 left-2 text-sm opacity-20 select-none">🌸</div>
            <div className="absolute bottom-2 right-2 text-sm opacity-20 select-none">🌸</div>
            <span className="relative">ガチャを引いています...</span>
          </div>

          {/* カード型ローディングアニメーション */}
          <div className="relative w-32 h-48">
            <div
              className="absolute inset-0 rounded-lg animate-pulse"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.4), rgba(101,84,63,0.5))",
                border: "3px solid rgba(218,165,32,0.6)",
                boxShadow:
                  "inset 0 4px 8px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.4), 0 0 20px rgba(218,165,32,0.5)",
              }}
            >
              {/* 和紙テクスチャ */}
              <div
                className="absolute inset-0 rounded-lg opacity-20"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(255,245,230,0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(255,245,230,0.2) 0%, transparent 50%)
                  `,
                  backgroundSize: "100px 100px, 120px 120px",
                }}
              />
              {/* 中央の桜アニメーション */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="text-4xl animate-spin select-none"
                  style={{ animationDuration: "2s" }}
                >
                  🌸
                </div>
              </div>
            </div>
          </div>
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
