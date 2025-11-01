import type { Id } from "../../../convex/_generated/dataModel";
import type { Rarity } from "../../common/types/rarity";
import {
  getHighestRarity as getHighestRarityUtil,
  getRarityBonus,
} from "../../common/utils/rarity";
import type { PointAwardReason, PointsAwarded } from "../types/battle";
import type { SubmittedCard } from "../types/player";

/**
 * カードのレアリティボーナスを計算
 * @param rarity カードのレアリティ
 * @param isDeckCard デッキカードかどうか
 * @returns ボーナス値 (0.00 ~ 0.08)
 */
export function calculateRarityBonus(rarity: Rarity, isDeckCard: boolean): number {
  if (!isDeckCard) {
    return 0.0;
  }
  return getRarityBonus(rarity);
}

/**
 * 最終スコアを計算
 * @param similarityScore 基本類似度 (0.0 ~ 1.0)
 * @param rarityBonus レアリティボーナス
 * @returns 最終スコア (上限1.0)
 */
export function calculateFinalScore(similarityScore: number, rarityBonus: number): number {
  const finalScore = similarityScore + rarityBonus;
  return Math.min(finalScore, 1.0); // 上限1.0
}

/**
 * 生成カードのレアリティボーナスを計算
 * @param sourceCards 生成に使用したカード情報の配列
 * @param allDeckCards デッキに含まれる全カードIDの配列
 * @returns ボーナス値
 */
export function calculateGeneratedCardBonus(
  sourceCards: Array<{ id: Id<"card">; rarity: Rarity }>,
  allDeckCards: Id<"card">[]
): number {
  // 全ての生成元カードがデッキカードかチェック
  const allFromDeck = sourceCards.every((card) => allDeckCards.includes(card.id));

  if (!allFromDeck) {
    return 0.0;
  }

  // 最も高いレアリティのボーナスを適用
  const highestRarity = getHighestRarityUtil(sourceCards.map((c) => c.rarity));
  return getRarityBonus(highestRarity);
}

/**
 * ラウンドの勝者を判定
 * @param submissions 提出されたカード情報の配列
 * @returns 勝者のユーザーID（引き分けの場合はundefined）
 */
export function determineRoundWinner(
  submissions: Array<{ user_id: Id<"user">; final_score: number }>
): Id<"user"> | undefined {
  if (submissions.length === 0) return undefined;

  // 最高スコアを取得
  const maxScore = Math.max(...submissions.map((s) => s.final_score));

  // 最高スコアを持つプレイヤーを抽出
  const winners = submissions.filter((s) => s.final_score === maxScore);

  // 同点の場合はundefined
  if (winners.length > 1) {
    return undefined;
  }

  return winners[0].user_id;
}

/**
 * ポイントを計算（2人対戦用）
 * @param player1 プレイヤー1の提出情報
 * @param player2 プレイヤー2の提出情報
 * @returns ポイント付与情報の配列
 */
export function calculatePoints(
  player1: {
    user_id: Id<"user">;
    submitted_card: SubmittedCard;
    response?: "call" | "fold";
  },
  player2: {
    user_id: Id<"user">;
    submitted_card: SubmittedCard;
    response?: "call" | "fold";
  }
): PointsAwarded[] {
  const p1Declaration = player1.submitted_card.submission_type === "victory_declaration";
  const p2Declaration = player2.submitted_card.submission_type === "victory_declaration";

  // ケース1: 両者とも通常提出
  if (!p1Declaration && !p2Declaration) {
    return calculateNormalSubmissionPoints(player1, player2);
  }

  // ケース2: P1が勝利宣言
  if (p1Declaration && !p2Declaration) {
    return calculateVictoryDeclarationPoints(player1, player2);
  }

  // ケース3: P2が勝利宣言
  if (!p1Declaration && p2Declaration) {
    return calculateVictoryDeclarationPoints(player2, player1);
  }

  // ケース4: 両者とも勝利宣言（両方コール扱い）
  if (p1Declaration && p2Declaration) {
    return calculateDoubleDeclarationPoints(player1, player2);
  }

  return [];
}

/**
 * 通常提出のポイント計算
 */
function calculateNormalSubmissionPoints(
  player1: { user_id: Id<"user">; submitted_card: SubmittedCard },
  player2: { user_id: Id<"user">; submitted_card: SubmittedCard }
): PointsAwarded[] {
  const score1 = player1.submitted_card.final_score;
  const score2 = player2.submitted_card.final_score;

  if (score1 > score2) {
    return [
      { user_id: player1.user_id, points: 1, reason: "normal_win" },
      { user_id: player2.user_id, points: 0, reason: "draw" },
    ];
  }

  if (score2 > score1) {
    return [
      { user_id: player1.user_id, points: 0, reason: "draw" },
      { user_id: player2.user_id, points: 1, reason: "normal_win" },
    ];
  }

  // 引き分け
  return [
    { user_id: player1.user_id, points: 0, reason: "draw" },
    { user_id: player2.user_id, points: 0, reason: "draw" },
  ];
}

/**
 * 勝利宣言のポイント計算
 * @param declarer 宣言者
 * @param opponent 相手
 */
function calculateVictoryDeclarationPoints(
  declarer: {
    user_id: Id<"user">;
    submitted_card: SubmittedCard;
    response?: "call" | "fold";
  },
  opponent: {
    user_id: Id<"user">;
    submitted_card: SubmittedCard;
    response?: "call" | "fold";
  }
): PointsAwarded[] {
  // 相手がフォールド
  if (opponent.response === "fold") {
    return [
      { user_id: declarer.user_id, points: 1, reason: "opponent_fold" },
      {
        user_id: opponent.user_id,
        points: 0,
        reason: "fold_against_declaration",
      },
    ];
  }

  // 相手がコール（または応答なし = コール扱い）
  const declarerScore = declarer.submitted_card.final_score;
  const opponentScore = opponent.submitted_card.final_score;

  if (declarerScore > opponentScore) {
    // 宣言者の勝利
    return [
      {
        user_id: declarer.user_id,
        points: 2,
        reason: "victory_declaration_success",
      },
      {
        user_id: opponent.user_id,
        points: -2,
        reason: "victory_declaration_fail",
      },
    ];
  }

  if (opponentScore > declarerScore) {
    // 宣言者の敗北
    return [
      {
        user_id: declarer.user_id,
        points: -2,
        reason: "victory_declaration_fail",
      },
      {
        user_id: opponent.user_id,
        points: 2,
        reason: "victory_declaration_success",
      },
    ];
  }

  // 引き分け
  return [
    { user_id: declarer.user_id, points: 0, reason: "draw" },
    { user_id: opponent.user_id, points: 0, reason: "draw" },
  ];
}

/**
 * 両者が勝利宣言した場合のポイント計算
 */
function calculateDoubleDeclarationPoints(
  player1: { user_id: Id<"user">; submitted_card: SubmittedCard },
  player2: { user_id: Id<"user">; submitted_card: SubmittedCard }
): PointsAwarded[] {
  const score1 = player1.submitted_card.final_score;
  const score2 = player2.submitted_card.final_score;

  if (score1 > score2) {
    return [
      {
        user_id: player1.user_id,
        points: 2,
        reason: "victory_declaration_success",
      },
      {
        user_id: player2.user_id,
        points: -2,
        reason: "victory_declaration_fail",
      },
    ];
  }

  if (score2 > score1) {
    return [
      {
        user_id: player1.user_id,
        points: -2,
        reason: "victory_declaration_fail",
      },
      {
        user_id: player2.user_id,
        points: 2,
        reason: "victory_declaration_success",
      },
    ];
  }

  // 引き分け
  return [
    { user_id: player1.user_id, points: 0, reason: "draw" },
    { user_id: player2.user_id, points: 0, reason: "draw" },
  ];
}

/**
 * ポイント付与理由の表示テキストを取得
 */
export function getPointReasonText(reason: PointAwardReason): string {
  const reasonTexts: Record<PointAwardReason, string> = {
    normal_win: "通常勝利",
    victory_declaration_success: "勝利宣言成功",
    victory_declaration_fail: "勝利宣言失敗",
    fold_against_declaration: "フォールド",
    opponent_fold: "相手がフォールド",
    draw: "引き分け",
  };

  return reasonTexts[reason];
}
