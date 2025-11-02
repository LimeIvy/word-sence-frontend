"use client";

import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";
import type { GachaResultType } from "../types/gacha-state";

export const GachaResult10 = ({ result }: { result: GachaResultType }) => {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setShowResult(true), 400);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const requests = useMemo(() => {
    return result?.requests.map((r) => ({ rarity: r.rarity, cardNumber: r.cardNumber })) ?? [];
  }, [result?.requests]);

  const cards = useQuery(api.card.getCardsByDetails, requests.length > 0 ? { requests } : "skip");

  if (!result) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* タイトル - 和風スタイル */}
      <div
        className={`relative px-8 py-4 rounded-lg transition-all duration-500 select-none ${
          showResult ? "opacity-100" : "opacity-80"
        }`}
        style={{
          background: showResult
            ? "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))"
            : "linear-gradient(135deg, rgba(139,115,85,0.25), rgba(101,84,63,0.3))",
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
        <span className="relative text-3xl font-bold">
          {showResult ? "10連の結果！" : "結果を準備中..."}
        </span>
        {!showResult && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 border-4 border-t-amber-600 border-r-amber-500 border-b-amber-400 border-l-transparent rounded-full animate-spin"
              style={{ borderWidth: "3px" }}
            />
          </div>
        )}
      </div>

      {/* カードグリッド */}
      {showResult && cards ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 transition-opacity duration-700"
          style={{ opacity: showResult ? 1 : 0 }}
        >
          {cards.map((card, idx) => {
            return (
              <div key={card._id} className="relative">
                <div
                  className="relative z-10 transition-transform duration-500"
                  style={{
                    transform: showResult ? "scale(1)" : "scale(0.9)",
                    transitionDelay: `${idx * 50}ms`,
                  }}
                >
                  <WordCard
                    rarity={mapRarityToJapanese(card.rarity)}
                    cardId={card.card_number}
                    className="w-32 h-44"
                  >
                    {card.text}
                  </WordCard>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // ローディング中のプレースホルダー（カードと同じサイズ）
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="relative w-32 h-44 rounded-lg animate-pulse select-none"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.2), rgba(101,84,63,0.25))",
                border: "2px solid rgba(218,165,32,0.3)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
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
              {/* 中央の小さな桜 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl opacity-30 animate-pulse select-none">🌸</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
