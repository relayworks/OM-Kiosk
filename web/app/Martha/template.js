"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{ position: "static" }} // 기본값으로 설정하여 자식 fixed 요소가 부모로부터 독립적이도록 설정
    >
      {children}
    </motion.div>
  );
}
