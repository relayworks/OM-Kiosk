"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  return (
    <AnimatePresence mode="wait">
      {" "}
      {/* mode='wait'를 사용하여 애니메이션 동작 */}
      <motion.div
        key={children.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
