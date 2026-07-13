"use client";

import { motion } from "framer-motion";

interface ProgressRailProps {
  current: number;
  onBack: () => void;
}

const TOTAL = 7;

export function ProgressRail({ current, onBack }: ProgressRailProps) {
  return (
    <header className="progress-header">
      <button className="back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span>
        <span>返回</span>
      </button>

      <div className="progress-meta" aria-live="polite">
        <span>A LITTLE PLAN</span>
        <span>
          {String(current).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label={`邀请计划第 ${current} 步，共 ${TOTAL} 步`}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-valuenow={current}
      >
        <motion.span
          className="progress-fill"
          animate={{ scaleX: current / TOTAL }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </header>
  );
}
