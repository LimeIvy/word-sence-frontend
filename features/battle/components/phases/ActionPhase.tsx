"use client";

import type { Card } from "../../../common/types/card";
import type { ActionLog, CardExchangeDetails, TurnState } from "../../types/player";
import { canPerformAction } from "../../types/player";
import { ActionButtons } from "../ActionButtons";
import { ActionCounter } from "../ActionCounter";
import { DeckStatus } from "../DeckStatus";
import { HandArea } from "../HandArea";
import { OpponentHand } from "../OpponentHand";

export interface ActionPhaseProps {
  /** 自分の手札 */
  myHand: Card[];
  /** 相手の手札枚数 */
  opponentHandCount: number;
  /** 自分のターン状態 */
  myTurnState: TurnState;
  /** 自分の行動ログ */
  myActionsLog: ActionLog[];
  /** 相手の行動ログ */
  opponentActionsLog: ActionLog[];
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** カード選択時のコールバック */
  onCardSelect?: (cardId: string) => void;
  /** 選択中のカードID */
  selectedCardIds?: string[];
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
 * アクションフェーズコンポーネント
 */
export function ActionPhase({
  myHand,
  opponentHandCount,
  myTurnState,
  myActionsLog,
  opponentActionsLog,
  myName = "あなた",
  opponentName = "相手",
  onCardSelect,
  selectedCardIds = [],
  onExchangeClick,
  onGenerateClick,
  isLoading = false,
  className = "",
}: ActionPhaseProps) {
  const canPerform = canPerformAction(myTurnState);

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* 上部: 相手の手札 */}
      <div className="flex justify-center">
        <OpponentHand
          handCount={opponentHandCount}
          opponentName={opponentName}
          deckRemaining={myTurnState.deck_cards_remaining}
        />
      </div>

      {/* 中央: 行動ログ表示エリア */}
      {(myActionsLog.length > 0 || opponentActionsLog.length > 0) && (
        <div className="relative px-4">
          {/* 装飾的な背景 */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.1), rgba(101,67,33,0.05))",
              border: "1px solid rgba(139,69,19,0.2)",
            }}
          />

          <div className="relative py-3 px-4">
            <div className="text-sm font-bold mb-2" style={{ color: "#654321" }}>
              行動ログ
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {/* 自分の行動ログ */}
              {myActionsLog.map((action, index) => {
                const exchangeDetails =
                  action.action_type === "card_exchange"
                    ? (action.details as CardExchangeDetails)
                    : null;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "rgba(59,130,246,0.9)" }}
                  >
                    <span className="font-semibold">{myName}:</span>
                    <span>
                      {action.action_type === "card_exchange"
                        ? `カード交換 (${exchangeDetails?.discarded_count ?? 0}枚破棄)`
                        : "単語生成"}
                    </span>
                    <span className="text-gray-500">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}

              {/* 相手の行動ログ */}
              {opponentActionsLog.map((action, index) => {
                const exchangeDetails =
                  action.action_type === "card_exchange"
                    ? (action.details as CardExchangeDetails)
                    : null;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "rgba(239,68,68,0.9)" }}
                  >
                    <span className="font-semibold">{opponentName}:</span>
                    <span>
                      {action.action_type === "card_exchange"
                        ? `カード交換 (${exchangeDetails?.discarded_count ?? 0}枚破棄)`
                        : "単語生成"}
                    </span>
                    <span className="text-gray-500">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 下部: 自分の手札とアクション */}
      <div className="flex flex-col gap-4">
        {/* アクション情報 */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <ActionCounter turnState={myTurnState} />
          <DeckStatus turnState={myTurnState} />
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center">
          <ActionButtons
            canExchange={canPerform}
            canGenerate={canPerform}
            onExchangeClick={onExchangeClick}
            onGenerateClick={onGenerateClick}
            isLoading={isLoading}
          />
        </div>

        {/* 自分の手札 */}
        <div className="flex justify-center">
          <HandArea
            cards={myHand}
            selectedCardIds={selectedCardIds}
            multiSelect={true}
            onCardSelect={onCardSelect}
            showSimilarity={false}
            playerName={myName}
            deckRemaining={myTurnState.deck_cards_remaining}
          />
        </div>
      </div>
    </div>
  );
}
