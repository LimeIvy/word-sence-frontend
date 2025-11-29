import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BattlePhase, PHASE_DISPLAY_NAMES } from "../types/phase";

interface PhaseCutInProps {
  currentPhase: BattlePhase;
}

const PHASE_COLORS: Record<BattlePhase, { from: string; to: string; shadow: string }> = {
  field_card_presentation: {
    from: "from-emerald-400",
    to: "to-teal-600",
    shadow: "rgba(52, 211, 153, 0.5)",
  },
  player_action: {
    from: "from-cyan-400",
    to: "to-blue-600",
    shadow: "rgba(34, 211, 238, 0.5)",
  },
  word_submission: {
    from: "from-rose-400",
    to: "to-red-600",
    shadow: "rgba(251, 113, 133, 0.5)",
  },
  response: {
    from: "from-amber-400",
    to: "to-orange-600",
    shadow: "rgba(251, 191, 36, 0.5)",
  },
  point_calculation: {
    from: "from-violet-400",
    to: "to-purple-600",
    shadow: "rgba(167, 139, 250, 0.5)",
  },
};

export function PhaseCutIn({ currentPhase }: PhaseCutInProps) {
  const [show, setShow] = useState(false);
  const [displayPhase, setDisplayPhase] = useState<BattlePhase>(currentPhase);

  useEffect(() => {
    setDisplayPhase(currentPhase);
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); // 2秒間表示

    return () => clearTimeout(timer);
  }, [currentPhase]);

  const colors = PHASE_COLORS[displayPhase];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={displayPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* 背景のブラーと暗転 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* テキストコンテナ */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* 装飾ライン（上） */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120%", opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`h-1 w-full bg-gradient-to-r ${colors.from} ${colors.to} mb-4 rounded-full shadow-[0_0_10px_${colors.shadow}]`}
            />

            {/* メインテキスト */}
            <h1
              className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${colors.from} ${colors.to} tracking-wider`}
              style={{
                filter: `drop-shadow(0 0 20px ${colors.shadow})`,
                fontFamily: "'Inter', sans-serif", // モダンなフォントを指定（プロジェクトに合わせて調整）
              }}
            >
              {PHASE_DISPLAY_NAMES[displayPhase]}
            </h1>

            {/* 装飾ライン（下） */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120%", opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`h-1 w-full bg-gradient-to-r ${colors.from} ${colors.to} mt-4 rounded-full shadow-[0_0_10px_${colors.shadow}]`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
