import type { Doc, Id } from "../../../convex/_generated/dataModel";
import type { Card } from "../../common/types/card";
import { getRarityBonus } from "../../common/utils/rarity";
import type { Battle } from "../types/battle";
import type { PlayerState } from "../types/player";

/**
 * ConvexのバトルドキュメントをフロントエンドのBattle型に変換
 * bigint型をnumber型に変換
 */
export function convertBattleDocToBattle(battleDoc: Doc<"battle">): Battle {
  return {
    ...battleDoc,
    current_round: Number(battleDoc.current_round),
    players: battleDoc.players.map((player) => ({
      ...player,
      score: Number(player.score),
      turn_state: {
        ...player.turn_state,
        actions_remaining: Number(player.turn_state.actions_remaining),
        deck_cards_remaining: Number(player.turn_state.deck_cards_remaining),
      },
    })),
    round_results: battleDoc.round_results.map((result) => ({
      ...result,
      round_number: Number(result.round_number),
      points_awarded: result.points_awarded.map((points) => ({
        ...points,
        points: Number(points.points),
      })),
    })),
  };
}

/**
 * ConvexのカードドキュメントをフロントエンドのCard型に変換
 */
export function convertCardDocToCard(cardDoc: Doc<"card">): Card {
  return {
    id: cardDoc._id,
    name: cardDoc.text, // Convexでは`text`フィールド
    rarity: cardDoc.rarity,
    card_number: cardDoc.card_number,
  };
}

/**
 * カードIDの配列からCardオブジェクトの配列に変換
 */
export function convertCardIdsToCards(
  cardIds: Id<"card">[],
  cardMap: Map<Id<"card">, Doc<"card">>
): Card[] {
  return cardIds
    .map((cardId) => {
      const cardDoc = cardMap.get(cardId);
      return cardDoc ? convertCardDocToCard(cardDoc) : null;
    })
    .filter((card): card is Card => card !== null);
}

/**
 * カードIDの配列からCardオブジェクトのマップを作成
 */
export function createCardMap(cards: Doc<"card">[]): Map<Id<"card">, Doc<"card">> {
  const cardMap = new Map<Id<"card">, Doc<"card">>();
  for (const card of cards) {
    cardMap.set(card._id, card);
  }
  return cardMap;
}

/**
 * デッキカード判定マップを生成
 * @param handCardIds 手札のカードID配列
 * @param deckCardIds デッキに含まれるカードID配列
 * @returns カードIDをキー、デッキカードかどうかを値とするマップ
 */
export function createDeckCardMap(
  handCardIds: Id<"card">[],
  deckCardIds: Id<"card">[]
): Record<string, boolean> {
  const deckCardSet = new Set(deckCardIds);
  const result: Record<string, boolean> = {};
  for (const cardId of handCardIds) {
    result[cardId] = deckCardSet.has(cardId);
  }
  return result;
}

/**
 * レアリティボーナスマップを生成
 * @param handCardIds 手札のカードID配列
 * @param cardMap カードドキュメントのマップ
 * @param isDeckCards デッキカード判定マップ
 * @returns カードIDをキー、レアリティボーナスを値とするマップ
 */
export function createRarityBonusMap(
  handCardIds: Id<"card">[],
  cardMap: Map<Id<"card">, Doc<"card">>,
  isDeckCards: Record<string, boolean>
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const cardId of handCardIds) {
    const cardDoc = cardMap.get(cardId);
    const isDeckCard = isDeckCards[cardId] ?? false;
    if (cardDoc && isDeckCard) {
      result[cardId] = getRarityBonus(cardDoc.rarity);
    } else {
      result[cardId] = 0;
    }
  }
  return result;
}

/**
 * 自分のプレイヤー状態を取得
 */
export function getMyPlayerState(battle: Battle, myUserId: Id<"user">): PlayerState | undefined {
  return battle.players.find((p) => p.user_id === myUserId);
}

/**
 * 相手のプレイヤー状態を取得（2人対戦用）
 */
export function getOpponentPlayerState(
  battle: Battle,
  myUserId: Id<"user">
): PlayerState | undefined {
  return battle.players.find((p) => p.user_id !== myUserId);
}

/**
 * お題カードのテキストを取得
 */
export function getFieldCardText(
  fieldCardId: Id<"card">,
  cardMap: Map<Id<"card">, Doc<"card">>
): string {
  const cardDoc = cardMap.get(fieldCardId);
  return cardDoc?.text ?? "";
}

/**
 * プレイヤーの手札をCardオブジェクトの配列に変換
 */
export function getPlayerHandCards(
  playerState: PlayerState,
  cardMap: Map<Id<"card">, Doc<"card">>
): Card[] {
  return convertCardIdsToCards(playerState.hand, cardMap);
}

/**
 * バトルデータの準備（カード情報の取得と変換）
 * この型は useBattle.ts で使用されています。
 */
export interface PreparedBattleData {
  /** 自分のプレイヤー状態 */
  myPlayer: PlayerState;
  /** 相手のプレイヤー状態 */
  opponentPlayer: PlayerState;
  /** 自分の手札 */
  myHand: Card[];
  /** お題カードのテキスト */
  fieldCardText: string;
  /** カードドキュメントのマップ */
  cardMap: Map<Id<"card">, Doc<"card">>;
  /** デッキカード判定マップ */
  isDeckCards: Record<string, boolean>;
  /** レアリティボーナスマップ */
  rarityBonuses: Record<string, number>;
}
