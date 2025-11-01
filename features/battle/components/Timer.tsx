"use client";

import { useEffect, useRef, useState } from "react";

export interface TimerProps {
  /** 残り時間（秒） */
  timeRemaining: number;
  /** タイムアウト時のコールバック */
  onTimeout?: () => void;
  /** 警告を表示する残り時間（秒） */
  warningThreshold?: number;
  /** クラス名 */
  className?: string;
}

/**
 * カウントダウンタイマーコンポーネント
 */
export function Timer({
  timeRemaining,
  onTimeout,
  warningThreshold = 10,
  className = "",
}: TimerProps) {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const isWarning = displayTime <= warningThreshold;
  const isCritical = displayTime <= 5;
  const hasTimedOutRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayTime(timeRemaining);
    // 新しいタイマーが開始されたので、タイムアウトフラグをリセット
    hasTimedOutRef.current = false;
  }, [timeRemaining]);

  useEffect(() => {
    // 既にタイムアウトが呼び出されている場合は何もしない
    if (hasTimedOutRef.current) {
      return;
    }

    if (displayTime <= 0) {
      if (!hasTimedOutRef.current && onTimeout) {
        hasTimedOutRef.current = true;
        onTimeout();
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setDisplayTime((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (!hasTimedOutRef.current && onTimeout) {
            hasTimedOutRef.current = true;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            onTimeout();
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [displayTime, onTimeout]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 時計アイコン */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isCritical ? "animate-pulse" : ""
        }`}
        style={{
          background: isCritical
            ? "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))"
            : isWarning
              ? "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.9))"
              : "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.9))",
          boxShadow: isCritical
            ? "0 0 12px rgba(239,68,68,0.6)"
            : isWarning
              ? "0 0 8px rgba(245,158,11,0.5)"
              : "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <span className="text-white text-lg">⏱</span>
      </div>

      {/* 時間表示 */}
      <div
        className={`px-4 py-2 rounded-lg font-mono font-bold transition-all ${
          isCritical ? "animate-pulse" : ""
        }`}
        style={{
          background: isCritical
            ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.1))"
            : isWarning
              ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))"
              : "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))",
          border: `2px solid ${
            isCritical
              ? "rgba(239,68,68,0.6)"
              : isWarning
                ? "rgba(245,158,11,0.6)"
                : "rgba(59,130,246,0.6)"
          }`,
          color: isCritical ? "#DC2626" : isWarning ? "#D97706" : "#2563EB",
          boxShadow: isCritical
            ? "0 0 8px rgba(239,68,68,0.4)"
            : isWarning
              ? "0 0 4px rgba(245,158,11,0.3)"
              : "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <span className="text-xl tracking-wider">{formattedTime}</span>
      </div>

      {/* 警告メッセージ */}
      {isCritical && (
        <div
          className="px-3 py-1 rounded-full text-xs font-bold animate-pulse"
          style={{
            background: "rgba(239,68,68,0.9)",
            color: "white",
            boxShadow: "0 0 8px rgba(239,68,68,0.6)",
          }}
        >
          残りわずか！
        </div>
      )}
    </div>
  );
}
