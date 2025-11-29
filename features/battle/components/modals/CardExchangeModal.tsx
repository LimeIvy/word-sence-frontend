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
      <DialogContent
        className="max-w-4xl max-h-[85vh] overflow-y-auto border-4 border-amber-700/50 bg-[#FDF6E3]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a373' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <DialogHeader className="border-b-2 border-amber-700/20 pb-4">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-black text-amber-900 tracking-widest">
            <RefreshCw className="w-6 h-6 text-amber-600" />
            <span style={{ fontFamily: "'Noto Serif JP', serif" }}>カード交換</span>
            <RefreshCw className="w-6 h-6 text-amber-600" />
          </DialogTitle>
          <DialogDescription className="text-center text-amber-800/70 font-medium mt-2">
            不要なカードを破棄し、新たな手札を補充します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* 手札カード選択エリア */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <Label className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-600 rounded-full" />
                破棄するカード
              </Label>
              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                {selectedCardIds.length} / 5 枚選択中
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 px-6 py-8 bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-300/50 min-h-[200px] shadow-inner">
              {cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-amber-400/50">
                  <span className="text-5xl mb-4 select-none opacity-50">🎴</span>
                  <span className="text-lg font-bold">手札がありません</span>
                </div>
              ) : (
                cards.map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      className={`relative transition-all duration-300 ${
                        isSelected
                          ? "scale-110 z-10 -translate-y-2"
                          : "hover:scale-105 hover:-translate-y-1"
                      }`}
                      onClick={() => handleCardClick(card.id)}
                    >
                      <HandCard
                        card={card}
                        selected={isSelected}
                        disabled={isLoading}
                        onCardClick={() => handleCardClick(card.id)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ドロー元選択 */}
          <div className="space-y-4">
            <Label className="text-lg font-bold text-amber-900 flex items-center gap-2 px-2">
              <span className="w-1 h-6 bg-amber-600 rounded-full" />
              補充元を選択
            </Label>
            <RadioGroup
              value={drawSource}
              onValueChange={(value) => setDrawSource(value as "deck" | "pool")}
              className="grid grid-cols-2 gap-6"
            >
              <div className="relative">
                <RadioGroupItem
                  value="deck"
                  id="deck"
                  disabled={isLoading}
                  className="peer sr-only"
                />
                <Label
                  htmlFor="deck"
                  className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all h-full
                    ${
                      drawSource === "deck"
                        ? "bg-amber-100 border-amber-600 shadow-md"
                        : "bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                    }
                  `}
                >
                  <div className="text-4xl select-none mb-1">🎴</div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-amber-900 mb-1">デッキから</div>
                    <div
                      className={`text-sm font-bold ${
                        deckRemaining >= selectedCardIds.length ? "text-amber-700" : "text-red-600"
                      }`}
                    >
                      残り {deckRemaining} 枚
                    </div>
                  </div>
                  {drawSource === "deck" && (
                    <div className="absolute top-3 right-3 text-amber-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem
                  value="pool"
                  id="pool"
                  disabled={isLoading}
                  className="peer sr-only"
                />
                <Label
                  htmlFor="pool"
                  className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all h-full
                    ${
                      drawSource === "pool"
                        ? "bg-amber-100 border-amber-600 shadow-md"
                        : "bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                    }
                  `}
                >
                  <div className="text-4xl select-none mb-1">🌟</div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-amber-900 mb-1">全プールから</div>
                    <div className="text-sm text-amber-700 font-medium">ランダムに補充</div>
                  </div>
                  {drawSource === "pool" && (
                    <div className="absolute top-3 right-3 text-amber-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </Label>
              </div>
            </RadioGroup>

            {drawSource === "deck" && deckRemaining < selectedCardIds.length && (
              <div className="text-sm font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-center gap-2 animate-pulse">
                <XCircle className="w-5 h-5" />
                デッキの残り枚数が不足しています
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-4 border-t-2 border-amber-700/20 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-bold"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleExchange}
            disabled={!canExchange || !canDrawFromDeck || isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                !canExchange || !canDrawFromDeck
                  ? undefined
                  : "linear-gradient(135deg, rgba(217,119,6,0.95), rgba(180,83,9,0.9))",
              boxShadow:
                !canExchange || !canDrawFromDeck
                  ? undefined
                  : "0 4px 15px rgba(217,119,6,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
            }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                交換中...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                交換する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
