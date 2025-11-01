import type { Id } from "../../../convex/_generated/dataModel";

/**
 * プレイヤーの状態
 */
export interface PlayerState {
  user_id: Id<"user">;
  score: number; // 現在のポイント (3点で勝利)
  hand: Id<"card">[]; // 手札のカードID配列 (5枚)
  deck_ref: Id<"deck">; // 使用デッキの参照
  turn_state: TurnState; // ターン内の状態
  submitted_card?: SubmittedCard; // 提出したカード情報
  is_ready: boolean; // 準備完了フラグ
  is_connected: boolean; // 接続状態
  last_action_time: number; // 最後の行動時刻
}

/**
 * ターン内の状態
 */
export interface TurnState {
  actions_remaining: number; // 残り行動回数 (最大3回)
  actions_log: ActionLog[]; // 行動履歴
  deck_cards_remaining: number; // デッキの残りカード数
}

/**
 * 行動ログ
 */
export interface ActionLog {
  action_type: "card_exchange" | "word_generation";
  timestamp: number;
  details: CardExchangeDetails | WordGenerationDetails;
}

/**
 * カード交換の詳細
 */
export interface CardExchangeDetails {
  discarded_count: number; // 破棄した枚数
  draw_source: "deck" | "pool"; // ドロー元
  drawn_cards: Id<"card">[]; // ドローしたカードID
}

/**
 * 単語生成の詳細
 */
export interface WordGenerationDetails {
  source_cards: Id<"card">[]; // 生成元のカードID
  generated_card: Id<"card">; // 生成されたカードID
  positive_zone: Id<"card">[]; // +ゾーンに配置したカード
  negative_zone: Id<"card">[]; // -ゾーンに配置したカード
}

/**
 * 提出したカード情報
 */
export interface SubmittedCard {
  card_id: Id<"card">;
  submission_type: SubmissionType;
  similarity_score: number; // 基本類似度
  rarity_bonus: number; // レアリティボーナス
  final_score: number; // 最終スコア
  is_deck_card: boolean; // デッキカードかどうか
}

/**
 * 提出タイプ
 */
export type SubmissionType = "normal" | "victory_declaration";

/**
 * 勝利宣言への応答
 */
export type ResponseType = "call" | "fold";

/**
 * プレイヤーの応答状態
 */
export interface PlayerResponse {
  user_id: Id<"user">;
  response_type: ResponseType;
  timestamp: number;
}

/**
 * 手札の最大枚数
 */
export const MAX_HAND_SIZE = 5;

/**
 * 勝利に必要なポイント
 */
export const POINTS_TO_WIN = 3;

/**
 * プレイヤーが勝利条件を満たしているか判定
 */
export function hasPlayerWon(score: number): boolean {
  return score >= POINTS_TO_WIN;
}

/**
 * 手札が満杯か判定
 */
export function isHandFull(hand: Id<"card">[]): boolean {
  return hand.length >= MAX_HAND_SIZE;
}

/**
 * 行動可能か判定
 */
export function canPerformAction(turnState: TurnState): boolean {
  return turnState.actions_remaining > 0;
}

/**
 * デッキからドロー可能か判定
 */
export function canDrawFromDeck(turnState: TurnState, count: number): boolean {
  return turnState.deck_cards_remaining >= count;
}
