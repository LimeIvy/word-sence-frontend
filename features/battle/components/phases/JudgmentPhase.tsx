"use client";

import { useEffect, useRef, useState } from "react";
import type { Card } from "../../../common/types/card";
import type { PointsAwarded, RoundResult } from "../../types/battle";
import type { TurnState } from "../../types/player";
import { getPointReasonText } from "../../utils/score-calculator";
import { HandArea } from "../HandArea";
import { OpponentHand } from "../OpponentHand";

export interface JudgmentPhaseProps {
  /** 自分の手札 */
  myHand: Card[];
  /** 相手の手札枚数 */
  opponentHandCount: number;
  /** 自分のターン状態 */
  myTurnState: TurnState;
  /** ラウンド結果 */
  roundResult: RoundResult;
  /** 自分のユーザーID */
  myUserId: string;
  /** 自分の名前 */
  myName?: string;
  /** 相手の名前 */
  opponentName?: string;
  /** アニメーション完了時のコールバック */
  onAnimationComplete?: () => void;
  /** クラス名 */
  className?: string;
}

/**
 * 判定フェーズコンポーネント
 */
export function JudgmentPhase({
  myHand,
  opponentHandCount,
  myTurnState,
  roundResult,
  myUserId,
  myName = "あなた",
  opponentName = "相手",
  onAnimationComplete,
  className = "",
}: JudgmentPhaseProps) {
  const [animationPhase, setAnimationPhase] = useState<"scores" | "points" | "complete">("scores");
  const mySubmission = roundResult.submissions.find((s) => s.user_id === myUserId);
  const opponentSubmission = roundResult.submissions.find((s) => s.user_id !== myUserId);
  const myPoints = roundResult.points_awarded.find((p) => p.user_id === myUserId);
  const opponentPoints = roundResult.points_awarded.find((p) => p.user_id !== myUserId);

  // onAnimationCompleteの最新の参照をrefに保存
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  // タイマーは一度だけ実行される（依存配列が空）
  useEffect(() => {
    // スコア表示アニメーション（2秒）
    const timer1 = setTimeout(() => {
      setAnimationPhase("points");
    }, 2000);

    // ポイント付与演出（3秒）
    const timer2 = setTimeout(() => {
      setAnimationPhase("complete");
      onAnimationCompleteRef.current?.();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getPointsDisplayText = (points: PointsAwarded | undefined): string => {
    if (!points) return "+0";
    if (points.points > 0) return `+${points.points}`;
    return `${points.points}`;
  };

  const getPointsColor = (points: PointsAwarded | undefined): string => {
    if (!points) return "#6B7280";
    if (points.points > 0) return "#10B981"; // 緑
    if (points.points < 0) return "#EF4444"; // 赤
    return "#6B7280"; // グレー
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* 上部: 相手の手札 */}
      <div className="flex justify-center">
        <OpponentHand
          handCount={opponentHandCount}
          opponentName={opponentName}
          deckRemaining={myTurnState.deck_cards_remaining}
        />
      </div>

      {/* 中央: 判定結果表示 */}
      <div className="flex flex-col gap-4">
        {/* スコア表示 */}
        {animationPhase !== "complete" && (
          <div className="flex justify-center gap-8">
            {/* 自分のスコア */}
            {mySubmission && (
              <div
                className={`px-6 py-4 rounded-lg shadow-lg transition-all ${
                  animationPhase === "scores" ? "animate-pulse" : ""
                }`}
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.9))",
                  border: "2px solid rgba(96,165,250,0.7)",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-sm font-bold text-white">{myName}</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {Math.round((mySubmission.final_score + 1) * 50)}点
                  </div>
                </div>
              </div>
            )}

            {/* VS表示 */}
            <div className="flex items-center">
              <span className="text-3xl font-bold" style={{ color: "rgba(139,69,19,0.8)" }}>
                VS
              </span>
            </div>

            {/* 相手のスコア */}
            {opponentSubmission && (
              <div
                className={`px-6 py-4 rounded-lg shadow-lg transition-all ${
                  animationPhase === "scores" ? "animate-pulse" : ""
                }`}
                style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))",
                  border: "2px solid rgba(248,113,113,0.7)",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-sm font-bold text-white">{opponentName}</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {Math.round((opponentSubmission.final_score + 1) * 50)}点
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ポイント付与演出 */}
        {animationPhase === "points" && (
          <div className="flex justify-center gap-8">
            {/* 自分のポイント */}
            {myPoints && (
              <div
                className="px-8 py-6 rounded-lg shadow-lg animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${getPointsColor(myPoints)}CC, ${getPointsColor(myPoints)}99)`,
                  border: `3px solid ${getPointsColor(myPoints)}`,
                  boxShadow: `0 8px 24px ${getPointsColor(myPoints)}40`,
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">{myName}</div>
                  <div className="text-4xl font-mono font-black text-white">
                    {getPointsDisplayText(myPoints)}
                  </div>
                  <div className="text-xs text-white/80">{getPointReasonText(myPoints.reason)}</div>
                </div>
              </div>
            )}

            {/* 相手のポイント */}
            {opponentPoints && (
              <div
                className="px-8 py-6 rounded-lg shadow-lg animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${getPointsColor(opponentPoints)}CC, ${getPointsColor(opponentPoints)}99)`,
                  border: `3px solid ${getPointsColor(opponentPoints)}`,
                  boxShadow: `0 8px 24px ${getPointsColor(opponentPoints)}40`,
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">{opponentName}</div>
                  <div className="text-4xl font-mono font-black text-white">
                    {getPointsDisplayText(opponentPoints)}
                  </div>
                  <div className="text-xs text-white/80">
                    {getPointReasonText(opponentPoints.reason)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ラウンド結果表示 */}
        {animationPhase === "complete" && (
          <div className="flex justify-center">
            <div
              className="px-8 py-6 rounded-lg shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                border: "2px solid rgba(218,165,32,0.7)",
                boxShadow: "0 4px 12px rgba(139,69,19,0.4)",
              }}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-white">
                  {roundResult.winner_id === myUserId
                    ? "🎉 あなたの勝利！"
                    : roundResult.winner_id
                      ? `😢 ${opponentName}の勝利`
                      : "🤝 引き分け"}
                </div>
                <div className="text-sm text-amber-100">
                  ラウンド {roundResult.round_number} 終了
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 下部: 自分の手札 */}
      <div className="flex justify-center">
        <HandArea
          cards={myHand}
          selectedCardIds={[]}
          multiSelect={false}
          showSimilarity={false}
          playerName={myName}
          deckRemaining={myTurnState.deck_cards_remaining}
        />
      </div>
    </div>
  );
}
