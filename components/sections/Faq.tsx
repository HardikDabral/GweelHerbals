"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/store/useThemeStore";

type FaqItem = {
  question: string;
  answer: string;
  bullets?: string[];
};

const faqs: FaqItem[] = [
  {
    question: "What makes Gweel Herbal products different from others?",
    answer:
      "Gweel Herbal is a farm-to-bottle brand. We grow our own lemongrass organically on family-owned land and craft every product with pure, natural ingredients.",
    bullets: [
      "100% organic cultivation with zero chemicals or pesticides",
      "Hand-selected leaves steam-distilled in small batches for maximum potency",
      "No synthetic additives, artificial fragrances, or harmful chemicals",
      "Sustainable, eco-friendly processes from farm to your home",
    ],
  },
  {
    question: "Are your products really 100% natural and organic?",
    answer:
      "Yes! Every Gweel Herbal product is made from pure, organically grown lemongrass. We use steam distillation to extract essential oils and handcraft our candles and fragrances with only natural plant extracts. No synthetics, ever.",
  },
  {
    question: "What products does Gweel Herbal offer?",
    answer:
      "We offer a complete range of lemongrass-based wellness products including pure essential oils, handcrafted aroma candles, herbal fragrances, room sprays, diffuser oils, and premium gift sets. All products are 100% natural and therapeutic.",
  },
  {
    question: "How should I use lemongrass essential oil?",
    answer:
      "Our lemongrass essential oil is versatile and therapeutic. Add a few drops to a diffuser for aromatherapy, mix with carrier oils for massage, use in DIY skincare, or add to cleaning solutions for a fresh, natural scent. Always dilute before topical use.",
  },
  {
    question: "How do I order Gweel Herbal products?",
    answer:
      "You can browse our product range on our website and place orders directly. We offer secure payment options and ship across India. For bulk orders or custom gift sets, please contact us directly for special pricing.",
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
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

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const mutedColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const textColor = isDark ? "#ffffff" : "#000000";

  return (
    <section id="faqs" className={`py-16 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-[#1A1A1A]" : "bg-white"}`}>
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex items-center justify-center gap-4">
          <div className="text-center">
            <p
              className="text-xs mb-1.5 uppercase tracking-widest font-bold"
              style={{ color: isDark ? "#FEBE10" : "#000000" }}
            >
              SUPPORT
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold"
              style={{ color: isDark ? "#FEBE10" : "#000000" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

        </div>

        <div
          className="rounded-3xl border overflow-hidden"
          style={{ borderColor }}
        >
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b last:border-b-0"
                style={{ borderColor }}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 md:py-6 text-left"
                >
                  <div>
                    <p
                      className="text-sm sm:text-base md:text-lg font-medium"
                      style={{ color: textColor }}
                    >
                      {faq.question}
                    </p>
                  </div>

                  <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border text-xs shrink-0">
                    <span
                      className="transition-transform"
                      style={{
                        transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
                        color: textColor,
                      }}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className="px-4 sm:px-6 pb-5 sm:pb-6 md:pb-7 text-sm sm:text-base">
                        <p
                          className="mb-3 sm:mb-4 leading-relaxed"
                          style={{ color: mutedColor }}
                        >
                          {faq.answer}
                        </p>

                        {faq.bullets && (
                          <ul className="list-disc pl-5 space-y-1.5 sm:space-y-2">
                            {faq.bullets.map((item) => (
                              <li
                                key={item}
                                className="leading-relaxed"
                                style={{ color: mutedColor }}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


