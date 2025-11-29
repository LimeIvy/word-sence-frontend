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
import { Loader2, Minus, Plus, Sparkles, XCircle } from "lucide-react";
import { useState } from "react";
import type { Card } from "../../../common/types/card";
import { HandCard } from "../HandCard";

export interface WordGenerationModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** 手札のカード */
  cards: Card[];
  /** 単語生成実行時のコールバック */
  onGenerate: (positiveCards: string[], negativeCards: string[]) => Promise<void>;
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * 単語生成モーダルコンポーネント
 */
export function WordGenerationModal({
  isOpen,
  onClose,
  cards,
  onGenerate,
  isLoading = false,
}: WordGenerationModalProps) {
  const [positiveCardIds, setPositiveCardIds] = useState<string[]>([]);
  const [negativeCardIds, setNegativeCardIds] = useState<string[]>([]);

  const handlePositiveCardClick = (cardId: string) => {
    if (positiveCardIds.includes(cardId)) {
      setPositiveCardIds(positiveCardIds.filter((id) => id !== cardId));
    } else {
      // すでにnegativeに含まれている場合は移動
      if (negativeCardIds.includes(cardId)) {
        setNegativeCardIds(negativeCardIds.filter((id) => id !== cardId));
      }
      setPositiveCardIds([...positiveCardIds, cardId]);
    }
  };

  const handleNegativeCardClick = (cardId: string) => {
    if (negativeCardIds.includes(cardId)) {
      setNegativeCardIds(negativeCardIds.filter((id) => id !== cardId));
    } else {
      // すでにpositiveに含まれている場合は移動
      if (positiveCardIds.includes(cardId)) {
        setPositiveCardIds(positiveCardIds.filter((id) => id !== cardId));
      }
      setNegativeCardIds([...negativeCardIds, cardId]);
    }
  };

  const handleGenerate = async () => {
    const totalCards = positiveCardIds.length + negativeCardIds.length;
    if (totalCards < 2 || totalCards > 5) {
      return;
    }

    try {
      await onGenerate(positiveCardIds, negativeCardIds);
      // 成功したらモーダルを閉じて選択をリセット
      setPositiveCardIds([]);
      setNegativeCardIds([]);
      onClose();
    } catch (error) {
      // エラーは親コンポーネントで処理
      console.error("単語生成エラー:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPositiveCardIds([]);
      setNegativeCardIds([]);
      onClose();
    }
  };

  const totalCards = positiveCardIds.length + negativeCardIds.length;
  const canGenerate = totalCards >= 2 && totalCards <= 5;

  // 選択されていないカード
  const unselectedCards = cards.filter(
    (card) => !positiveCardIds.includes(card.id) && !negativeCardIds.includes(card.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col border-4 border-amber-700/50 bg-[#FDF6E3]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a373' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <DialogHeader className="flex-shrink-0 border-b-2 border-amber-700/20 pb-4">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-black text-amber-900 tracking-widest">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <span style={{ fontFamily: "'Noto Serif JP', serif" }}>単語生成</span>
            <Sparkles className="w-6 h-6 text-amber-600" />
          </DialogTitle>
          <DialogDescription className="text-center text-amber-800/70 font-medium mt-2">
            言葉を組み合わせ、新たな意味を創造します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 flex-1 overflow-y-auto min-h-0 px-4">
          <div className="grid grid-cols-2 gap-8">
            {/* +ゾーン */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-600" />
                  加算
                </Label>
                <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  {positiveCardIds.length}枚
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 px-4 py-6 bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-300/50 min-h-[200px] shadow-inner">
                {positiveCardIds.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center h-40 text-amber-400/50">
                    <span className="text-4xl mb-2 select-none opacity-50">+</span>
                    <span className="text-sm font-bold">意味を加えるカード</span>
                  </div>
                ) : (
                  positiveCardIds.map((cardId) => {
                    const card = cards.find((c) => c.id === cardId);
                    if (!card) return null;
                    return (
                      <div
                        key={cardId}
                        className="relative transition-all hover:scale-105 hover:-translate-y-1"
                        onClick={() => handlePositiveCardClick(cardId)}
                      >
                        <HandCard
                          card={card}
                          selected={true}
                          disabled={isLoading}
                          onCardClick={() => handlePositiveCardClick(cardId)}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* -ゾーン */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <Minus className="w-5 h-5 text-amber-600" />
                  減算
                </Label>
                <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  {negativeCardIds.length}枚
                </span>
              </div>
              <div
                className="flex flex-wrap justify-center gap-8 px-4 py-6 bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-300/50 min-h-[200px] shadow-inner cursor-pointer hover:bg-amber-50 transition-colors"
                onClick={(e) => {
                  if (e.target === e.currentTarget) return;
                }}
              >
                {negativeCardIds.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center h-40 text-amber-400/50">
                    <span className="text-4xl mb-2 select-none opacity-50">-</span>
                    <span className="text-sm font-bold">意味を引くカード</span>
                  </div>
                ) : (
                  negativeCardIds.map((cardId) => {
                    const card = cards.find((c) => c.id === cardId);
                    if (!card) return null;
                    return (
                      <div
                        key={cardId}
                        className="relative transition-all hover:scale-105 hover:-translate-y-1"
                        onClick={() => handleNegativeCardClick(cardId)}
                      >
                        <HandCard
                          card={card}
                          selected={true}
                          disabled={isLoading}
                          onCardClick={() => handleNegativeCardClick(cardId)}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 未選択カード */}
          {unselectedCards.length > 0 && (
            <div className="space-y-3 pt-4 border-t-2 border-amber-700/20">
              <Label className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-600 rounded-full" />
                手札から選択
                <span className="text-xs font-normal text-amber-700 ml-2">
                  (左クリック: +ゾーン / 右クリック: -ゾーン)
                </span>
              </Label>
              <div className="flex justify-center gap-4 px-4 py-6 bg-white/50 rounded-xl border border-amber-200 min-h-[120px] flex-wrap shadow-sm">
                {unselectedCards.map((card) => (
                  <div
                    key={card.id}
                    className="relative transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handlePositiveCardClick(card.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleNegativeCardClick(card.id);
                    }}
                  >
                    <HandCard
                      card={card}
                      disabled={isLoading}
                      onCardClick={() => handlePositiveCardClick(card.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* プレビューエリア */}
          <div className="bg-white/80 rounded-xl p-4 border border-amber-200 shadow-sm">
            <div className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              生成プレビュー
            </div>
            <div className="font-mono text-lg text-amber-800 flex flex-wrap items-center gap-2">
              {positiveCardIds.length === 0 && negativeCardIds.length === 0 && (
                <span className="text-stone-400 text-sm">カードを選択してください</span>
              )}
              {positiveCardIds.map((id, i) => (
                <span key={id} className="bg-amber-50 px-2 py-1 rounded border border-amber-100">
                  {i > 0 && <span className="text-amber-400 mr-1">+</span>}
                  {cards.find((c) => c.id === id)?.name}
                </span>
              ))}
              {negativeCardIds.map((id) => (
                <span key={id} className="bg-amber-50 px-2 py-1 rounded border border-amber-100">
                  <span className="text-amber-400 mr-1">-</span>
                  {cards.find((c) => c.id === id)?.name}
                </span>
              ))}
            </div>
            {!canGenerate && totalCards > 0 && (
              <div className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {totalCards < 2 ? "あと1枚以上必要です" : "最大5枚までです"}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t-2 border-amber-700/20 pt-4 sm:justify-center gap-4">
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
            onClick={handleGenerate}
            disabled={!canGenerate || isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: !canGenerate
                ? undefined
                : "linear-gradient(135deg, rgba(217,119,6,0.95), rgba(180,83,9,0.9))",
              boxShadow: !canGenerate
                ? undefined
                : "0 4px 15px rgba(217,119,6,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                生成する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
