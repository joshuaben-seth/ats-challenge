"use client"

import { motion, AnimatePresence, type Variants } from "framer-motion"
import { useEffect, useState } from "react"

interface IntroAnimationProps {
  onAnimationComplete: () => void
}

export default function IntroAnimation({ onAnimationComplete }: IntroAnimationProps) {
  const [showContent, setShowContent] = useState(true)
  const title = "ATS-Lite"
  const tagline = "Find your next candidate, lightning fast."

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants: Variants = {
    hidden: { 
      opacity: 0,
      filter: "blur(20px)"
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(20px)",
      scale: 0.98,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const backgroundVariants: Variants = {
    hidden: {
      scale: 0.9,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      scale: 1,
      opacity: 0.03,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const titleContainerVariants: Variants = {
    hidden: { 
      opacity: 0,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const letterVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
      filter: "blur(5px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const taglineVariants: Variants = {
    hidden: {
      y: 30,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const accentVariants: Variants = {
    hidden: {
      scale: 0,
      opacity: 0,
      filter: "blur(5px)",
    },
    visible: {
      scale: 1,
      opacity: 0.1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        delay: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {showContent && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background geometric elements */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-[800px] h-[800px] border border-foreground rounded-full" />
          </motion.div>

          {/* Accent circles */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-foreground rounded-full"
            variants={accentVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-foreground rounded-full"
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          />

          {/* Main content */}
          <div className="relative z-10 text-center">
            <motion.div className="mb-8" variants={titleContainerVariants} initial="hidden" animate="visible">
              <motion.h1
                className="text-5xl md:text-6xl font-bold tracking-[0.05em] text-foreground"
                aria-label={title}
              >
                {title.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block"
                    variants={letterVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    {char === "-" ? <span className="mx-2 text-muted-foreground">—</span> : char}
                  </motion.span>
                ))}
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-md mx-auto leading-relaxed"
              variants={taglineVariants}
              initial="hidden"
              animate="visible"
            >
              {tagline}
            </motion.p>
          </div>

          {/* Bottom accent */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{
              opacity: 0.3,
              y: 0,
              filter: "blur(0px)",
              transition: {
                delay: 1.2,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-foreground rounded-full"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
