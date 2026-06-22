"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }) {
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // 경로를 key로 사용해 경로 변화에 따른 트랜지션 보장
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // 사라질 때 opacity 0으로 설정
        transition={{ duration: 0.7 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
