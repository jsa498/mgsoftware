"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface WelcomeAnimationProps {
  onComplete: () => void
}

// Floating animation variants
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Particle animation variants
const particleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: [0, 1, 0],
    opacity: [0, 0.5, 0],
    transition: {
      duration: 2,
      delay: i * 0.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  })
}

export function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [showText, setShowText] = useState(false)
  const particles = Array.from({ length: 6 }, (_, i) => i)

  useEffect(() => {
    // Show text after a short delay
    const timer = setTimeout(() => {
      setShowText(true)
    }, 800)

    // Complete animation after 4 seconds
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center bg-background z-50 overflow-hidden"
    >
      {/* Background particles */}
      {particles.map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={particleVariants}
          initial="initial"
          animate="animate"
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ 
            duration: 1,
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 0.8 }
          }}
          className="text-center relative z-10"
        >
          <motion.div
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="relative"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 1,
                delay: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="relative w-[120px] h-[120px] mx-auto mb-8"
            >
              <Image
                src="/logonew.ico"
                alt="MGS VIDYALA Logo"
                fill
                sizes="120px"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
          
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <motion.h1
                className="text-4xl font-bold text-primary"
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
              >
                Welcome to Madhur Gurmat Sangeet Vidyala
              </motion.h1>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
} 