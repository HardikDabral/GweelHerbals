"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useThemeStore } from "@/lib/store/useThemeStore";

export function Footer() {
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

  // Using conditional classes based on isDark state to ensure reliability
  const footerBg = isDark ? "bg-[#1A1A1A]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const mutedTextColor = isDark ? "text-white/70" : "text-gray-600";
  const hoverColor = "hover:text-[#FEBE10]";

  return (
    <footer className={`${footerBg} py-12 md:py-16 transition-colors duration-300 border-t border-transparent`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>
              Gweel Herbals
            </h3>
            <p className={`text-sm ${mutedTextColor} leading-relaxed mb-6`}>
              Cultivating wellness from the ground up. 100% organic, farm-to-bottle herbal products crafted with care for your pure lifestyle.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className={`font-semibold ${textColor} mb-4`}>Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#about" className={`${mutedTextColor} ${hoverColor} transition-colors`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#stories" className={`${mutedTextColor} ${hoverColor} transition-colors`}>
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className={`${mutedTextColor} ${hoverColor} transition-colors`}>
                  Why Us
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className={`${mutedTextColor} ${hoverColor} transition-colors`}>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className={`font-semibold ${textColor} mb-4`}>Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className={`${mutedTextColor} ${hoverColor} transition-colors`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className={`${mutedTextColor} ${hoverColor} transition-colors`}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`font-semibold ${textColor} mb-4`}>Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:consumercare@gweelherbals.com"
                  className={`${mutedTextColor} ${hoverColor} transition-colors break-all`}
                >
                  consumercare@gweelherbals.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className={`${mutedTextColor} ${hoverColor} transition-colors`}
                >
                 +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - No top border as requested ("no lines") */}
        <div className={`mt-12 text-center text-sm ${mutedTextColor}`}>
          © {new Date().getFullYear()} Gweel Herbals. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
