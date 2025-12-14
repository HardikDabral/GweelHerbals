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
    id: "the-origin",
    title: "The Silent Hills",
    description:
      "Gweel Herbals began in Pauri Garhwal, where silence had replaced laughter. Villagers migrated, leaving fields barren. Then came the pandemic—and the hills opened their arms. Children returned, and old houses lit up again.",
    icon: Leaf,
  },
  {
    id: "the-awakening",
    title: "A New Purpose",
    description:
      "Out of homecoming emerged a purely courageous idea: Could abandoned land be reborn? Lemongrass became the answer. Terraces were cleared, soil nurtured, and the first green shoots brought hope and strength back to the village.",
    icon: Sparkles,
  },
  {
    id: "farm-to-bottle",
    title: "From Land to Truth",
    description:
      "From traditional steam distillation came pure essential oil. From handpicked leaves came soothing teas. From renewed faith came a brand rooted in truth. Every drop captures the crisp, citrusy aroma of our revival.",
    icon: Droplets,
  },
  {
    id: "pure-honest-himalayan",
    title: "Pure. Honest. Himalayan.",
    description:
      "We are the collective voice of the hills, preserving heritage so no villager has to leave home. When you choose Gweel Herbals, you support the revival of villages and a future where the Himalayas continue to thrive.",
    icon: Flame,
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
        <div className="mb-16 md:mb-24 text-center">
          <p
            className="text-xs mb-1.5 uppercase tracking-widest font-bold"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            OUR ORIGIN
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 max-w-4xl mx-auto leading-tight"
            style={{ color: isDark ? "#FEBE10" : "#000000" }}
          >
            The Story of Gweel
          </h2>
          <p
            className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-center"
            style={{ color: isDark ? "#FFFFFF" : "#000000" }}
          >
            At Gweel Herbal, we grow our own lemongrass and craft every product with pure ingredients, honest processes, and deep connection to the land.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
          {/* Left: About Us Image */}
          <div className="relative w-full max-w-[450px] aspect-square overflow-hidden rounded-[28px] bg-[#e8e6de] shadow-[0_20px_80px_-50px_rgba(0,0,0,0.5)] mx-auto lg:mx-0 flex-shrink-0">
            <img
              src="/images/talents/aboutUs.jpeg"
              alt="Gweel Herbals Origin"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Right: hover-reveal cards */}
          <div className="flex-1 w-full flex flex-col gap-4 lg:min-h-[450px] lg:max-h-[450px] lg:overflow-y-auto lg:pr-1">
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

