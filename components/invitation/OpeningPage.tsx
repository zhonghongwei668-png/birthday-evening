"use client";

import { motion } from "framer-motion";

export function OpeningPage() {
  return (
    <motion.section
      className="opening-page"
      aria-label="正在打开生日晚餐邀请"
      role="status"
      aria-live="polite"
      aria-busy="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="opening-note">
        <span className="opening-mark" aria-hidden="true">✦</span>
        <p>A Little Birthday Evening</p>
        <span className="opening-line" aria-hidden="true" />
        <small>PRIVATE BIRTHDAY DINNER NOTE</small>
      </div>
    </motion.section>
  );
}
