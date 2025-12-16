"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
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
  luxuryProofPoints?: string[];
  cardContent: {
    title?: string;
    subtitle?: string;
    age?: string;
    price?: {
      current: number;
      original: number;
      discount: number;
      unit: string;
    };
    items?: Array<{ score: string; label: string } | string>;
    recommendations?: Array<{ category: string; item: string }>;
  };
};

const talentSections: TalentSection[] = [
  {
    id: 1,
    number: "Herbal Tea",
    title: "Gweel Herbal Lemon Tea – A sip of Himalayan serenity.",
    description: "Handcrafted in micro-batches in Pauri Garhwal. Limited seasonal harvest, sun-dried at high altitude for peak potency and flavor.",
    bigImage: "/images/talents/bigImageone.jpg",
    smallImage: "/images/talents/box5.jpeg",
    luxuryProofPoints: [
      "Limited seasonal harvest",
      "Single-origin Himalayan lemongrass",
      "Sun-dried at high altitude",
      "Handpicked in micro-batches"
    ],
    cardContent: {
      title: "PREMIUM TEA",
      age: "100%",
      price: {
        current: 360,
        original: 400,
        discount: 35,
        unit: "per 100 gm",
      },
    },
  },
  {
    id: 2,
    number: "Essential Oil",
    title: "Lemongrass Essential Oil – The pure essence of the soil.",
    description: "Handcrafted in micro-batches in Pauri Garhwal. Small-batch steam distillation captures the pure essence of mountain-grown lemongrass.",
    bigImage: "/images/talents/bigImagetwo.jpg",
    smallImage: "/images/talents/box6.jpeg",
    luxuryProofPoints: [
      "Small-batch steam distillation",
      "Single-origin Himalayan lemongrass",
      "Handcrafted in Pauri Garhwal",
      "Limited seasonal harvest"
    ],
    cardContent: {
      title: "PURE EXTRACT",
      age: "Potent",
      price: {
        current: 360,
        original: 400,
        discount: 35,
        unit: "per 30 ml",
      },
    },
  },
  {
    id: 3,
    number: "Aromatherapy",
    title: "Scented Oil – Nature's fragrance for your soul.",
    description: "Hand-poured candles in reusable glass, handcrafted in micro-batches in Pauri Garhwal. Hand-blended floral notes for spa-like calm.",
    bigImage: "/images/talents/bigImagethree.jpg",
    smallImage: "/images/talents/box2.jpeg",
    luxuryProofPoints: [
      "Hand-poured candles in reusable glass",
      "Small-batch hand-blending",
      "Single-origin Himalayan botanicals",
      "Limited seasonal harvest"
    ],
    cardContent: {
      title: "NATURAL SCENT",
      age: "Fresh",
      price: {
        current: 360,
        original: 400,
        discount: 35,
        unit: "per 100 gm",
      },
    },
  },
  {
    id: 4,
    number: "Complete Set",
    title: "Full Wellness Collection – The perfect gift of health.",
    description: "Handcrafted in micro-batches in Pauri Garhwal. A curated collection of our finest small-batch products, each crafted with Himalayan precision.",
    bigImage: "/images/talents/bigImagefour.jpg",
    smallImage: "/images/talents/boxone.png",
    luxuryProofPoints: [
      "Small-batch curation",
      "Single-origin Himalayan ingredients",
      "Handcrafted in Pauri Garhwal",
      "Limited seasonal availability"
    ],
    cardContent: {
      title: "FULL SET",
      age: "Gift",
      price: {
        current: 360,
        original: 400,
        discount: 35,
        unit: "per 100 gm",
      },
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
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  const filter = useTransform([blur], ([blurVal]) => `blur(${blurVal}px)`);

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
        style={isMobile ? {} : {
          y,
          scale,
          opacity,
          filter,
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
                        className="text-xs sm:text-sm leading-relaxed max-w-[400px] mb-3"
                        style={{ color: isDark ? "#ffffff" : "#000000" }}
                      >
                        {section.description}
                      </p>
                      {/* {section.luxuryProofPoints && section.luxuryProofPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                          {section.luxuryProofPoints.map((point, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border"
                              style={{
                                color: isDark ? "#FEBE10" : "#000000",
                                borderColor: isDark ? "rgba(254, 190, 16, 0.3)" : "rgba(0, 0, 0, 0.2)",
                                backgroundColor: isDark ? "rgba(254, 190, 16, 0.1)" : "rgba(0, 0, 0, 0.05)",
                                fontFamily: "inherit",
                                fontWeight: 500,
                              }}
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      )} */}
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
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[35%] w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] px-1.5"
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
                                  className="bg-transparent text-white border border-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full hover:bg-gradient-to-r hover:from-[#FEBE10] hover:to-[#FFD700] hover:text-black hover:border-transparent hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Add to bag clicked:', section.id);
                                  }}
                                >
                                  <span>Add to Bag</span>
                                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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

                            {section.cardContent.price && (
                              <div className="mt-2 space-y-1" style={{ transform: "translateZ(30px)" }}>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-white text-sm sm:text-base font-bold tracking-tight">
                                      ₹{section.cardContent.price.current}
                                    </span>
                                    <span className="text-white/70 text-[9px] sm:text-[10px] font-medium">
                                      {section.cardContent.price.unit}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white/50 text-[9px] sm:text-[10px] line-through font-medium">
                                      ₹{section.cardContent.price.original}
                                    </span>
                                    <span className="bg-gradient-to-r from-[#FEBE10] to-[#FFD700] text-[8px] sm:text-[9px] font-bold text-black px-1.5 py-0.5 rounded-full shadow-lg">
                                      {section.cardContent.price.discount}% OFF
                                    </span>
                                  </div>
                                </div>
                              </div>
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
