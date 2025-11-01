import type { Id } from "../../../convex/_generated/dataModel";
import type { Rarity } from "./rarity";

/**
 * カード基本情報
 */
export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  card_number: string;
}

/**
 * ユーザー所有カード
 */
export interface UserCard {
  id: string; // Convex IDは文字列
  user_id: string;
  card_id: string;
  is_locked?: boolean;
  quantity: number;
}

/**
 * カード詳細付きユーザーカード
 */
export type OwnedCardWithDetail = UserCard & {
  card: Card;
};

/**
 * デッキ内のカード情報
 */
export interface DeckCardDetail {
  position: number;
  user_card_id: number;
  card: Card;
}

/**
 * バトルで使用するカード情報（レアリティ付き）
 */
export interface BattleCard {
  id: Id<"card">;
  name?: string;
  rarity: Rarity;
}
