"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { Gem, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { WordCard } from "../../common/components/wordCard";
import { mapRarityToJapanese } from "../../deck/utils/rarity-utils";

export function SellCardModal() {
  const [open, setOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [price, setPrice] = useState("");

  const userCards = useQuery(api.card.getUserCardsWithDetails);
  const listCard = useMutation(api.market.listCard);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCardId) {
      toast.error("カードを選択してください");
      return;
    }

    const priceNumber = parseInt(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast.error("有効な価格を入力してください");
      return;
    }

    try {
      await listCard({
        cardId: selectedCardId as Id<"card">,
        price: BigInt(priceNumber),
      });
      toast.success("カードを出品しました！");
      setOpen(false);
      setSelectedCardId(null);
      setPrice("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "出品に失敗しました");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          カードを出品
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>カードを出品する</DialogTitle>
          <DialogDescription>所有しているカードから選んで出品できます</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>カードを選択</Label>
            {userCards === undefined ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : userCards.length === 0 ? (
              <div className="text-center text-gray-500 p-4">所有カードがありません</div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                {userCards.map((userCard) => {
                  if (!userCard) return null;
                  return (
                    <div
                      key={userCard.card_id}
                      onClick={() => setSelectedCardId(userCard.card_id)}
                      className={`cursor-pointer transition-all ${
                        selectedCardId === userCard.card_id
                          ? "ring-4 ring-primary rounded-lg scale-105"
                          : "hover:scale-105"
                      }`}
                    >
                      <WordCard
                        className="aspect-3/4 w-20"
                        rarity={mapRarityToJapanese(userCard.card.rarity)}
                        cardId={userCard.card.card_number}
                        quantity={Number(userCard.quantity)}
                      >
                        {userCard.card.text}
                      </WordCard>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedCardId && (
            <div className="space-y-2">
              <Label htmlFor="price">価格（ジェム）</Label>
              <div className="flex items-center gap-2">
                <Gem className="size-5 text-amber-600" />
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="価格を入力"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={!selectedCardId || !price}>
              出品する
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
