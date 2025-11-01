"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useBattle } from "../hooks/useBattle";
import { usePhaseTimer } from "../hooks/usePhaseTimer";
import { BattleHeader } from "./BattleHeader";
import { FieldCard } from "./FieldCard";
import { BattleResultModal } from "./modals/BattleResultModal";
import { CardExchangeModal } from "./modals/CardExchangeModal";
import { RoundResultModal } from "./modals/RoundResultModal";
import { WordGenerationModal } from "./modals/WordGenerationModal";
import { ActionPhase } from "./phases/ActionPhase";
import { JudgmentPhase } from "./phases/JudgmentPhase";
import { ResponsePhase } from "./phases/ResponsePhase";
import { SubmissionPhase } from "./phases/SubmissionPhase";

export interface BattleContainerProps {
  /** バトルID */
  battleId: Id<"battle">;
  /** 自分のユーザーID */
  myUserId: Id<"user">;
}

/**
 * バトル全体のコンテナコンポーネント
 */
export function BattleContainer({ battleId, myUserId }: BattleContainerProps) {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isRoundResultModalOpen, setIsRoundResultModalOpen] = useState(false);
  const [isBattleResultModalOpen, setIsBattleResultModalOpen] = useState(false);

  const {
    battle,
    isLoading,
    myPlayer,
    opponentPlayer,
    myHand,
    fieldCardText,
    isDeckCards,
    rarityBonuses,
    similarities,
    exchangeCards,
    generateWord,
    submitCard,
    respondToDeclaration,
    isActionLoading,
  } = useBattle({ battleId, myUserId });

  // ラウンド結果モーダルの表示履歴を追跡
  const shownRoundRef = useRef<number>(-1);
  // バトル終了モーダルの表示履歴を追跡
  const hasShownBattleResultRef = useRef<boolean>(false);

  // タイムアウト時の処理（メモ化）
  const handlePhaseTimeout = useCallback(() => {
    // タイムアウト時の処理（自動処理など）
    console.log("Phase timeout");
  }, []);

  // フェーズタイマー
  const timeRemaining = usePhaseTimer(
    battle?.phase_start_time ?? Date.now(),
    battle?.current_phase ?? "field_card_presentation",
    handlePhaseTimeout
  );

  // モーダルハンドラー
  const handleExchangeClick = useCallback(() => {
    setIsExchangeModalOpen(true);
  }, []);

  const handleGenerateClick = useCallback(() => {
    setIsGenerateModalOpen(true);
  }, []);

  const handleExchange = useCallback(
    async (discardIds: string[], drawSource: "deck" | "pool") => {
      await exchangeCards(discardIds, drawSource);
      setIsExchangeModalOpen(false);
      setSelectedCardIds([]);
    },
    [exchangeCards]
  );

  const handleGenerate = useCallback(
    async (positiveCards: string[], negativeCards: string[]) => {
      await generateWord(positiveCards, negativeCards);
      setIsGenerateModalOpen(false);
    },
    [generateWord]
  );

  const handleNormalSubmit = useCallback(
    async (cardId: string) => {
      await submitCard(cardId, "normal");
      setSelectedCardId(undefined);
    },
    [submitCard]
  );

  const handleVictoryDeclaration = useCallback(
    async (cardId: string) => {
      await submitCard(cardId, "victory_declaration");
      setSelectedCardId(undefined);
    },
    [submitCard]
  );

  const handleCall = useCallback(async () => {
    await respondToDeclaration("call");
  }, [respondToDeclaration]);

  const handleFold = useCallback(async () => {
    await respondToDeclaration("fold");
  }, [respondToDeclaration]);

  // ラウンド結果の安全な取得
  const roundResults = battle?.round_results;
  const latestRoundResult = roundResults?.[roundResults.length - 1];

  // ラウンド結果モーダルの表示制御（useEffectで処理）
  useEffect(() => {
    const currentRound = battle?.current_round ?? 0;
    const shouldShow =
      battle?.current_phase === "point_calculation" &&
      latestRoundResult &&
      shownRoundRef.current !== currentRound;
    if (shouldShow) {
      shownRoundRef.current = currentRound;
      setIsRoundResultModalOpen(true);
    }
  }, [battle?.current_phase, battle?.current_round, latestRoundResult]);

  // バトル終了モーダルの表示制御（useEffectで処理）
  useEffect(() => {
    const shouldShow = battle?.game_status === "finished" && !hasShownBattleResultRef.current;
    if (shouldShow) {
      hasShownBattleResultRef.current = true;
      setIsBattleResultModalOpen(true);
    }
  }, [battle?.game_status]);

  // ローディング状態
  if (isLoading || !battle || !myPlayer || !opponentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">読み込み中...</div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const currentPhase = battle.current_phase;
  const myScore = myPlayer.score;
  const opponentScore = opponentPlayer.score;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <BattleHeader
        currentPhase={currentPhase}
        timeRemaining={timeRemaining}
        myScore={myScore}
        opponentScore={opponentScore}
        currentRound={battle.current_round}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* フェーズ別UI */}
        {currentPhase === "field_card_presentation" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <FieldCard word={fieldCardText} />
          </div>
        )}

        {currentPhase === "player_action" && (
          <ActionPhase
            myHand={myHand}
            opponentHandCount={opponentPlayer.hand.length}
            myTurnState={myPlayer.turn_state}
            myActionsLog={myPlayer.turn_state.actions_log}
            opponentActionsLog={opponentPlayer.turn_state.actions_log}
            opponentDeckRemaining={opponentPlayer.turn_state.deck_cards_remaining}
            selectedCardIds={selectedCardIds}
            onCardSelect={(cardId) => {
              if (selectedCardIds.includes(cardId)) {
                setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId));
              } else {
                setSelectedCardIds([...selectedCardIds, cardId]);
              }
            }}
            onExchangeClick={handleExchangeClick}
            onGenerateClick={handleGenerateClick}
            isLoading={isActionLoading}
          />
        )}

        {currentPhase === "word_submission" && (
          <SubmissionPhase
            myHand={myHand}
            opponentHandCount={opponentPlayer.hand.length}
            myTurnState={myPlayer.turn_state}
            fieldCardText={fieldCardText}
            selectedCardId={selectedCardId}
            similarities={similarities}
            rarityBonuses={rarityBonuses}
            isDeckCards={isDeckCards}
            opponentDeckRemaining={opponentPlayer.turn_state.deck_cards_remaining}
            onCardSelect={setSelectedCardId}
            onNormalSubmit={selectedCardId ? () => handleNormalSubmit(selectedCardId) : undefined}
            onVictoryDeclaration={
              selectedCardId ? () => handleVictoryDeclaration(selectedCardId) : undefined
            }
            isLoading={isActionLoading}
          />
        )}

        {currentPhase === "response" && (
          <ResponsePhase
            myHand={myHand}
            opponentHandCount={opponentPlayer.hand.length}
            myTurnState={myPlayer.turn_state}
            opponentSubmission={opponentPlayer.submitted_card}
            opponentDeckRemaining={opponentPlayer.turn_state.deck_cards_remaining}
            onCall={handleCall}
            onFold={handleFold}
            isLoading={isActionLoading}
          />
        )}

        {currentPhase === "point_calculation" && latestRoundResult && (
          <JudgmentPhase
            myHand={myHand}
            opponentHandCount={opponentPlayer.hand.length}
            myTurnState={myPlayer.turn_state}
            roundResult={latestRoundResult}
            myUserId={myUserId}
            opponentDeckRemaining={opponentPlayer.turn_state.deck_cards_remaining}
          />
        )}
      </main>

      {/* モーダル */}
      <CardExchangeModal
        isOpen={isExchangeModalOpen}
        onClose={() => {
          setIsExchangeModalOpen(false);
          setSelectedCardIds([]);
        }}
        cards={myHand}
        deckRemaining={myPlayer.turn_state.deck_cards_remaining}
        onExchange={handleExchange}
        isLoading={isActionLoading}
      />

      <WordGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        cards={myHand}
        onGenerate={handleGenerate}
        isLoading={isActionLoading}
      />

      {latestRoundResult && (
        <RoundResultModal
          isOpen={isRoundResultModalOpen}
          onClose={() => setIsRoundResultModalOpen(false)}
          roundResult={latestRoundResult}
          myUserId={myUserId}
        />
      )}

      {battle && (
        <BattleResultModal
          isOpen={isBattleResultModalOpen}
          onClose={() => setIsBattleResultModalOpen(false)}
          battle={battle}
          myUserId={myUserId}
          onGoHome={() => router.push("/")}
        />
      )}
    </div>
  );
}
