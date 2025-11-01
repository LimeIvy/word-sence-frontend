import { useEffect, useState } from "react";
import { PHASE_TIME_LIMITS } from "../types/phase";

/**
 * フェーズタイマーフック
 * フェーズ開始時刻から残り時間を計算し、タイムアウト処理を行う
 */
export function usePhaseTimer(
  phaseStartTime: number,
  currentPhase: string,
  onTimeout?: () => void
) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    // フェーズ開始時刻が更新されたら、残り時間をリセット
    const timeLimit = PHASE_TIME_LIMITS[currentPhase as keyof typeof PHASE_TIME_LIMITS] ?? 0;
    const elapsed = Math.floor((Date.now() - phaseStartTime) / 1000);
    const remaining = Math.max(0, timeLimit - elapsed);
    setTimeRemaining(remaining);

    // 既にタイムアウトしている場合
    if (remaining <= 0 && onTimeout) {
      onTimeout();
      return;
    }

    // 1秒ごとに残り時間を更新
    const interval = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - phaseStartTime) / 1000);
      const newRemaining = Math.max(0, timeLimit - newElapsed);
      setTimeRemaining(newRemaining);

      if (newRemaining <= 0 && onTimeout) {
        onTimeout();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [phaseStartTime, currentPhase, onTimeout]);

  return timeRemaining;
}
