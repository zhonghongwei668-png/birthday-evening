"use client";

import { motion } from "framer-motion";

interface ChoiceCardProps {
  name: string;
  value: string;
  icon: string;
  label: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function ChoiceCard({
  name,
  value,
  icon,
  label,
  selected,
  onSelect,
}: ChoiceCardProps) {
  return (
    <motion.label
      className={`choice-card ${selected ? "is-selected" : ""}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18 }}
    >
      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
      />
      <span className="choice-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="choice-label">{label}</span>
      <span className="choice-check" aria-hidden="true">
        <span />
      </span>
    </motion.label>
  );
}
