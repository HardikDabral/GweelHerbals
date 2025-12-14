"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView } from "framer-motion";
import { useThemeStore } from "@/lib/store/useThemeStore";

type TalentSection = {
  id: number;
  number: string;
  title: string;
  description: string;
  bigImage: string;
  smallImage: string;
  cardContent: {
    title?: string;
    subtitle?: string;
    age?: string;
    message?: string;
    items?: Array<{ score: string; label: string } | string>;
    recommendations?: Array<{ category: string; item: string }>;
  };
};

const talentSections: TalentSection[] = [
  {
    id: 1,
    number: "Herbal Tea",
    title: "Gweel Herbal Lemon Tea – A sip of Himalayan serenity.",
    description: "Handpicked, sun-dried, and packed with antioxidants for a refreshing, caffeine-free experience.",
    bigImage: "/images/talents/bigImageone.jpg",
    smallImage: "/images/talents/box5.jpeg",
    cardContent: {
      title: "PREMIUM TEA",
      age: "100%",
      message: "Natural calm in every cup.",
    },
  },
  {
    id: 2,
    number: "Essential Oil",
    title: "Lemongrass Oil – The pure essence of the soil.",
    description: "Steam-distilled to capture the potent, citrusy aroma and therapeutic benefits of mountain-grown lemongrass.",
    bigImage: "/images/talents/bigImagetwo.jpg",
    smallImage: "/images/talents/box6.jpeg",
    cardContent: {
      title: "PURE EXTRACT",
      age: "Potent",
      message: "For skin, aroma, and wellness.",
    },
  },
  {
    id: 3,
    number: "Aromatherapy",
    title: "Scented Oil – Nature’s fragrance for your soul.",
    description: "Hand-blended floral and herbal notes that uplift your mood and transform your space.",
    bigImage: "/images/talents/bigImagethree.jpg",
    smallImage: "/images/talents/box2.jpeg",
    cardContent: {
      title: "NATURAL SCENT",
      age: "Fresh",
      message: "Revitalize your senses.",
    },
  },
  {
    id: 4,
    number: "Complete Set",
    title: "Full Wellness Collection – The perfect gift of health.",
    description: "Experience the complete Gweel Herbals range, from soothing teas to healing oils, in one beautifully curated set.",
    bigImage: "/images/talents/bigImagefour.jpg",
    smallImage: "/images/talents/boxone.png",
    cardContent: {
      title: "FULL SET",
      age: "Gift",
      message: "The ultimate wellness package.",
    },
  },
];

// 3D Card Component with mouse tracking
function Card3D({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 80 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 80 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

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

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export function Talents() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for section animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Check if section is in view
  const isInView = useInView(sectionRef, { margin: "-100px", once: false });

  const [autoplay] = useState(() =>
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      skipSnaps: false,
      dragFree: false,
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 1024px)": { slidesToScroll: 1 },
        "(min-width: 768px)": { slidesToScroll: 1 },
      },
    },
    [autoplay]
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { theme } = useThemeStore();
  const [isDark, setIsDark] = useState(false);

  // Scroll-based transforms - different from HeroSection
  // Instead of 3D rotation, we use slide and scale effects
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [10, 0, 0, 8]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);

  // Sync theme with DOM on mount and when theme changes
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        // First check localStorage, then DOM class
        const savedTheme = localStorage.getItem("theme");
        const isDarkMode = savedTheme
          ? savedTheme === "dark"
          : document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
      }
    };

    // Check immediately
    checkTheme();

    // Also check when theme changes
    const observer = new MutationObserver(checkTheme);
    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, [theme]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Ensure autoplay continues after reaching the end
    const handleSelect = () => {
      const selectedIndex = emblaApi.selectedScrollSnap();
      const slideCount = emblaApi.slideNodes().length;

      // If we're at the last slide and loop is enabled, ensure it continues
      if (selectedIndex === slideCount - 1 && emblaApi.canScrollNext()) {
        // Autoplay should handle this, but we ensure it continues
        setTimeout(() => {
          if (emblaApi && autoplay) {
            autoplay.play();
          }
        }, 100);
      }
    };

    emblaApi.on("select", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, onSelect, autoplay]);

  useEffect(() => {
    return () => {
      autoplay.stop();
    };
  }, [autoplay]);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="px-4 sm:px-6 lg:pl-8 lg:pr-0 bg-white dark:bg-background overflow-hidden relative"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        ref={containerRef}
        className="mx-auto overflow-hidden"
        style={{
          y,
          scale,
          opacity,
          filter: useTransform([blur], ([blurVal]) => `blur(${blurVal}px)`),
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Section Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.p
            className="text-xs mb-1.5 uppercase tracking-widest font-bold text-center"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            PURE HIMALAYAN
          </motion.p>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center "
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            From Farm to Bottle
          </motion.h2>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="overflow-hidden pb-24 pt-8 sm:pb-28" ref={emblaRef}>
            <div className="flex">
              {talentSections.map((section: TalentSection, index: number) => (
                <div
                  key={section.id}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_40%] min-w-0 md:pl-4 lg:pl-6"
                >
                  <motion.div
                    className="flex flex-col pb-16 sm:pb-20 h-full"
                    initial={{ opacity: 0, y: 50, rotateX: 20 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 20 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Top: Text Div */}
                    <div className="mb-2.5">
                      <div
                        className="text-[10px] mb-1"
                        style={{ color: isDark ? "#ffffff" : "#000000" }}
                      >
                        {section.number}
                      </div>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-semibold mb-1.5"
                        style={{ color: isDark ? "#ffffff" : "#000000" }}
                      >
                        {section.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm leading-relaxed max-w-[400px]"
                        style={{ color: isDark ? "#ffffff" : "#000000" }}
                      >
                        {section.description}
                      </p>
                    </div>

                    {/* Middle: Big Image (Relative) */}
                    <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-2xl">
                      <Image
                        src={section.bigImage}
                        alt={section.title}
                        fill
                        className="object-cover rounded-lg"
                        priority={section.id === 1}
                      />

                      {/* Bottom: Small Image Card (Absolute with translate - centered) */}
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[35%] w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] px-1.5"
                        style={{ perspective: "1000px" }}
                      >
                        <Card3D
                          className="relative w-full aspect-square rounded-xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col cursor-pointer group"
                          style={{ transformStyle: "preserve-3d" }}
                          onClick={() => {
                            // Handle card click - you can navigate or show details
                            console.log('Card clicked:', section.id);
                          }}
                        >
                          {/* Top: Text Content with Transparent Background */}
                          <div className="relative z-10 p-2 sm:p-2.5 bg-transparent" style={{ transform: "translateZ(30px)" }}>
                            {section.cardContent.title && (
                              <div className="flex justify-between items-start mb-1.5">
                                <h4 className="text-white text-[10px] sm:text-xs font-semibold">
                                  {section.cardContent.title}
                                </h4>
                                {section.cardContent.subtitle && (
                                  <span className="text-white/60 text-[9px] sm:text-[10px]">
                                    {section.cardContent.subtitle}
                                  </span>
                                )}
                                <button
                                  className="text-white text-xs sm:text-sm font-semibold hover:text-[#FEBE10] transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('View details clicked:', section.id);
                                  }}
                                >
                                  View
                                  <Eye className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {section.cardContent.items && (
                              <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                                {section.cardContent.items.map((item: { score: string; label: string } | string, idx: number) => {
                                  if (typeof item === "string") {
                                    return (
                                      <div
                                        key={idx}
                                        className="text-white text-[9px] sm:text-[10px]"
                                      >
                                        {item}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-0.5 sm:gap-1 text-white"
                                    >
                                      <span className="text-[10px] sm:text-xs font-semibold">{item.score}</span>
                                      <span className="text-[9px] sm:text-[10px]">{item.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {section.cardContent.message && (
                              <p className="text-white/80 text-[9px] sm:text-[10px] mt-1.5 group-hover:text-white transition-colors">
                                {section.cardContent.message}
                              </p>
                            )}

                            {section.cardContent.recommendations && (
                              <div className="space-y-1 mt-1.5">
                                {section.cardContent.recommendations.map((rec: { category: string; item: string }, idx: number) => (
                                  <div key={idx} className="text-white">
                                    <p className="font-semibold text-[9px] sm:text-[10px] text-white/60">
                                      {rec.category}
                                    </p>
                                    <p className="text-[9px] sm:text-[10px]">{rec.item}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Bottom: Image Container */}
                          <div className="relative flex-1 w-full" style={{ transform: "translateZ(20px)" }}>
                            <Image
                              src={section.smallImage}
                              alt={section.title}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                        </Card3D>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {talentSections.map((_, index) => (
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
        </motion.div>
      </motion.div>
    </section>
  );
}
