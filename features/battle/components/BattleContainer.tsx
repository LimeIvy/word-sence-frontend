"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { ActionButtons } from "../../../src/stories/battle/ActionButtons";
import { ActionCounter } from "../../../src/stories/battle/ActionCounter";
import { ActionLog, type ActionLogEntry } from "../../../src/stories/battle/ActionLog";
import { BattleHeader } from "../../../src/stories/battle/BattleHeader";
import { FieldCard } from "../../../src/stories/battle/FieldCard";
import { HandArea } from "../../../src/stories/battle/HandArea";
import type { CardRarity } from "../../../src/stories/battle/HandCard";
import { OpponentHand } from "../../../src/stories/battle/OpponentHand";
import { Timer } from "../../../src/stories/battle/Timer";
import { mapRarityToJapanese } from "../../common/utils/rarity";
import { useBattle } from "../hooks/useBattle";
import { usePhaseTimer } from "../hooks/usePhaseTimer";
import { BattleResultModal } from "./modals/BattleResultModal";
import { CardExchangeModal } from "./modals/CardExchangeModal";
import { RoundResultModal } from "./modals/RoundResultModal";
import { WordGenerationModal } from "./modals/WordGenerationModal";

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

  // ユーザー情報を取得（プロフィール含む）
  const myUserWithProfile = useQuery(api.user.getMyUserWithProfile);

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
    cardMap,
  } = useBattle({ battleId, myUserId });

  // タイムアウトチェック用のミューテーション
  const checkPhaseTimeoutMutation = useMutation(api.battle.checkPhaseTimeout);

  // ラウンド結果モーダルの表示履歴を追跡
  const shownRoundRef = useRef<number>(-1);
  // バトル終了モーダルの表示履歴を追跡
  const hasShownBattleResultRef = useRef<boolean>(false);
  // タイムアウト処理の実行中フラグ
  const isTimeoutProcessingRef = useRef<boolean>(false);

  // タイムアウト時の処理（メモ化）
  const handlePhaseTimeout = useCallback(async () => {
    // 既に処理中の場合はスキップ
    if (isTimeoutProcessingRef.current) {
      return;
    }

    try {
      isTimeoutProcessingRef.current = true;
      console.log("Phase timeout detected, calling checkPhaseTimeout");
      await checkPhaseTimeoutMutation({ battle_id: battleId });
    } catch (error) {
      console.error("Failed to check phase timeout:", error);
    } finally {
      // 少し遅延させてからフラグをリセット（フェーズ遷移が反映されるまで）
      setTimeout(() => {
        isTimeoutProcessingRef.current = false;
      }, 1000);
    }
  }, [battleId, checkPhaseTimeoutMutation]);

  // フェーズタイマー
  // battleがまだロードされていない場合は、タイマーを開始しない（0を返す）
  const phaseStartTime = battle?.phase_start_time;
  const battleCurrentPhase = battle?.current_phase ?? "field_card_presentation";
  const timeRemaining = usePhaseTimer(
    phaseStartTime ?? 0,
    battleCurrentPhase,
    battle ? handlePhaseTimeout : undefined
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

  // バトル結果モーダルが閉じられたときに/gameにリダイレクト
  useEffect(() => {
    if (
      battle?.game_status === "finished" &&
      hasShownBattleResultRef.current &&
      !isBattleResultModalOpen
    ) {
      // モーダルが閉じられたらリダイレクト
      router.push("/game");
    }
  }, [battle?.game_status, isBattleResultModalOpen, router]);

  // ユーザー名を取得（profileからnameを取得）
  const myName = useMemo(() => {
    if (!myUserWithProfile?.profile?.name) return "あなた";
    return myUserWithProfile.profile.name || "あなた";
  }, [myUserWithProfile?.profile?.name]);
  const opponentName = "相手"; // TODO: 相手のユーザー情報を取得

  // currentPhaseの取得（早期リターン前に定義）
  const currentPhase = battle?.current_phase ?? "field_card_presentation";

  // カード選択ハンドラー（早期リターン前に定義）
  const handleCardSelect = useCallback(
    (cardId: string) => {
      if (currentPhase === "word_submission") {
        setSelectedCardId((prev) => (prev === cardId ? undefined : cardId));
      } else {
        setSelectedCardIds((prev) => {
          if (prev.includes(cardId)) {
            return prev.filter((id) => id !== cardId);
          } else {
            return [...prev, cardId];
          }
        });
      }
    },
    [currentPhase]
  );

  // HandArea用のカードデータ変換
  const handAreaCards = useMemo(() => {
    return myHand.map((card) => ({
      id: card.id,
      word: card.name, // Card型のnameプロパティを使用
      rarity: mapRarityToJapanese(card.rarity) as CardRarity,
      similarity: similarities[card.id],
      isDeckCard: isDeckCards[card.id],
      rarityBonus: rarityBonuses[card.id],
    }));
  }, [myHand, similarities, isDeckCards, rarityBonuses]);

  // OpponentHand用のカードデータ変換
  const opponentHandCards = useMemo(() => {
    if (!opponentPlayer) return [];
    return opponentPlayer.hand.map((cardId) => {
      const card = cardMap.get(cardId);
      if (!card) {
        return {
          id: cardId,
          word: "???",
          rarity: "並" as CardRarity,
        };
      }
      return {
        id: cardId,
        word: card.text,
        rarity: mapRarityToJapanese(card.rarity) as CardRarity,
        isDeckCard: false, // 相手のデッキカード情報は取得できない
      };
    });
  }, [opponentPlayer, cardMap]);

  // ActionLog用のデータ変換
  const actionLogs = useMemo<ActionLogEntry[]>(() => {
    if (!myPlayer || !opponentPlayer) return [];
    const logs: ActionLogEntry[] = [];

    // 自分の行動ログ
    if (myPlayer.turn_state?.actions_log) {
      for (const action of myPlayer.turn_state.actions_log) {
        if (action.action_type === "card_exchange") {
          const details = action.details as {
            discarded_count: number;
            draw_source: "deck" | "pool";
          };
          logs.push({
            id: `my-${action.timestamp}-exchange`,
            playerName: myName,
            isOwnAction: true,
            actionType:
              details.draw_source === "deck" ? "card_exchange_deck" : "card_exchange_pool",
            details: {
              exchangedCount: details.discarded_count || 0,
            },
            timestamp: action.timestamp,
          });
        } else if (action.action_type === "word_generation") {
          const details = action.details as { generated_card: Id<"card"> };
          const generatedCard = cardMap.get(details.generated_card);
          logs.push({
            id: `my-${action.timestamp}-generate`,
            playerName: myName,
            isOwnAction: true,
            actionType: "word_generation",
            details: {
              generatedWord: generatedCard?.text || "",
            },
            timestamp: action.timestamp,
          });
        }
      }
    }

    // 相手の行動ログ
    if (opponentPlayer.turn_state?.actions_log) {
      for (const action of opponentPlayer.turn_state.actions_log) {
        if (action.action_type === "card_exchange") {
          const details = action.details as {
            discarded_count: number;
            draw_source: "deck" | "pool";
          };
          logs.push({
            id: `opponent-${action.timestamp}-exchange`,
            playerName: opponentName,
            isOwnAction: false,
            actionType:
              details.draw_source === "deck" ? "card_exchange_deck" : "card_exchange_pool",
            details: {
              exchangedCount: details.discarded_count || 0,
            },
            timestamp: action.timestamp,
          });
        } else if (action.action_type === "word_generation") {
          const details = action.details as { generated_card: Id<"card"> };
          const generatedCard = cardMap.get(details.generated_card);
          logs.push({
            id: `opponent-${action.timestamp}-generate`,
            playerName: opponentName,
            isOwnAction: false,
            actionType: "word_generation",
            details: {
              generatedWord: generatedCard?.text || "",
            },
            timestamp: action.timestamp,
          });
        }
      }
    }

    // 提出情報
    if (myPlayer.submitted_card) {
      const card = cardMap.get(myPlayer.submitted_card.card_id);
      logs.push({
        id: `my-submit-${myPlayer.submitted_card.card_id}`,
        playerName: myName,
        isOwnAction: true,
        actionType:
          myPlayer.submitted_card.submission_type === "victory_declaration"
            ? "victory_declaration"
            : "card_submission",
        details: {
          submittedWord: card?.text || "",
          declaredWord:
            myPlayer.submitted_card.submission_type === "victory_declaration"
              ? card?.text || ""
              : undefined,
        },
        timestamp: Date.now(),
      });
    }

    if (opponentPlayer.submitted_card) {
      const card = cardMap.get(opponentPlayer.submitted_card.card_id);
      logs.push({
        id: `opponent-submit-${opponentPlayer.submitted_card.card_id}`,
        playerName: opponentName,
        isOwnAction: false,
        actionType:
          opponentPlayer.submitted_card.submission_type === "victory_declaration"
            ? "victory_declaration"
            : "card_submission",
        details: {
          submittedWord: card?.text || "",
          declaredWord:
            opponentPlayer.submitted_card.submission_type === "victory_declaration"
              ? card?.text || ""
              : undefined,
        },
        timestamp: Date.now(),
      });
    }

    return logs.sort((a, b) => a.timestamp - b.timestamp);
  }, [myPlayer, opponentPlayer, myName, opponentName, cardMap]);

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

  const myScore = Number(myPlayer.score);
  const opponentScore = Number(opponentPlayer.score);
  const maxTime = 60; // フェーズごとの最大時間（秒）
  const actionsRemaining = Number(myPlayer.turn_state.actions_remaining);
  const maxActions = 3;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-amber-50 to-amber-100">
      {/* メインコンテンツ: 縦3分割レイアウト */}
      <main className="flex-1 min-h-0 overflow-hidden container mx-auto px-2 pt-1 pb-1 max-w-[1600px]">
        <div className="grid grid-cols-12 gap-3 h-full">
          {/* 左カラム: FieldCard + ActionButtons */}
          <div className="col-span-2 flex flex-col gap-2 h-full overflow-hidden">
            {/* 上: FieldCard */}
            <div className="flex-shrink-0 pt-2 mt-10">
              <FieldCard word={fieldCardText} size="small" animated={true} />
            </div>
            {/* 下: ActionButtons と ActionCounter */}
            <div className="flex-1 flex flex-col gap-8 min-h-0 overflow-hidden justify-center mr-2">
              <ActionButtons
                onExchange={handleExchangeClick}
                onGenerate={handleGenerateClick}
                exchangeDisabled={
                  isActionLoading ||
                  actionsRemaining === 0 ||
                  currentPhase !== "player_action" ||
                  Number(myPlayer.turn_state.deck_cards_remaining) === 0
                }
                generateDisabled={
                  isActionLoading || actionsRemaining === 0 || currentPhase !== "player_action"
                }
                deckRemaining={Number(myPlayer.turn_state.deck_cards_remaining)}
              />
              <ActionCounter
                actionsRemaining={actionsRemaining}
                maxActions={maxActions}
                warningThreshold={1}
              />
            </div>
          </div>

          {/* 中央カラム: BattleHeader + カードエリア */}
          <div className="col-span-7 flex flex-col gap-2 h-full overflow-hidden">
            {/* 上: BattleHeader */}
            <div className="flex-shrink-0 flex justify-center min-w-0 px-2 mt-5 z-50">
              <BattleHeader
                player1Name={opponentName}
                player1Score={opponentScore}
                player2Name={myName}
                player2Score={myScore}
                currentRound={battle.current_round}
                currentPhase={currentPhase}
              />
            </div>
            {/* 下: カードエリア */}
            <div className="flex-1 min-h-0 overflow-visible flex flex-col gap-1 mt-10">
              {/* 中央上: OpponentHand */}
              <div className="flex-[1] min-h-0 overflow-visible pt-2">
                <OpponentHand
                  cards={opponentHandCards}
                  playerName={opponentName}
                  showDeckRemaining={true}
                  deckRemaining={Number(opponentPlayer.turn_state.deck_cards_remaining)}
                  className="h-full gap-2"
                />
              </div>

              {/* 中央下: HandArea */}
              <div className="flex-[1] min-h-0 overflow-visible pt-2">
                <HandArea
                  cards={handAreaCards}
                  selectedCardIds={
                    currentPhase === "word_submission"
                      ? selectedCardId
                        ? [selectedCardId]
                        : []
                      : selectedCardIds
                  }
                  multiSelect={currentPhase === "player_action"}
                  onCardSelect={handleCardSelect}
                  showSimilarity={currentPhase === "word_submission"}
                  playerName={myName}
                  deckRemaining={Number(myPlayer.turn_state.deck_cards_remaining)}
                  className="h-full gap-2"
                />
              </div>
            </div>
          </div>

          {/* 右カラム: Timer + ActionLog */}
          <div className="col-span-3 flex flex-col gap-2 h-full overflow-hidden">
            {/* 上: Timer */}
            <div className="flex-shrink-0 mt-6">
              <Timer
                remainingTime={timeRemaining}
                maxTime={maxTime}
                size="medium"
                warningThreshold={20}
                dangerThreshold={10}
              />
            </div>
            {/* 下: ActionLog */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col pt-2 mb-10">
              <ActionLog logs={actionLogs} maxItems={8} className="h-full" />
            </div>
          </div>
        </div>
      </main>

      {/* フェーズ別アクション */}
      {currentPhase === "word_submission" && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
          {selectedCardId && (
            <>
              <button
                onClick={() => handleNormalSubmit(selectedCardId)}
                disabled={isActionLoading}
                className="px-6 py-3 rounded-lg font-bold text-lg transition-all select-none cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.9))",
                  border: "2px solid rgba(96,165,250,0.7)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                }}
              >
                通常提出
              </button>
              <button
                onClick={() => handleVictoryDeclaration(selectedCardId)}
                disabled={isActionLoading}
                className="px-6 py-3 rounded-lg font-bold text-lg transition-all select-none cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))",
                  border: "2px solid rgba(248,113,113,0.7)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
                }}
              >
                勝利宣言
              </button>
            </>
          )}
        </div>
      )}

      {currentPhase === "response" && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
          <button
            onClick={handleCall}
            disabled={isActionLoading}
            className="px-6 py-3 rounded-lg font-bold text-lg transition-all select-none"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.9))",
              border: "2px solid rgba(96,165,250,0.7)",
              color: "white",
              boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
            }}
          >
            コール
          </button>
          <button
            onClick={handleFold}
            disabled={isActionLoading}
            className="px-6 py-3 rounded-lg font-bold text-lg transition-all select-none"
            style={{
              background: "linear-gradient(135deg, rgba(156,163,175,0.95), rgba(107,114,128,0.9))",
              border: "2px solid rgba(209,213,219,0.7)",
              color: "white",
              boxShadow: "0 4px 12px rgba(156,163,175,0.4)",
            }}
          >
            フォールド
          </button>
        </div>
      )}

      {/* モーダル */}
      <CardExchangeModal
        isOpen={isExchangeModalOpen}
        onClose={() => {
          setIsExchangeModalOpen(false);
          setSelectedCardIds([]);
        }}
        cards={myHand}
        deckRemaining={Number(myPlayer.turn_state.deck_cards_remaining)}
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
          onGoHome={() => router.push("/game")}
        />
      )}
    </div>
  );
}
