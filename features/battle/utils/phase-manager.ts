import type { Battle } from "../types/battle";
import type { BattlePhase } from "../types/phase";
import { getNextPhase, PHASE_ORDER, PHASE_TIME_LIMITS } from "../types/phase";

/**
 * フェーズの残り時間を計算（秒）
 * @param phaseStartTime フェーズ開始時刻（ミリ秒）
 * @param currentPhase 現在のフェーズ
 * @returns 残り時間（秒）、負の値の場合はタイムアウト
 */
export function calculateRemainingTime(phaseStartTime: number, currentPhase: BattlePhase): number {
  const now = Date.now();
  const elapsed = Math.floor((now - phaseStartTime) / 1000);
  const timeLimit = PHASE_TIME_LIMITS[currentPhase];
  return timeLimit - elapsed;
}

/**
 * フェーズがタイムアウトしたか判定
 * @param phaseStartTime フェーズ開始時刻（ミリ秒）
 * @param currentPhase 現在のフェーズ
 * @returns タイムアウトしていればtrue
 */
export function isPhaseTimedOut(phaseStartTime: number, currentPhase: BattlePhase): boolean {
  return calculateRemainingTime(phaseStartTime, currentPhase) <= 0;
}

/**
 * 次のフェーズに遷移すべきか判定
 * @param battle バトル状態
 * @returns 遷移すべきならtrue
 */
export function shouldTransitionToNextPhase(battle: Battle): boolean {
  const { current_phase, phase_start_time, players } = battle;

  // タイムアウトチェック
  if (isPhaseTimedOut(phase_start_time, current_phase)) {
    return true;
  }

  // フェーズごとの完了条件チェック
  switch (current_phase) {
    case "field_card_presentation":
      // 自動的に次へ（演出時間のみ）
      return true;

    case "player_action":
      // 全プレイヤーが準備完了
      return players.every((p) => p.is_ready);

    case "word_submission":
      // 全プレイヤーが提出完了
      return players.every((p) => p.submitted_card !== undefined);

    case "response":
      // 勝利宣言がない場合はスキップ
      const hasDeclaration = players.some(
        (p) => p.submitted_card?.submission_type === "victory_declaration"
      );
      if (!hasDeclaration) {
        return true;
      }
      // 全プレイヤーが応答完了（実装はConvex側で）
      return false;

    case "point_calculation":
      // 演出時間経過後
      return true;

    default:
      return false;
  }
}

/**
 * 次のフェーズを決定
 * @param currentPhase 現在のフェーズ
 * @param hasVictoryDeclaration 勝利宣言があるか
 * @returns 次のフェーズ
 */
export function determineNextPhase(
  currentPhase: BattlePhase,
  hasVictoryDeclaration: boolean
): BattlePhase {
  // 提出フェーズの後、勝利宣言がなければ対応フェーズをスキップ
  if (currentPhase === "word_submission" && !hasVictoryDeclaration) {
    return "point_calculation";
  }

  // ポイント計算フェーズの後は新しいラウンドへ
  if (currentPhase === "point_calculation") {
    return "field_card_presentation";
  }

  return getNextPhase(currentPhase);
}

/**
 * フェーズの進行状況を取得（パーセント）
 * @param phaseStartTime フェーズ開始時刻
 * @param currentPhase 現在のフェーズ
 * @returns 進行状況 (0-100)
 */
export function getPhaseProgress(phaseStartTime: number, currentPhase: BattlePhase): number {
  const timeLimit = PHASE_TIME_LIMITS[currentPhase];
  const elapsed = Math.floor((Date.now() - phaseStartTime) / 1000);
  const progress = (elapsed / timeLimit) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * フェーズのインデックスを取得（進行度の可視化用）
 * @param phase フェーズ
 * @returns インデックス (0-4)
 */
export function getPhaseIndex(phase: BattlePhase): number {
  return PHASE_ORDER.indexOf(phase);
}

/**
 * 全フェーズの総数を取得
 */
export function getTotalPhases(): number {
  return PHASE_ORDER.length;
}

/**
 * フェーズが特定のアクションを許可するか
 * @param phase 現在のフェーズ
 * @param action アクション名
 * @returns 許可されていればtrue
 */
export function isActionAllowed(
  phase: BattlePhase,
  action: "exchange" | "generate" | "submit" | "respond"
): boolean {
  switch (action) {
    case "exchange":
    case "generate":
      return phase === "player_action";
    case "submit":
      return phase === "word_submission";
    case "respond":
      return phase === "response";
    default:
      return false;
  }
}

/**
 * タイムアウト時のデフォルト処理が必要か判定
 * @param phase フェーズ
 * @returns デフォルト処理が必要ならtrue
 */
export function requiresTimeoutDefaultAction(phase: BattlePhase): boolean {
  // 提出フェーズと対応フェーズはタイムアウト時に自動処理が必要
  return phase === "word_submission" || phase === "response";
}

/**
 * フェーズ遷移時にリセットすべきプレイヤー状態を判定
 * @param nextPhase 次のフェーズ
 * @returns リセット項目の配列
 */
export function getResetItemsForPhase(
  nextPhase: BattlePhase
): Array<"is_ready" | "submitted_card" | "turn_state"> {
  const resetItems: Array<"is_ready" | "submitted_card" | "turn_state"> = [];

  switch (nextPhase) {
    case "field_card_presentation":
      // 新ラウンド開始時は全てリセット
      resetItems.push("is_ready", "submitted_card", "turn_state");
      break;
    case "player_action":
      // アクションフェーズ開始時
      resetItems.push("is_ready");
      break;
    case "word_submission":
      // 提出フェーズ開始時
      resetItems.push("submitted_card");
      break;
    default:
      break;
  }

  return resetItems;
}
