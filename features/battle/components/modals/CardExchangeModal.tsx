"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import type { Card } from "../../../common/types/card";
import { HandCard } from "../HandCard";

export interface CardExchangeModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** 手札のカード */
  cards: Card[];
  /** デッキの残り枚数 */
  deckRemaining: number;
  /** カード交換実行時のコールバック */
  onExchange: (discardIds: string[], drawSource: "deck" | "pool") => Promise<void>;
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * カード交換モーダルコンポーネント
 */
export function CardExchangeModal({
  isOpen,
  onClose,
  cards,
  deckRemaining,
  onExchange,
  isLoading = false,
}: CardExchangeModalProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [drawSource, setDrawSource] = useState<"deck" | "pool">("deck");

  const handleCardClick = (cardId: string) => {
    if (selectedCardIds.includes(cardId)) {
      setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId));
    } else {
      if (selectedCardIds.length >= 5) {
        return; // 最大5枚まで
      }
      setSelectedCardIds([...selectedCardIds, cardId]);
    }
  };

  const handleExchange = async () => {
    if (selectedCardIds.length === 0) {
      return;
    }

    try {
      await onExchange(selectedCardIds, drawSource);
      // 成功したらモーダルを閉じて選択をリセット
      setSelectedCardIds([]);
      setDrawSource("deck");
      onClose();
    } catch (error) {
      // エラーは親コンポーネントで処理
      console.error("カード交換エラー:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedCardIds([]);
      setDrawSource("deck");
      onClose();
    }
  };

  const canExchange = selectedCardIds.length > 0 && selectedCardIds.length <= 5;
  const canDrawFromDeck = drawSource === "deck" ? deckRemaining >= selectedCardIds.length : true;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RefreshCw className="w-5 h-5" />
            カード交換
          </DialogTitle>
          <DialogDescription>
            破棄するカードを選択し、ドロー元を選んでください（1-5枚）
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 手札カード選択エリア */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">破棄するカードを選択</Label>
              <span className="text-sm text-gray-600">
                {selectedCardIds.length}枚選択中（最大5枚）
              </span>
            </div>
            <div className="flex justify-center gap-3 px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px]">
              {cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span className="text-4xl mb-2">🎴</span>
                  <span className="text-sm">手札がありません</span>
                </div>
              ) : (
                cards.map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      className={`relative transition-all ${
                        isSelected ? "scale-110 z-10" : "hover:scale-105"
                      }`}
                      onClick={() => handleCardClick(card.id)}
                    >
                      <HandCard
                        card={card}
                        selected={isSelected}
                        disabled={isLoading}
                        onCardClick={() => handleCardClick(card.id)}
                      />
                      {/* 選択インジケーター */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg z-20">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ドロー元選択 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ドロー元を選択</Label>
            <RadioGroup
              value={drawSource}
              onValueChange={(value) => setDrawSource(value as "deck" | "pool")}
            >
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deck" id="deck" disabled={isLoading} />
                  <Label
                    htmlFor="deck"
                    className="cursor-pointer flex items-center gap-2"
                    style={{
                      color: deckRemaining >= selectedCardIds.length ? "#2563EB" : "#DC2626",
                    }}
                  >
                    <span className="text-xl">🎴</span>
                    <span>デッキから（残り{deckRemaining}枚）</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pool" id="pool" disabled={isLoading} />
                  <Label htmlFor="pool" className="cursor-pointer flex items-center gap-2">
                    <span className="text-xl">🌟</span>
                    <span>全プールから</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {drawSource === "deck" && deckRemaining < selectedCardIds.length && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                デッキの残り枚数が不足しています。全プールからドローするか、破棄枚数を減らしてください。
              </div>
            )}
          </div>

          {/* 選択したカードの表示 */}
          {selectedCardIds.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">選択中のカード</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                {selectedCardIds.map((cardId) => {
                  const card = cards.find((c) => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-amber-300"
                    >
                      <span className="text-sm font-medium">{card.name}</span>
                      <button
                        onClick={() => handleCardClick(cardId)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            キャンセル
          </Button>
          <Button
            onClick={handleExchange}
            disabled={!canExchange || !canDrawFromDeck || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                交換中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                交換する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
