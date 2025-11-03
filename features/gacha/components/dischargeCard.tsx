"use client";

import { useQuery } from "convex/react";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { api } from "../../../convex/_generated/api";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";
import AllCardList from "./allCardList";

export const DischargeCard = () => {
  const plugin = React.useRef(Autoplay({ delay: 1500, stopOnInteraction: false }));
  const cards = useQuery(api.card.getLegendary);

  return (
    <div className="w-full max-w-xl p-6 flex flex-col items-center gap-4 justify-center border border-primary/30 bg-white/90 rounded-lg">
      <div className="w-1/2 max-w-xs min-h-[400px] flex items-center justify-center">
        {cards === undefined ? (
          // ローディング中のプレースホルダー
          <div className="w-full aspect-3/4 flex items-center justify-center relative rounded-lg overflow-hidden select-none">
            {/* 背景 - 和風スタイル */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.15), rgba(101,84,63,0.2))",
                border: "2px solid rgba(218,165,32,0.3)",
                borderRadius: "0.5rem",
              }}
            />
            {/* 和紙テクスチャ */}
            <div
              className="absolute inset-0 opacity-20"
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
            {/* ローディングアニメーション */}
            <div className="relative flex flex-col items-center justify-center gap-4">
              <div
                className="w-16 h-16 border-4 border-t-amber-600 border-r-amber-500 border-b-amber-400 border-l-transparent rounded-full animate-spin"
                style={{
                  borderWidth: "4px",
                }}
              />
              <div
                className="text-base font-semibold"
                style={{
                  color: "#654321",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                読み込み中...
              </div>
            </div>
          </div>
        ) : cards.length === 0 ? (
          // カードがない場合
          <div className="w-full aspect-3/4 flex items-center justify-center relative rounded-lg overflow-hidden select-none">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.15), rgba(101,84,63,0.2))",
                border: "2px solid rgba(218,165,32,0.3)",
                borderRadius: "0.5rem",
              }}
            />
            <div
              className="text-base font-semibold"
              style={{
                color: "#654321",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              カードが見つかりません
            </div>
          </div>
        ) : (
          <Carousel plugins={[plugin.current]} className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {cards.map((card) => (
                <CarouselItem key={card._id}>
                  <div className="p-1">
                    <WordCard
                      rarity={mapRarityToJapanese(card.rarity)}
                      cardId={card.card_number}
                      className="w-full aspect-3/4 hover:scale-100"
                    >
                      {card.text}
                    </WordCard>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
      <AllCardList />
    </div>
  );
};
