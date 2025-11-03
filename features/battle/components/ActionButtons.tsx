"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";

export interface ActionButtonsProps {
  /** カード交換可能か */
  canExchange?: boolean;
  /** 単語生成可能か */
  canGenerate?: boolean;
  /** カード交換クリック時のコールバック */
  onExchangeClick?: () => void;
  /** 単語生成クリック時のコールバック */
  onGenerateClick?: () => void;
  /** ローディング状態 */
  isLoading?: boolean;
  /** クラス名 */
  className?: string;
}

/**
 * アクションボタン群コンポーネント
 */
export function ActionButtons({
  canExchange = true,
  canGenerate = true,
  onExchangeClick,
  onGenerateClick,
  isLoading = false,
  className = "",
}: ActionButtonsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* カード交換ボタン */}
      <Button
        onClick={onExchangeClick}
        disabled={!canExchange || isLoading}
        variant="outline"
        size="lg"
        className="flex items-center gap-2 min-w-[160px]"
        style={{
          background: canExchange
            ? "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.9))"
            : "rgba(156,163,175,0.3)",
          border: canExchange
            ? "2px solid rgba(96,165,250,0.7)"
            : "2px solid rgba(156,163,175,0.5)",
          color: canExchange ? "white" : "rgba(107,114,128,0.7)",
          boxShadow: canExchange
            ? "0 4px 12px rgba(59,130,246,0.4), inset 0 1px 2px rgba(255,255,255,0.3)"
            : "none",
        }}
      >
        <RefreshCw className="w-5 h-5" />
        <span className="font-bold">カード交換</span>
      </Button>

      {/* 単語生成ボタン */}
      <Button
        onClick={onGenerateClick}
        disabled={!canGenerate || isLoading}
        variant="outline"
        size="lg"
        className="flex items-center gap-2 min-w-[160px]"
        style={{
          background: canGenerate
            ? "linear-gradient(135deg, rgba(168,85,247,0.95), rgba(147,51,234,0.9))"
            : "rgba(156,163,175,0.3)",
          border: canGenerate
            ? "2px solid rgba(192,132,252,0.7)"
            : "2px solid rgba(156,163,175,0.5)",
          color: canGenerate ? "white" : "rgba(107,114,128,0.7)",
          boxShadow: canGenerate
            ? "0 4px 12px rgba(168,85,247,0.4), inset 0 1px 2px rgba(255,255,255,0.3)"
            : "none",
        }}
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-bold">単語生成</span>
      </Button>

      {/* ローディング表示 */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>処理中...</span>
        </div>
      )}
    </div>
  );
}
