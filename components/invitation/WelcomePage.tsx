"use client";

import { motion } from "framer-motion";
import { PageFrame } from "./PageFrame";
import type { InvitationAnswers } from "./types";

const reveal = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function WelcomePage({
  answers,
  onStart,
}: {
  answers: InvitationAnswers;
  onStart: () => void;
}) {
  return (
    <PageFrame className="welcome-page" labelledBy="welcome-title">
      <div className="paper-orbit" aria-hidden="true">
        <span />
      </div>

      <motion.div
        className="welcome-content"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1, delayChildren: 0.12 }}
      >
        <motion.p className="eyebrow" variants={reveal}>
          PRIVATE INVITATION · A LITTLE PLAN
        </motion.p>

        <motion.div variants={reveal}>
          <h1 id="welcome-title" className="display-title">
            A Little
            <br />
            Birthday Evening
          </h1>
          <p className="welcome-subtitle">一份提前准备的小小晚餐计划</p>
        </motion.div>

        <motion.div className="fine-rule" variants={reveal} aria-hidden="true">
          <span />
        </motion.div>

        <motion.div className="welcome-letter" variants={reveal}>
          <p>Hi，{answers.recipientName.trim()}</p>
          <p>
            距离你的生日还有一点时间。
            <br />
            想提前准备一个轻松的晚上。
          </p>
          <p>
            不过在决定晚餐之前，
            <br />
            想先听听你的想法。
          </p>
          <p>
            不用认真答，
            <br />
            开心最重要。
          </p>
        </motion.div>

        <motion.button
          className="primary-button welcome-button"
          type="button"
          onClick={onStart}
          variants={reveal}
          whileTap={{ scale: 0.985 }}
        >
          <span>开始</span>
          <span aria-hidden="true">↗</span>
        </motion.button>
      </motion.div>

      <p className="edition-note">
        几个月没见，正好借这个晚上重新见面，聊聊天，吃顿饭。
      </p>
    </PageFrame>
  );
}
