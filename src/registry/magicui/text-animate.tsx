"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

interface TextAnimateProps {
  children: ReactNode
  variants?: Variants
  by?: "character" | "word"
  className?: string
  onComplete?: () => void
}

export function TextAnimate({
  children,
  variants,
  by = "character",
  className,
  onComplete,
}: TextAnimateProps) {
  const text = typeof children === "string" ? children : ""

  const splitText = by === "character" ? text.split("") : text.split(" ")

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      exit="exit"
      variants={variants}
      onAnimationComplete={onComplete}
    >
      {splitText.map((char, i) => (
        <motion.span
          key={i}
          variants={variants}
          custom={i}
          style={{ display: "inline-block" }}
        >
          {char}
          {by === "word" && i < splitText.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.div>
  )
}