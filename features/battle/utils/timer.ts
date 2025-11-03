import { useCallback, useEffect, useRef, useState } from "react";
import type { BattlePhase } from "../types/phase";
import { PHASE_TIME_LIMITS } from "../types/phase";

/**
 * タイマーの状態
 */
export interface TimerState {
  remainingSeconds: number; // 残り秒数
  progress: number; // 進行状況 (0-100)
  isExpired: boolean; // タイムアウトしたか
}

/**
 * フェーズタイマーのフック
 * @param phaseStartTime フェーズ開始時刻（ミリ秒）
 * @param currentPhase 現在のフェーズ
 * @param onTimeout タイムアウト時のコールバック
 * @returns タイマー状態
 */
export function usePhaseTimer(
  phaseStartTime: number,
  currentPhase: BattlePhase,
  onTimeout?: () => void
): TimerState {
  const [timerState, setTimerState] = useState<TimerState>(() =>
    calculateTimerState(phaseStartTime, currentPhase)
  );
  const onTimeoutRef = useRef(onTimeout);
  const hasCalledTimeoutRef = useRef(false);

  // コールバックの参照を更新
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // フェーズが変わったらタイムアウトフラグをリセット
  useEffect(() => {
    hasCalledTimeoutRef.current = false;
  }, [currentPhase, phaseStartTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = calculateTimerState(phaseStartTime, currentPhase);
      setTimerState(newState);

      // タイムアウト時のコールバック（1回のみ）
      if (newState.isExpired && !hasCalledTimeoutRef.current && onTimeoutRef.current) {
        hasCalledTimeoutRef.current = true;
        onTimeoutRef.current();
      }
    }, 100); // 100msごとに更新

    return () => clearInterval(interval);
  }, [phaseStartTime, currentPhase]);

  return timerState;
}

/**
 * タイマー状態を計算
 */
function calculateTimerState(phaseStartTime: number, currentPhase: BattlePhase): TimerState {
  const now = Date.now();
  const elapsed = Math.floor((now - phaseStartTime) / 1000);
  const timeLimit = PHASE_TIME_LIMITS[currentPhase];
  const remaining = Math.max(timeLimit - elapsed, 0);
  const progress = Math.min((elapsed / timeLimit) * 100, 100);

  return {
    remainingSeconds: remaining,
    progress,
    isExpired: remaining === 0,
  };
}

/**
 * カウントダウンタイマーのフック（汎用）
 * @param durationSeconds 制限時間（秒）
 * @param onComplete 完了時のコールバック
 * @returns 残り秒数と制御関数
 */
export function useCountdownTimer(durationSeconds: number, onComplete?: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (!hasCompletedRef.current && onCompleteRef.current) {
            hasCompletedRef.current = true;
            onCompleteRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
    hasCompletedRef.current = false;
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemainingSeconds(durationSeconds);
    setIsRunning(false);
    hasCompletedRef.current = false;
  }, [durationSeconds]);

  const restart = useCallback(() => {
    setRemainingSeconds(durationSeconds);
    setIsRunning(true);
    hasCompletedRef.current = false;
  }, [durationSeconds]);

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
    restart,
  };
}

/**
 * 秒数を mm:ss 形式にフォーマット
 * @param seconds 秒数
 * @returns フォーマットされた文字列
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * 残り時間に応じた色を取得（警告表示用）
 * @param remainingSeconds 残り秒数
 * @param totalSeconds 全体の秒数
 * @returns Tailwind CSSのカラークラス
 */
export function getTimerColor(remainingSeconds: number, totalSeconds: number): string {
  const ratio = remainingSeconds / totalSeconds;

  if (ratio > 0.5) {
    return "text-green-600"; // 余裕あり
  }
  if (ratio > 0.25) {
    return "text-yellow-600"; // 注意
  }
  return "text-red-600"; // 警告
}

/**
 * タイマーの緊急度を取得
 * @param remainingSeconds 残り秒数
 * @param totalSeconds 全体の秒数
 * @returns 緊急度 (normal | warning | critical)
 */
export function getTimerUrgency(
  remainingSeconds: number,
  totalSeconds: number
): "normal" | "warning" | "critical" {
  const ratio = remainingSeconds / totalSeconds;

  if (ratio > 0.5) {
    return "normal";
  }
  if (ratio > 0.25) {
    return "warning";
  }
  return "critical";
}

/**
 * タイマーのアニメーションクラスを取得
 * @param urgency 緊急度
 * @returns アニメーションクラス
 */
export function getTimerAnimationClass(urgency: "normal" | "warning" | "critical"): string {
  switch (urgency) {
    case "critical":
      return "animate-pulse";
    case "warning":
      return "animate-bounce";
    default:
      return "";
  }
}
