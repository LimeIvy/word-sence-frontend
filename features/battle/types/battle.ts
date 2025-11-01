import type { Id } from "../../../convex/_generated/dataModel";
import type { BattlePhase } from "./phase";
import type { PlayerResponse, PlayerState } from "./player";

/**
 * バトルの状態
 */
export interface Battle {
  _id: Id<"battle">;
  player_ids: Id<"user">[]; // 参加者リスト
  game_status: GameStatus; // ゲームの進行状況
  winner_ids?: Id<"user">[]; // 勝者IDの配列
  current_round: number; // 現在のラウンド数
  current_phase: BattlePhase; // 現在のフェーズ
  field_card_id: Id<"card">; // お題カード
  players: PlayerState[]; // プレイヤーの状態配列
  phase_start_time: number; // フェーズ開始時刻
  responses?: PlayerResponse[]; // 勝利宣言への応答（対応フェーズのみ）
  round_results: RoundResult[]; // ラウンド結果の履歴
  created_at: number;
  updated_at: number;
}

/**
 * ゲームの進行状況
 */
export type GameStatus = "waiting" | "active" | "finished";

/**
 * ラウンド結果
 */
export interface RoundResult {
  round_number: number;
  field_card_id: Id<"card">;
  field_card_text: string;
  submissions: RoundSubmission[];
  winner_id?: Id<"user">;
  points_awarded: PointsAwarded[];
  timestamp: number;
}

/**
 * ラウンドでの提出情報
 */
export interface RoundSubmission {
  user_id: Id<"user">;
  card_id: Id<"card">;
  card_text: string;
  submission_type: "normal" | "victory_declaration";
  similarity_score: number;
  rarity_bonus: number;
  final_score: number;
  response_type?: "call" | "fold"; // 相手の勝利宣言への応答
}

/**
 * ポイント付与情報
 */
export interface PointsAwarded {
  user_id: Id<"user">;
  points: number; // +2, +1, 0, -2
  reason: PointAwardReason;
}

/**
 * ポイント付与理由
 */
export type PointAwardReason =
  | "normal_win" // 通常勝利 (+1)
  | "victory_declaration_success" // 勝利宣言成功 (+2)
  | "victory_declaration_fail" // 勝利宣言失敗 (-2)
  | "fold_against_declaration" // 勝利宣言に対してフォールド (0)
  | "opponent_fold" // 相手がフォールド (+1)
  | "draw"; // 引き分け (0)

/**
 * バトルの作成パラメータ
 */
export interface CreateBattleParams {
  player_ids: Id<"user">[];
  deck_ids: Id<"deck">[];
}

/**
 * カード提出パラメータ
 */
export interface SubmitCardParams {
  battle_id: Id<"battle">;
  user_id: Id<"user">;
  card_id: Id<"card">;
  submission_type: "normal" | "victory_declaration";
}

/**
 * 応答パラメータ
 */
export interface RespondToDeclarationParams {
  battle_id: Id<"battle">;
  user_id: Id<"user">;
  response_type: "call" | "fold";
}

/**
 * カード交換パラメータ
 */
export interface ExchangeCardsParams {
  battle_id: Id<"battle">;
  user_id: Id<"user">;
  discard_card_ids: Id<"card">[];
  draw_source: "deck" | "pool";
}

/**
 * 単語生成パラメータ
 */
export interface GenerateWordParams {
  battle_id: Id<"battle">;
  user_id: Id<"user">;
  positive_cards: Id<"card">[]; // +ゾーンのカード
  negative_cards: Id<"card">[]; // -ゾーンのカード
}

/**
 * バトルが開始可能か判定
 */
export function canStartBattle(playerCount: number): boolean {
  return playerCount >= 2 && playerCount <= 5;
}

/**
 * バトルが終了しているか判定
 */
export function isBattleFinished(battle: Battle): boolean {
  return battle.game_status === "finished";
}

/**
 * 特定のプレイヤーの状態を取得
 */
export function getPlayerState(battle: Battle, userId: Id<"user">): PlayerState | undefined {
  return battle.players.find((p) => p.user_id === userId);
}

/**
 * 全プレイヤーが準備完了か判定
 */
export function areAllPlayersReady(battle: Battle): boolean {
  return battle.players.every((p) => p.is_ready);
}

/**
 * 勝利宣言があるか判定
 */
export function hasVictoryDeclaration(battle: Battle): boolean {
  return battle.players.some((p) => p.submitted_card?.submission_type === "victory_declaration");
}

/**
 * 全プレイヤーが提出済みか判定
 */
export function haveAllPlayersSubmitted(battle: Battle): boolean {
  return battle.players.every((p) => p.submitted_card !== undefined);
}
