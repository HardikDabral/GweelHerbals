"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const videoVariants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.2,
    },
  },
};

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position - increased range for slower animation
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, 1200], [0, 1]);

  // 3D transforms based on scroll - magical disappearing effect
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const z = useTransform(scrollYProgress, [0, 1], [0, -1500]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1, 0.9, 0.3, 0]);
  const blurValue = useTransform(scrollYProgress, [0, 0.6, 1], [0, 8, 30]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0.2]);
  const filter = useTransform(
    [blurValue, brightness],
    ([blur, bright]) => `blur(${blur}px) brightness(${bright})`
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-0 px-4 sm:px-6 lg:px-8" style={{ perspective: "2000px" }}>
      <div className="w-full h-[calc(100vh-5rem)] sm:h-[calc(100vh-5.5rem)]">
        {/* Hero Section with Video - 3D Scroll Effect */}
        <motion.section
          ref={heroRef}
          className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl mt-4 sm:mt-6"
          style={isMobile ? {} : {
            rotateX,
            rotateY,
            rotateZ,
            scale,
            y,
            z,
            opacity,
            filter,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          {/* Background Image */}
          <motion.div
            className="relative w-full h-full"
            variants={videoVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src="/images/talents/background.jpeg"
              alt="Symbolic green elixir bottle representing talent unlock - TalentBuzz hero background"
              className="w-full h-full object-cover"
            />

            {/* Animated Overlay Gradient */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.8))'
              }}
              variants={overlayVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            />

            {/* Subtle dark overlay for better text contrast */}
            <motion.div
              className="absolute inset-0 bg-black/10 z-[5]"
              variants={overlayVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            />

            {/* Content Overlay with Staggered Animations */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 z-10"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              {/* Title with word-by-word animation */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]"
                style={{
                  color: "#FFFFFF",
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Pure Nature,
                </motion.span>
                <br />
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Crafted with Care
                </motion.span>
              </motion.h1>

              {/* Description with fade and slide */}
              <motion.p
                className="text-base sm:text-lg md:text-xl text-white/95 mb-6 sm:mb-8 max-w-3xl px-2 font-normal leading-[1.6]"
                variants={itemVariants}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Farm-grown lemongrass, steam-distilled to perfection.
                <br />
                100% organic essential oils, handcrafted candles, and pure herbal fragrances.
                <br />
                Experience the true essence of nature, from our fields to your home.
              </motion.p>

              {/* Button with scale and glow effect */}
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl -z-10"
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: "radial-gradient(circle, rgba(254, 190, 16, 0.6) 0%, rgba(254, 190, 16, 0.3) 40%, transparent 70%)",
                  }}
                />
                <Button
                  asChild
                  size="lg"
                  className="h-13 text-[#1A1A1A] px-6 sm:px-8 py-6 sm:py-6 text-base sm:text-lg font-semibold rounded-full relative overflow-hidden group transition-all duration-300"
                  style={{
                    background: "#FEBE10",
                    boxShadow: "0 8px 24px rgba(254, 190, 16, 0.5), 0 0 40px rgba(254, 190, 16, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(254, 190, 16, 0.8)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFC832";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(254, 190, 16, 0.6), 0 0 50px rgba(254, 190, 16, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#FEBE10";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(254, 190, 16, 0.5), 0 0 40px rgba(254, 190, 16, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                  }}
                  aria-label="Explore our pure herbal products"
                >
                  <Link href="/#products" className="relative z-10">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      Shop Now
                    </motion.span>
                    <motion.span
                      className="ml-2 inline-block"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                    >
                      &gt;
                    </motion.span>
                    {/* Shimmer effect */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 3,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    />
                  </Link>
                </Button>
              </motion.div>

              {/* Footer text with fade */}
              <motion.p
                className="mt-4 sm:mt-6 text-sm sm:text-base text-white/85 flex items-center justify-center gap-2"
                variants={itemVariants}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="font-bold">100%</span> Organic & Chemical-Free
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
