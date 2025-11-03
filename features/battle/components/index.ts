/**
 * バトルUIコンポーネントのエクスポート
 */

// 共通コンポーネント
export { BattleHeader } from "./BattleHeader";
export { FieldCard } from "./FieldCard";
export { PhaseIndicator } from "./PhaseIndicator";
export { Timer } from "./Timer";

// 手札関連コンポーネント
export { HandArea } from "./HandArea";
export { HandCard } from "./HandCard";
export { OpponentHand } from "./OpponentHand";

// アクション関連コンポーネント
export { ActionButtons } from "./ActionButtons";
export { ActionCounter } from "./ActionCounter";
export { DeckStatus } from "./DeckStatus";

// 型定義のエクスポート
export type { ActionButtonsProps } from "./ActionButtons";
export type { ActionCounterProps } from "./ActionCounter";
export type { BattleHeaderProps } from "./BattleHeader";
export type { DeckStatusProps } from "./DeckStatus";
export type { FieldCardProps } from "./FieldCard";
export type { HandAreaProps } from "./HandArea";
export type { HandCardProps } from "./HandCard";
export type { OpponentHandProps } from "./OpponentHand";
export type { PhaseIndicatorProps } from "./PhaseIndicator";
export type { TimerProps } from "./Timer";
