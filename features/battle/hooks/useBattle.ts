"use client";

import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import type { Card } from "../../common/types/card";
import type { Battle } from "../types/battle";
import {
  convertBattleDocToBattle,
  createCardMap,
  createDeckCardMap,
  createRarityBonusMap,
  getFieldCardText,
  getMyPlayerState,
  getOpponentPlayerState,
  getPlayerHandCards,
  type PreparedBattleData,
} from "../utils/battle-data";

export interface UseBattleOptions {
  battleId: Id<"battle">;
  myUserId: Id<"user">;
}

export interface UseBattleReturn {
  /** バトル情報 */
  battle: Battle | undefined;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー */
  error: Error | null;
  /** 自分のプレイヤー状態 */
  myPlayer: ReturnType<typeof getMyPlayerState> | undefined;
  /** 相手のプレイヤー状態 */
  opponentPlayer: ReturnType<typeof getOpponentPlayerState> | undefined;
  /** 自分の手札 */
  myHand: Card[];
  /** お題カードのテキスト */
  fieldCardText: string;
  /** デッキカード判定マップ */
  isDeckCards: Record<string, boolean>;
  /** レアリティボーナスマップ */
  rarityBonuses: Record<string, number>;
  /** カードマップ */
  cardMap: Map<Id<"card">, Doc<"card">>;
  /** カード交換 */
  exchangeCards: (discardIds: string[], drawSource: "deck" | "pool") => Promise<void>;
  /** 単語生成 */
  generateWord: (positiveCards: string[], negativeCards: string[]) => Promise<void>;
  /** カード提出 */
  submitCard: (cardId: string, submissionType: "normal" | "victory_declaration") => Promise<void>;
  /** 勝利宣言への応答 */
  respondToDeclaration: (responseType: "call" | "fold") => Promise<void>;
  /** ローディング状態（アクション実行中） */
  isActionLoading: boolean;
}

/**
 * バトル状態管理フック
 */
export function useBattle({ battleId, myUserId }: UseBattleOptions): UseBattleReturn {
  const [isActionLoading, setIsActionLoading] = useState(false);

  // バトル情報を取得
  const battleDoc = useQuery(api.battle.getBattle, { battleId });
  const user = useQuery(api.user.getMyUser);

  // Convexのドキュメントをフロントエンドの型に変換
  const battle = useMemo(() => {
    if (!battleDoc) return undefined;
    return convertBattleDocToBattle(battleDoc);
  }, [battleDoc]);

  // ミューテーション
  const exchangeCardsMutation = useMutation(api.battle.exchangeCards);
  const generateWordMutation = useMutation(api.battle.generateWord);
  const submitCardMutation = useMutation(api.battle.submitCard);
  const respondToDeclarationMutation = useMutation(api.battle.respondToDeclaration);

  // カード情報を取得（手札とお題カード）
  const cardIds = useMemo(() => {
    if (!battle) return [];
    const ids = new Set<Id<"card">>();
    // お題カード
    ids.add(battle.field_card_id);
    // 全プレイヤーの手札
    for (const player of battle.players) {
      for (const cardId of player.hand) {
        ids.add(cardId);
      }
    }
    return Array.from(ids);
  }, [battle]);

  // カード情報を一括取得
  const cards = useQuery(api.card.getCardsByIds, cardIds.length > 0 ? { cardIds } : "skip");

  // カード情報をマップに変換
  const cardMap = useMemo(() => {
    if (!cards) return new Map<Id<"card">, Doc<"card">>();
    return createCardMap(cards);
  }, [cards]);

  // 自分のプレイヤー状態を取得（デッキカード取得に必要）
  const myPlayerState = useMemo(() => {
    if (!battle) return undefined;
    return getMyPlayerState(battle, myUserId);
  }, [battle, myUserId]);

  // デッキカード情報を取得
  const deckCardIds = useQuery(
    api.deck.getUserDeckCards,
    battle && myPlayerState ? { userId: myUserId, deckId: myPlayerState.deck_ref } : "skip"
  );

  // データを準備
  const preparedData = useMemo<PreparedBattleData | null>(() => {
    if (!battle || !cardMap.size) return null;

    const myPlayer = getMyPlayerState(battle, myUserId);
    const opponentPlayer = getOpponentPlayerState(battle, myUserId);

    if (!myPlayer || !opponentPlayer) return null;

    const myHand = getPlayerHandCards(myPlayer, cardMap);
    const fieldCardText = getFieldCardText(battle.field_card_id, cardMap);

    // デッキカード判定
    const deckCardIdArray: Id<"card">[] =
      deckCardIds
        ?.filter((dc): dc is NonNullable<typeof dc> => dc !== null)
        .map((dc) => dc.card._id)
        .filter((id): id is Id<"card"> => id !== undefined) ?? [];
    const isDeckCards = createDeckCardMap(myPlayer.hand, deckCardIdArray);
    const rarityBonuses = createRarityBonusMap(myPlayer.hand, cardMap, isDeckCards);

    return {
      myPlayer,
      opponentPlayer,
      myHand,
      fieldCardText,
      cardMap,
      isDeckCards,
      rarityBonuses,
    };
  }, [battle, cardMap, myUserId, deckCardIds]);

  // カード交換
  const exchangeCards = async (discardIds: string[], drawSource: "deck" | "pool") => {
    if (!user?._id) {
      toast.error("ユーザー情報が取得できません");
      return;
    }

    setIsActionLoading(true);
    try {
      await exchangeCardsMutation({
        battle_id: battleId,
        user_id: user._id,
        discard_card_ids: discardIds as Id<"card">[],
        draw_source: drawSource,
      });
      toast.success("カードを交換しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "カード交換に失敗しました");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // 単語生成
  const generateWord = async (positiveCards: string[], negativeCards: string[]) => {
    if (!user?._id) {
      toast.error("ユーザー情報が取得できません");
      return;
    }

    setIsActionLoading(true);
    try {
      await generateWordMutation({
        battle_id: battleId,
        user_id: user._id,
        positive_cards: positiveCards as Id<"card">[],
        negative_cards: negativeCards as Id<"card">[],
      });
      toast.success("単語を生成しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "単語生成に失敗しました");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // カード提出
  const submitCard = async (cardId: string, submissionType: "normal" | "victory_declaration") => {
    if (!user?._id) {
      toast.error("ユーザー情報が取得できません");
      return;
    }

    setIsActionLoading(true);
    try {
      await submitCardMutation({
        battle_id: battleId,
        user_id: user._id,
        card_id: cardId as Id<"card">,
        submission_type: submissionType,
      });
      toast.success(
        submissionType === "victory_declaration" ? "勝利宣言を提出しました" : "カードを提出しました"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "カード提出に失敗しました");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // 勝利宣言への応答
  const respondToDeclaration = async (responseType: "call" | "fold") => {
    if (!user?._id) {
      toast.error("ユーザー情報が取得できません");
      return;
    }

    setIsActionLoading(true);
    try {
      await respondToDeclarationMutation({
        battle_id: battleId,
        user_id: user._id,
        response_type: responseType,
      });
      toast.success(responseType === "call" ? "コールしました" : "フォールドしました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "応答に失敗しました");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    battle,
    isLoading: battle === undefined,
    error: null, // TODO: エラーハンドリングを追加
    myPlayer: preparedData?.myPlayer,
    opponentPlayer: preparedData?.opponentPlayer,
    myHand: preparedData?.myHand ?? [],
    fieldCardText: preparedData?.fieldCardText ?? "",
    isDeckCards: preparedData?.isDeckCards ?? {},
    rarityBonuses: preparedData?.rarityBonuses ?? {},
    cardMap: preparedData?.cardMap ?? new Map(),
    exchangeCards,
    generateWord,
    submitCard,
    respondToDeclaration,
    isActionLoading,
  };
}
