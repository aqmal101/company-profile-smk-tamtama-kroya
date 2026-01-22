import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/utils/useScrollAnimation";

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
}

export const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({
  children,
  direction = "up",
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  className = "",
}) => {
  const { ref, isInView, scrollDirection } = useScrollAnimation({ threshold });

  const getInitialPosition = () => {
    if (direction === "up") {
      return scrollDirection === "down"
        ? { y: 100, opacity: 0 }
        : { y: -100, opacity: 0 };
    }
    if (direction === "down") {
      return scrollDirection === "up"
        ? { y: -100, opacity: 0 }
        : { y: 100, opacity: 0 };
    }
    if (direction === "left") {
      return { x: 100, opacity: 0 };
    }
    if (direction === "right") {
      return { x: -100, opacity: 0 };
    }
    return { opacity: 0 };
  };

  const animationVariants = {
    initial: getInitialPosition(),
    animate: { x: 0, y: 0, opacity: 1 },
    exit: getInitialPosition(),
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={animationVariants}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationWrapper;
