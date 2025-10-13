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
      <Carousel plugins={[plugin.current]} className="w-1/2 max-w-xs" opts={{ loop: true }}>
        <CarouselContent>
          {cards?.map((card) => (
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
      <AllCardList />
    </div>
  );
};
