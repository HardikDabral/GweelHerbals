"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { ArrowRight, X, Instagram } from "lucide-react";
import Image from "next/image";

type Testimonial = {
  id: number;
  quote: string;
  author: {
    name: string;
    age?: number;
    role: string;
    avatar: string;
  };
  date: string;
  time?: string;
  type: "shared" | "post";
  platform?: "x" | "instagram";
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "The lemongrass essential oil from Gweel Herbal is absolutely pure! I can smell the difference — it's fresh, potent, and therapeutic. My home feels like a spa now. Highly recommend!",
    author: {
      name: "Priya Sharma",
      age: 28,
      role: "Wellness Enthusiast",
      avatar: "/images/talents/user5.jpeg",
    },
    date: "DEC 5, 2024",
    time: "10:30 AM",
    type: "shared",
    platform: "instagram",
  },
  {
    id: 2,
    quote: "I've tried many herbal candles, but Gweel Herbal's handcrafted candles are on another level. The aroma is natural, soothing, and lasts for hours. Perfect for meditation and relaxation.",
    author: {
      name: "Rajesh Kumar",
      role: "Yoga Instructor",
      avatar: "/images/talents/user2.jpg",
    },
    date: "NOV 18, 2024",
    time: "2:45 PM",
    type: "shared",
    platform: "x",
  },
  {
    id: 3,
    quote: "Knowing that Gweel Herbal grows their own lemongrass organically makes all the difference. It's pure, chemical-free, and you can feel the quality. This is wellness done right!",
    author: {
      name: "Anita Desai",
      role: "Organic Living Advocate",
      avatar: "/images/talents/user3.jpeg",
    },
    date: "OCT 22, 2024",
    type: "shared",
  },
  {
    id: 4,
    quote: "The room spray is my favorite! It instantly refreshes any space with a clean, uplifting scent. No harsh chemicals, just pure nature. I've gifted it to all my friends.",
    author: {
      name: "Meera Patel",
      age: 35,
      role: "Interior Designer",
      avatar: "/images/talents/user4.jpeg",
    },
    date: "NOV 30, 2024",
    type: "shared",
  },
  {
    id: 5,
    quote: "Gweel Herbal's products have transformed my self-care routine. The essential oils are therapeutic, the candles create the perfect ambiance, and everything is 100% natural. Worth every penny!",
    author: {
      name: "Vikram Singh",
      role: "Wellness Coach",
      avatar: "/images/talents/user1.jpg",
    },
    date: "DEC 1, 2024",
    time: "5:20 PM",
    type: "shared",
    platform: "instagram",
  },
  {
    id: 6,
    quote: "From the farm-to-bottle process to the beautiful packaging, Gweel Herbal truly cares about quality and sustainability. Their products are pure, effective, and eco-friendly. A brand I trust!",
    author: {
      name: "Kavita Reddy",
      age: 31,
      role: "Sustainable Living Blogger",
      avatar: "/images/talents/user6.jpeg",
    },
    date: "NOV 25, 2024",
    type: "shared",
  },
];

export default function Testimonials() {
  const { theme } = useThemeStore();
  const [isDark, setIsDark] = useState(false);
  const [showMore, setShowMore] = useState(false);

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

  return (
    <section id="stories" className={`py-16 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-[#1A1A1A]" : "bg-white"}`}>
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs mb-1.5 uppercase tracking-widest font-bold"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            COMMUNITY LOVE
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            Stories from the Hills
          </h2>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base transition-colors"
            style={{ 
              background: '#FEBE10',
              color: '#1A1A1A',
              boxShadow: '0 6px 20px rgba(254, 190, 16, 0.5), 0 0 30px rgba(254, 190, 16, 0.3)',
              border: '1px solid rgba(254, 190, 16, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFC832';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(254, 190, 16, 0.6), 0 0 40px rgba(254, 190, 16, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FEBE10';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(254, 190, 16, 0.5), 0 0 30px rgba(254, 190, 16, 0.3)';
            }}
          >
            Share your story
          </motion.button> */}
        </div>

        {/* Testimonials Grid Container */}
        <div className="relative mb-8">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-700 ease-in-out ${!showMore ? "lg:max-h-[600px] lg:overflow-hidden" : "lg:max-h-none"
              }`}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                animate={{
                  opacity: !showMore && index >= 3 ? 0.6 : 1,
                  y: !showMore && index >= 3 ? 20 : 0,
                }}
                className={`relative rounded-2xl overflow-hidden backdrop-blur-2xl border shadow-xl bg-white/10 p-6 sm:p-8 transition-all duration-300 ${showMore || index < 3 ? "" : "hidden lg:block"
                  }`}
                style={{
                  backgroundColor: isDark ? 'rgba(26, 26, 26, 0.6)' : 'rgba(26, 26, 26, 0.15)',
                  borderColor: isDark ? 'rgba(254, 190, 16, 0.8)' : 'rgba(254, 190, 16, 0.1)',
                  borderWidth: isDark ? '0.5px' : '0.8px',
                  boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(254, 190, 16, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Quote */}
                <p
                  className="text-sm sm:text-base leading-relaxed mb-6"
                  style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)" }}
                >
                  {testimonial.quote}
                </p>

                {/* Footer */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
                      <Image
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm sm:text-base font-semibold truncate"
                        style={{ color: isDark ? "#ffffff" : "#000000" }}
                      >
                        {testimonial.author.name}
                        {testimonial.author.age && (
                          <span
                            className="font-normal ml-1"
                            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}
                          >
                            , {testimonial.author.age}
                          </span>
                        )}
                      </p>
                      <p
                        className="text-xs sm:text-sm truncate"
                        style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}
                      >
                        {testimonial.author.role}
                      </p>
                    </div>
                  </div>

                  {/* Platform Icon */}
                  {testimonial.platform && (
                    <div className="flex-shrink-0">
                      {testimonial.platform === "x" ? (
                        <X
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                        />
                      ) : (
                        <Instagram
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Date and Link */}
                <div
                  className="mt-4 pt-4 border-t flex items-center justify-between"
                  style={{ borderColor: isDark ? 'rgba(254, 190, 16, 0.3)' : 'rgba(0, 0, 0, 0.1)' }}
                >
                  {testimonial.type === "post" ? (
                    <a
                      href="#"
                      className="flex items-center gap-1 text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
                    >
                      VIEW POST
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
                    >
                      SHARED STORY
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {testimonial.time && (
                      <span
                        className="text-xs"
                        style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                      >
                        {testimonial.time}
                      </span>
                    )}
                    <span
                      className="text-xs"
                      style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                    >
                      {testimonial.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade Overlay - Desktop Only */}
          {!showMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`hidden lg:block absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t pointer-events-none ${isDark
                  ? "from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent"
                  : "from-white via-white/60 to-transparent"
                }`}
            />
          )}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <motion.button
            onClick={() => setShowMore(!showMore)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base transition-colors"
            style={{
              background: '#FEBE10',
              color: '#1A1A1A',
              boxShadow: '0 4px 12px rgba(254, 190, 16, 0.3), 0 0 20px rgba(254, 190, 16, 0.2)',
              border: '1px solid rgba(254, 190, 16, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFC832';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(254, 190, 16, 0.4), 0 0 25px rgba(254, 190, 16, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FEBE10';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(254, 190, 16, 0.3), 0 0 20px rgba(254, 190, 16, 0.2)';
            }}
          >
            {showMore ? "Show less" : "See more stories"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}

