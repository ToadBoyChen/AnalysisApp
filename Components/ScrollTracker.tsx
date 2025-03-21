"use client";

import { motion, useScroll } from "framer-motion";
import React from "react";

const ScrollTracker = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      id="scroll-indicator"
      style={{
        scaleX: scrollYProgress,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        originX: 0,
        backgroundColor: "var(--colour-accent-light)",
      }}
    />
  );
};

export default ScrollTracker;
