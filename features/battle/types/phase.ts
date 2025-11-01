/**
 * バトルのフェーズ定義
 */
export type BattlePhase =
  | "field_card_presentation" // 場札提示フェーズ
  | "player_action" // プレイヤーアクションフェーズ (交換/生成)
  | "word_submission" // 単語提出フェーズ
  | "response" // 対応フェーズ（勝利宣言への応答）
  | "point_calculation"; // ポイント計算フェーズ

/**
 * フェーズごとの制限時間（秒）
 */
export const PHASE_TIME_LIMITS: Record<BattlePhase, number> = {
  field_card_presentation: 5, // お題カード表示
  player_action: 60, // アクションフェーズ
  word_submission: 30, // 提出フェーズ
  response: 20, // 対応フェーズ
  point_calculation: 10, // 判定フェーズ
};

/**
 * フェーズの表示名
 */
export const PHASE_DISPLAY_NAMES: Record<BattlePhase, string> = {
  field_card_presentation: "お題カード提示",
  player_action: "アクションフェーズ",
  word_submission: "提出フェーズ",
  response: "対応フェーズ",
  point_calculation: "判定フェーズ",
};

/**
 * アクションフェーズで実行可能な行動
 */
export type PlayerAction = "card_exchange" | "word_generation";

/**
 * アクションフェーズの最大行動回数
 */
export const MAX_ACTIONS_PER_TURN = 3;

/**
 * フェーズ遷移の順序
 */
export const PHASE_ORDER: BattlePhase[] = [
  "field_card_presentation",
  "player_action",
  "word_submission",
  "response",
  "point_calculation",
];

/**
 * 次のフェーズを取得
 */
export function getNextPhase(currentPhase: BattlePhase): BattlePhase {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  const nextIndex = (currentIndex + 1) % PHASE_ORDER.length;
  return PHASE_ORDER[nextIndex];
}

/**
 * フェーズが特定の行動を許可するか判定
 */
export function isActionAllowedInPhase(phase: BattlePhase, action: PlayerAction): boolean {
  switch (phase) {
    case "player_action":
      return action === "card_exchange" || action === "word_generation";
    case "word_submission":
      return false; // 提出フェーズでは行動不可
    default:
      return false;
  }
}
