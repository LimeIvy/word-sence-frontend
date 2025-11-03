import { useEffect, useRef, useState } from "react";
import { PHASE_TIME_LIMITS } from "../types/phase";

/**
 * フェーズタイマーフック
 * フェーズ開始時刻から残り時間を計算し、タイムアウト処理を行う
 */
export function usePhaseTimer(
  phaseStartTime: number,
  currentPhase: string,
  onTimeout?: () => void | Promise<void>
) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimedOutRef = useRef<boolean>(false);

  useEffect(() => {
    // フェーズが変わったらタイムアウトフラグをリセット
    hasTimedOutRef.current = false;

    // 既存のintervalをクリア
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // phaseStartTimeが無効な値（0以下）の場合は、タイマーを開始しない
    if (!phaseStartTime || phaseStartTime <= 0) {
      setTimeRemaining(0);
      return;
    }

    // フェーズ開始時刻が更新されたら、残り時間をリセット
    const timeLimit = PHASE_TIME_LIMITS[currentPhase as keyof typeof PHASE_TIME_LIMITS] ?? 0;
    const elapsed = Math.floor((Date.now() - phaseStartTime) / 1000);
    const remaining = Math.max(0, timeLimit - elapsed);
    setTimeRemaining(remaining);

    // 既にタイムアウトしている場合
    if (remaining <= 0 && onTimeout && !hasTimedOutRef.current) {
      hasTimedOutRef.current = true;
      // 非同期関数の場合はawaitしない（useEffect内で直接awaitできないため）
      Promise.resolve(onTimeout()).catch((error) => {
        console.error("Error in onTimeout callback:", error);
      });
      return;
    }

    // 1秒ごとに残り時間を更新
    intervalRef.current = setInterval(() => {
      // phaseStartTimeが無効な値の場合は、intervalをクリア
      if (!phaseStartTime || phaseStartTime <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTimeRemaining(0);
        return;
      }

      const newElapsed = Math.floor((Date.now() - phaseStartTime) / 1000);
      const newRemaining = Math.max(0, timeLimit - newElapsed);
      setTimeRemaining(newRemaining);

      if (newRemaining <= 0 && onTimeout && !hasTimedOutRef.current) {
        hasTimedOutRef.current = true;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // 非同期関数の場合はawaitしない（interval内で直接awaitできないため）
        Promise.resolve(onTimeout()).catch((error) => {
          console.error("Error in onTimeout callback:", error);
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [phaseStartTime, currentPhase, onTimeout]);

  return timeRemaining;
}
