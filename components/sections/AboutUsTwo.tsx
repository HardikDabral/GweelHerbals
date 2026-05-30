"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import Link from "next/link";

export default function AboutUsTwo() {
  const { theme } = useThemeStore();
  const [isDark, setIsDark] = useState(false);

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
    <section
      id="about"
      className={`py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? "bg-[#1A1A1A]" : "bg-white"
        }`}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Section: Headline */}
          <div className="space-y-6">
            <p
              className="text-xs sm:text-sm uppercase tracking-widest font-bold"
              style={{ color: isDark ? "#FEBE10" : "#000000" }}
            >
              Behind the Brand
            </p>
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed"
              style={{ color: isDark ? "#FFFFFF" : "#000000" }}
            >
              Crafting Pure Himalayan  Wellness
              <br />
              That Connects You to
              <br />
              Nature's Essence
            </h2>
          </div>

          {/* Right Section: Description & CTA */}
          <div className="space-y-8 flex flex-col justify-center">
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl"
              style={{ color: isDark ? "#FFFFFF" : "#000000" }}
            >
              We're a Himalayan brand focused on crafting pure, handcrafted products that honor traditional methods and preserve village heritage. Every product tells the story of the land it comes from.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 pt-4">
              <Link
                href="/#products"
                className="group flex items-center gap-4 w-fit px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 flex-shrink-0"
                style={{
                  background: "#FEBE10",
                  boxShadow: "0 4px 12px rgba(254, 190, 16, 0.3), 0 0 20px rgba(254, 190, 16, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(254, 190, 16, 0.8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFC832";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(254, 190, 16, 0.4), 0 0 25px rgba(254, 190, 16, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FEBE10";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(254, 190, 16, 0.3), 0 0 20px rgba(254, 190, 16, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                }}
              >
                <span
                  className="text-base sm:text-lg font-semibold whitespace-nowrap"
                  style={{ color: "#1A1A1A" }}
                >
                  Explore Our Products
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                  style={{ backgroundColor: "rgba(26, 26, 26, 0.1)" }}
                >
                  <ArrowRight
                    className="w-4 h-4"
                    style={{ color: "#1A1A1A" }}
                  />
                </div>
              </Link>

              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)" }}
              >
                Let's Build Something Meaningful Together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
