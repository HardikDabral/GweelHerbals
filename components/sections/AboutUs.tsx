"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Leaf, Droplets, Flame, Sparkles, Heart } from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const services: Service[] = [
  {
    id: "organic-farming",
    title: "Organic Cultivation",
    description:
      "Farm-grown lemongrass cultivated on family-owned land using sustainable, chemical-free farming practices for maximum purity.",
    icon: Leaf,
  },
  {
    id: "essential-oils",
    title: "Pure Essential Oils",
    description:
      "100% natural lemongrass essential oil, steam-distilled in small batches to preserve freshness, potency, and therapeutic aroma.",
    icon: Droplets,
  },
  {
    id: "handcrafted-candles",
    title: "Handcrafted Candles",
    description:
      "Artisan aroma candles made with pure plant extracts. No synthetic additives, only natural fragrances that uplift and refresh.",
    icon: Flame,
  },
  {
    id: "herbal-fragrances",
    title: "Herbal Fragrances",
    description:
      "Naturally extracted fragrances crafted with care. Experience uplifting aromas that help you relax and reconnect with nature.",
    icon: Sparkles,
  },
  {
    id: "wellness",
    title: "Wellness & Lifestyle",
    description:
      "More than products — a lifestyle rooted in earth's purity. Therapeutic benefits that promote relaxation, refresh your space, and support clean living.",
    icon: Heart,
  },
];

export default function AboutUs() {
  const [activeId, setActiveId] = useState<string>(services[0].id);
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

  const sectionBg = "bg-white dark:bg-background text-black dark:text-white";
  const cardActive =
    isDark ? "border-white/30 bg-white/10 shadow-[0_25px_90px_-55px_rgba(0,0,0,0.9)]" : "border-black/20 bg-black/5 shadow-[0_20px_70px_-60px_rgba(0,0,0,0.35)]";
  const cardIdle =
    isDark ? "border-white/5 bg-white/5" : "border-black/10 bg-black/5";
  const cardTextMuted = isDark ? "text-white/70" : "text-black/70";
  const gradientFrom = isDark ? "from-white/10 via-white/5" : "from-black/10 via-black/5";

  return (
    <section id="about" className={`${sectionBg} mb-20 px-8 sm:px-10 lg:px-16 transition-colors duration-300`}>
      <div className="mx-auto max-w-[1440px] space-y-12">
        <div className="space-y-3 ">
          {/* <p
            className="text-xs sm:text-sm tracking-wider font-medium"
            style={{ color: "#FEBE10" }}
          >
            INTEGRATED DIGITAL SOLUTIONS
          </p> */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold leading-tight"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            Farm to Bottle Wellness
          </h1>
          <p
            className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-center"
            style={{ color: isDark ? "#FFFFFF" : "#000000" }}
          >
            At Gweel Herbal, we grow our own lemongrass and craft every product with pure ingredients, honest processes, and deep connection to the land.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-20">
          {/* Left: image placeholder */}
          <div className="relative w-full max-w-[450px] aspect-square overflow-hidden rounded-[28px] bg-[#e8e6de] shadow-[0_20px_80px_-50px_rgba(0,0,0,0.5)] mx-auto md:mx-0 flex-shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(0,0,0,0.05),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.05),transparent_45%)]" />
          </div>

          {/* Right: hover-reveal cards */}
          <div className="flex-1 w-full flex flex-col gap-4 md:min-h-[450px] md:max-h-[450px] md:overflow-y-auto md:pr-1">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = activeId === service.id;

              return (
                <button
                  key={service.id}
                  type="button"
                  onMouseEnter={() => setActiveId(service.id)}
                  onFocus={() => setActiveId(service.id)}
                  onClick={() => setActiveId(service.id)}
                  aria-pressed={isActive}
                  className={`group relative w-full overflow-hidden rounded-2xl border px-5 py-5 text-left transition-all duration-400 ease-out ${isActive
                    ? cardActive
                    : `${cardIdle} opacity-80 hover:border-white/20 hover:bg-white/10 hover:opacity-100 focus-visible:border-white/30 focus-visible:bg-white/10`
                    } ${!isDark ? "hover:border-black/20 hover:bg-black/5 focus-visible:border-black/20 focus-visible:bg-black/5" : ""}`}
                  style={{ willChange: isActive ? 'auto' : 'transform, opacity' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 transition-colors duration-400 ${isDark ? "bg-white/10" : "bg-black/5"}`}>
                      <Icon className={`h-5 w-5 transition-colors duration-400 ${isDark ? "text-amber-400" : "text-black"}`} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-lg font-semibold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                        {service.title}
                      </p>
                      <div
                        className={`overflow-hidden transition-all duration-400 ease-out ${isActive || 'group-hover:max-h-32'}`}
                        style={{
                          maxHeight: isActive ? '8rem' : '0',
                          opacity: isActive ? 1 : 0,
                          marginTop: isActive ? '0.5rem' : '0',
                        }}
                      >
                        <p className={`text-sm leading-relaxed ${cardTextMuted}`}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 -z-10 bg-gradient-to-r ${gradientFrom} to-transparent transition-opacity duration-400 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

