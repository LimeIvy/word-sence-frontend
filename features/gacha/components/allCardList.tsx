"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rarities, RarityConfig } from "../types/rarity";

// Legendaryカード用のリスト
function LegendaryCardList() {
  const cards = useQuery(api.card.getLegendary);

  if (!cards) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <TabsContent value="極">
      {cards.map((card) => (
        <div key={card._id} className="flex items-center justify-between gap-5 text-xl p-1">
          <div>{card.text}</div>
          <div>{card.card_number}</div>
        </div>
      ))}
    </TabsContent>
  );
}

// ページネーションが必要なクエリ名のみを抽出した型
type PaginatedQueryName = Exclude<(typeof rarities)[number]["queryName"], "getLegendary">;

// Legendaryカード以外のリストコンポーネント
function PaginatedCardList({
  rarityConfig,
}: {
  rarityConfig: RarityConfig & { queryName: PaginatedQueryName };
}) {
  const {
    results: cards,
    status,
    loadMore,
  } = usePaginatedQuery(api.card[rarityConfig.queryName], {}, { initialNumItems: 500 });

  if (!cards) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <TabsContent value={rarityConfig.value}>
      {cards.map((card) => (
        <div key={card._id} className="flex items-center justify-between gap-5 text-xl p-1">
          <div>{card.text}</div>
          <div>{card.card_number}</div>
        </div>
      ))}
      {status === "CanLoadMore" && (
        <div className="py-2 text-center">
          <button
            onClick={() => loadMore(500)}
            className="text-sm text-muted-foreground hover:underline"
          >
            もっと読む
          </button>
        </div>
      )}
    </TabsContent>
  );
}

export default function AllCardList() {
  const [activeTab, setActiveTab] = useState(rarities[0].value);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>排出カード一覧</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>排出カード一覧</DialogTitle>
            <DialogDescription asChild>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className=" mt-5 flex items-center gap-5"
              >
                <TabsList>
                  {rarities.map((rarity) => (
                    <TabsTrigger key={rarity.value} value={rarity.value}>
                      {rarity.value}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="max-h-[500px] overflow-y-auto mt-1 px-4 py-2 border">
                  {rarities.map((rarity) => {
                    if (rarity.queryName === "getLegendary") {
                      return <LegendaryCardList key={rarity.value} />;
                    } else {
                      return (
                        <PaginatedCardList
                          key={rarity.value}
                          rarityConfig={rarity as RarityConfig & { queryName: PaginatedQueryName }}
                        />
                      );
                    }
                  })}
                </div>
              </Tabs>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
