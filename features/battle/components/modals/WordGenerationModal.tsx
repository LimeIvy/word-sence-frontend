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
import { Loader2, Minus, Plus, Sparkles } from "lucide-react";
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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5" />
            単語生成
          </DialogTitle>
          <DialogDescription>
            +ゾーンと-ゾーンにカードを配置して新しい単語を生成します（合計2-5枚）
            <br />
            <span className="text-xs text-gray-500">
              💡 左クリックで+ゾーン、右クリックで-ゾーンに追加
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 flex-1 overflow-y-auto min-h-0">
          {/* +ゾーン */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              <Label className="text-base font-semibold">+ゾーン（意味を加算）</Label>
              <span className="text-sm text-gray-600">{positiveCardIds.length}枚選択中</span>
            </div>
            <div className="flex justify-center gap-3 px-4 py-6 bg-green-50 rounded-lg border-2 border-dashed border-green-300 min-h-[160px]">
              {positiveCardIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs">ここにカードを配置</span>
                </div>
              ) : (
                positiveCardIds.map((cardId) => {
                  const card = cards.find((c) => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      className="relative transition-all hover:scale-105"
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
            <div className="flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-600" />
              <Label className="text-base font-semibold">-ゾーン（意味を減算）</Label>
              <span className="text-sm text-gray-600">{negativeCardIds.length}枚選択中</span>
            </div>
            <div
              className="flex justify-center gap-3 px-4 py-6 bg-red-50 rounded-lg border-2 border-dashed border-red-300 min-h-[160px] cursor-pointer"
              onClick={(e) => {
                // 未選択カードを右クリックまたはShift+クリックで-ゾーンに追加する機能は、未選択カードエリアで処理
                if (e.target === e.currentTarget) {
                  return;
                }
              }}
            >
              {negativeCardIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span className="text-2xl mb-1">-</span>
                  <span className="text-xs">ここにカードを配置</span>
                </div>
              ) : (
                negativeCardIds.map((cardId) => {
                  const card = cards.find((c) => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      className="relative transition-all hover:scale-105"
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

          {/* 未選択カード */}
          {unselectedCards.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">手札から選択</Label>
              <div className="flex justify-center gap-3 px-4 py-4 bg-gray-50 rounded-lg border border-gray-300 min-h-[120px] flex-wrap">
                {unselectedCards.map((card) => (
                  <div
                    key={card.id}
                    className="relative transition-all hover:scale-105 cursor-pointer"
                    onClick={() => {
                      handlePositiveCardClick(card.id);
                    }}
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

          {/* 選択状況表示とベクトル演算プレビューを横並びに */}
          <div className="grid grid-cols-2 gap-4">
            {/* 選択状況表示 */}
            <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-blue-900">選択状況</span>
                <span className="text-blue-700">{totalCards}枚</span>
              </div>
              {!canGenerate && totalCards > 0 && (
                <div className="mt-2 text-xs text-red-600">
                  {totalCards < 2
                    ? "カードを2枚以上選択してください"
                    : "カードは最大5枚まで選択できます"}
                </div>
              )}
            </div>

            {/* ベクトル演算プレビュー */}
            {canGenerate && (
              <div className="px-4 py-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm font-semibold text-purple-900 mb-2">
                  ベクトル演算プレビュー
                </div>
                <div className="text-xs text-purple-700 space-y-1">
                  <div>
                    +:{" "}
                    {positiveCardIds.map((id) => cards.find((c) => c.id === id)?.name).join(" + ")}
                  </div>
                  {negativeCardIds.length > 0 && (
                    <div>
                      -:{" "}
                      {negativeCardIds
                        .map((id) => cards.find((c) => c.id === id)?.name)
                        .join(" + ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            キャンセル
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isLoading}
            className="flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.95), rgba(147,51,234,0.9))",
              border: "2px solid rgba(192,132,252,0.7)",
              color: "white",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
