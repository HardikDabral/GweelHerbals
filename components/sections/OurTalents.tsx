"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useEmblaCarousel from "embla-carousel-react";

type Talent = {
  id: number;
  name: string;
  category: string;
  image: string;
  gridSpan: string; // CSS grid span classes
};

const talents: Talent[] = [
  {
    id: 8,
    name: "Organic Fields",
    category: "Sustainable Farming",
    image: "/images/talents/longImageone.jpeg",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    id: 1,
    name: "Curated Gifts",
    category: "Handcrafted",
    image: "/images/talents/boxone.png",
    gridSpan: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    id: 2,
    name: "Natural Scents",
    category: "Pure Extracts",
    image: "/images/talents/box2.jpeg",
    gridSpan: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    id: 9,
    name: "Essential Oils",
    category: "Therapeutic",
    image: "/images/talents/box6.jpeg",
    gridSpan: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    id: 4,
    name: "Women Artisans",
    category: "Community Impact",
    image: "/images/talents/longImagetwo.jpeg",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    id: 6,
    name: "Herbal Teas",
    category: "Mountain Fresh",
    image: "/images/talents/box5.jpeg",
    gridSpan: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    id: 10,
    name: "Holistic Care",
    category: "Aromatherapy",
    image: "/images/talents/box4.jpeg",
    gridSpan: "col-span-1 md:col-span-1 row-span-1",
  },
];

// Simple typewriter effect for hero quote text (desktop only use)
const TypewriterText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayed}</span>;
};

// Combined 3D Card Component with mouse tracking + hover effects
function Card3DInteractive({
  children,
  className,
  isHovered,
  style
}: {
  children: React.ReactNode;
  className?: string;
  isHovered: boolean;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hoverRotateX = useMotionValue(0);
  const hoverRotateY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 90 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 90 });

  const rotateXMouse = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateYMouse = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  // Animate hover rotation
  useEffect(() => {
    animate(hoverRotateX, isHovered ? -5 : 0, { duration: 0.4 });
    animate(hoverRotateY, isHovered ? 3 : 0, { duration: 0.4 });
  }, [isHovered, hoverRotateX, hoverRotateY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Combine mouse tracking with hover rotation
  const finalRotateX = useTransform(
    [rotateXMouse, hoverRotateX],
    ([mouse, hover]) => (mouse as number) + (hover as number)
  );

  const finalRotateY = useTransform(
    [rotateYMouse, hoverRotateY],
    ([mouse, hover]) => (mouse as number) + (hover as number)
  );

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: isHovered ? -8 : 0,
        scale: isHovered ? 1.015 : 1,
        filter: isHovered ? "drop-shadow(0 18px 35px rgba(0, 0, 0, 0.28))" : "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
      }}
      style={{
        rotateX: finalRotateX,
        rotateY: finalRotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function OurTalents() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { theme } = useThemeStore();
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Carousel setup for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme");
        const isDarkMode = savedTheme
          ? savedTheme === "dark"
          : document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
      }
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="why-us" className={`py-16 px-4 sm:px-6 lg:px-8 overflow-visible ${isDark ? "bg-[#1A1A1A]" : "bg-white"}`}>
      <div className="mx-auto overflow-visible max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p
            className="text-xs mb-1.5 uppercase tracking-widest font-bold"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            The Collection
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            Curated for Your Wellness
          </h2>
          <p
            className="mt-3 text-base sm:text-lg max-w-3xl mx-auto"
            style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
          >
            From steam-distilled essential oils to handcrafted candles and natural fragrances, explore our collection of 100% organic, farm-to-bottle wellness products.
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {talents.map((talent) => (
                <div
                  key={talent.id}
                  className="flex-[0_0_85%] sm:flex-[0_0_70%] min-w-0"
                >
                  <div className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[350px]">
                    <Image
                      src={talent.image}
                      alt={talent.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                      <p className="text-white/70 text-xs sm:text-sm mb-1 font-medium">
                        {talent.category}
                      </p>
                      <h3 className="text-white text-lg sm:text-xl font-bold">
                        {talent.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {talents.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: selectedIndex === index ? '24px' : '8px',
                  backgroundColor: selectedIndex === index
                    ? (isDark ? "#FEBE10" : "#000000")
                    : (isDark ? "rgba(254, 190, 16, 0.3)" : "rgba(0, 0, 0, 0.3)"),
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        {!isMobile && (
          <div className="hidden lg:block relative" style={{ perspective: "1000px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 auto-rows-fr">
              {talents.map((talent, index) => {
                // Add empty placeholder before Herbal Teas to maintain grid positions
                const isComedians = talent.id === 6 && talent.name === "Herbal Teas";
                return (
                  <React.Fragment key={talent.id}>
                    {isComedians && (
                      <div key="placeholder-actors" className="col-span-1 md:col-span-1 row-span-1" />
                    )}
                    <div
                      key={talent.id}
                      className={`relative ${talent.gridSpan}`}
                      style={{ zIndex: hoveredId === talent.id ? 10 : 1 }}
                      onMouseEnter={() => setHoveredId(talent.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <Card3DInteractive
                        className="relative rounded-2xl overflow-hidden cursor-pointer w-full h-full"
                        isHovered={hoveredId === talent.id}
                      >
                        <motion.div
                          className="relative w-full h-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
                          style={{
                            transformStyle: "preserve-3d",
                          }}
                        >
                          <Image
                            src={talent.image}
                            alt={talent.name}
                            fill
                            className="object-cover"
                            priority={talent.id <= 4}
                          />

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                          {/* Content */}
                          <motion.div
                            className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6"
                            style={{
                              transformStyle: "preserve-3d",
                            }}
                            animate={{
                              transform: hoveredId === talent.id ? "translateZ(20px)" : "translateZ(0px)",
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <motion.div
                              animate={{
                                y: hoveredId === talent.id ? 0 : 10,
                                opacity: hoveredId === talent.id ? 1 : 0.9,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="text-white/70 text-xs sm:text-sm mb-1 font-medium">
                                {talent.category}
                              </p>
                              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                                {talent.name}
                              </h3>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </Card3DInteractive>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Quotes in Gap - Below Singers, Right of Acrobats - Desktop Only */}
            <div
              className="hidden lg:flex absolute top-[300px] left-[calc(75%+1.25rem)] right-4 flex-col items-start gap-6 pointer-events-none"
              style={{ top: "calc(40% + 1.25rem)" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-left"
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Thoughtful Packaging
                </p>
                <p className="text-base md:text-lg font-medium leading-relaxed mb-2">
                  <TypewriterText text="Eco-conscious packaging that honors both nature and your purchase." />
                </p>
                <p
                  className="text-xs"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Every gift box includes a hand-written note.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-left"
              >
                {/* <p
                  className="text-xs mb-1"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Custom Branding
                </p>
                <p
                  className="text-base md:text-lg font-medium leading-relaxed mb-2"
                  style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}
                >
                  Corporate gifting with personalized branding available.
                </p> */}
              </motion.div>
            </div>

            {/* Quotes on Right Side of Painters Card - Desktop Only */}
            <div className="hidden lg:flex absolute bottom-[50px] left-[calc(51%+0.5rem)] max-w-[600px] flex-col items-start gap-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-left"
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Careful Shipping
                </p>
                <p
                  className="text-base md:text-lg font-medium leading-relaxed mb-2"
                  style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}
                >
                  Protective packaging and temperature-aware dispatch for delicate products.
                </p>
                <p
                  className="text-xs"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Your purchase arrives exactly as crafted.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-left"
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Personal Touch
                </p>
                <p
                  className="text-base md:text-lg font-medium leading-relaxed mb-2"
                  style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}
                >
                  Hand-written notes in every gift box, because details matter.
                </p>
                <p
                  className="text-xs"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                >
                  Luxury is in the experience, not just the product.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

