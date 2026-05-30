"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getShopifyProductUrl } from "@/lib/utils/shopify";
import {
    Search,
    ChevronDown,
    LayoutGrid,
    List,
    Star,
    SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useShopifyProducts } from "@/lib/hooks/useShopifyProducts";

export default function ShopPage() {
    const { theme } = useThemeStore();
    const { products, loading } = useShopifyProducts();
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(1000);
    const [sortBy, setSortBy] = useState("featured");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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

    const categories = useMemo(() => {
        const cats = products.map(p => p.category || "Uncategorized");
        const uniqueCats = ["All", ...Array.from(new Set(cats))];
        return uniqueCats.map(cat => ({
            name: cat,
            count: cat === "All" ? products.length : products.filter(p => (p.category || "Uncategorized") === cat).length
        }));
    }, [products]);

    const tags = useMemo(() => {
        const allTags = products.flatMap(p => p.tags || []);
        return Array.from(new Set(allTags)).slice(0, 10);
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
                const matchesPrice = (p.cardContent.price?.current || 0) <= priceRange;
                return matchesSearch && matchesCategory && matchesPrice;
            })
            .sort((a, b) => {
                if (sortBy === "price-low") return (a.cardContent.price?.current || 0) - (b.cardContent.price?.current || 0);
                if (sortBy === "price-high") return (b.cardContent.price?.current || 0) - (a.cardContent.price?.current || 0);
                if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
                return 0; // featured
            });
    }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}`}>
            {/* Immersive Shop Header */}
            <div className="relative h-[25vh] md:h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/talents/bigImageone.jpg"
                        alt="Shop Banner"
                        fill
                        className="object-cover opacity-30 grayscale contrast-125"
                    />
                    <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]" : "bg-gradient-to-b from-white/80 via-transparent to-white"}`} />
                </div>
                <div className="relative z-10 text-center space-y-4 px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#FEBE10] font-bold tracking-[0.5em] uppercase text-[10px]"
                    >
                        Pure Himalayan Treasures
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter"
                    >
                        THE APOTHECARY
                    </motion.h1>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pb-32 pt-8 lg:pt-0">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4 space-y-8 lg:space-y-12">
                        <div className="flex items-center gap-4 lg:block">
                            {/* Search Bar - Always Visible */}
                            <div className="relative group flex-1">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full bg-transparent border-b ${isDark ? "border-white/10" : "border-black/10"} py-3 pl-10 focus:outline-none focus:border-[#FEBE10] transition-all text-sm tracking-wide`}
                                />
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-hover:text-[#FEBE10] transition-colors" />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`lg:hidden p-3 rounded-2xl border transition-all ${isFilterOpen ? "bg-[#FEBE10] border-[#FEBE10] text-black" : "border-black/10 dark:border-white/10 text-neutral-500"}`}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Collapsible Filters for Mobile / Permanent for Desktop */}
                        <div className={`${isFilterOpen ? "block" : "hidden lg:block"} space-y-12 animate-in fade-in slide-in-from-top-4 duration-500`}>
                            {/* Categories */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500">Archives</h3>
                                <div className="space-y-4">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.name}
                                            onClick={() => {
                                                setSelectedCategory(cat.name);
                                                if (window.innerWidth < 1024) setIsFilterOpen(false);
                                            }}
                                            className={`flex items-center justify-between w-full text-left transition-all group ${selectedCategory === cat.name ? "text-[#FEBE10] translate-x-3" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}
                                        >
                                            <span className="text-sm font-medium tracking-[0.05em] uppercase">{cat.name}</span>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-[1px] w-4 bg-[#FEBE10] transition-all duration-500 ${selectedCategory === cat.name ? "opacity-100" : "opacity-0"}`} />
                                                <span className={`text-[10px] tabular-nums font-bold ${selectedCategory === cat.name ? "opacity-100" : "opacity-30"}`}>{cat.count}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500">Value</h3>
                                    <span className="text-sm font-bold text-[#FEBE10]">₹{priceRange}</span>
                                </div>
                                <div className="relative pt-2">
                                    <input
                                        type="range"
                                        min="100"
                                        max="2000"
                                        step="50"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="w-full h-[2px] bg-neutral-800 appearance-none outline-none cursor-pointer accent-[#FEBE10]"
                                    />
                                    <div className="flex justify-between mt-4 text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
                                        <span>₹100</span>
                                        <span>₹2000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Sidebar Content - Hidden on Mobile */}
                        <div className="hidden lg:block space-y-12">
                            <div className="space-y-8 pt-4">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500 text-center">Trove Highlights</h3>
                                <div className="space-y-6">
                                    {products.slice(0, 3).map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => { window.location.href = getShopifyProductUrl(p.productHandle!, p.shopifyVariantId); }}
                                            className="flex gap-4 group cursor-pointer items-center"
                                        >
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/5">
                                                <Image src={p.smallImage} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-bold tracking-tight line-clamp-1 group-hover:text-[#FEBE10] transition-colors">{p.title.split('–')[0]}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-[#FEBE10]">₹{p.cardContent.price?.current}</span>
                                                    <div className="flex items-center text-[8px] text-[#FEBE10]/40">
                                                        <Star className="w-2 h-2 fill-current" />
                                                        <span className="ml-1 tracking-tighter">{p.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500 text-center">Essential Tags</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {tags.map(tag => (
                                        <button
                                            key={tag}
                                            className={`px-4 py-2 border rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${isDark ? "border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-[#FEBE10] text-neutral-400 hover:text-white" : "border-black/5 bg-black/[0.02] hover:bg-black/5 hover:border-[#FEBE10] text-neutral-600 hover:text-black"}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={`p-8 rounded-[40px] relative overflow-hidden group ${isDark ? "bg-white/[0.01] border border-white/5" : "bg-black/[0.01] border border-black/5"}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEBE10]/10 blur-[60px] -mr-16 -mt-16 group-hover:bg-[#FEBE10]/20 transition-all duration-700" />
                                <h4 className="text-sm font-bold tracking-tight text-[#FEBE10] mb-2">Himalayan Origin</h4>
                                <p className="text-[11px] text-neutral-500 leading-relaxed font-light">Every vessel in our archives is hand-filled in Pauri Garhwal. Pure mountain soul, bottled for your sanctuary.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Shop Content */}
                    <main className="w-full lg:w-3/4 space-y-8 lg:space-y-12">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-black/[0.03] dark:border-white/[0.03]">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500">{filteredProducts.length} Results</span>
                                <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />
                                <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1 self-start sm:self-auto">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-[#FEBE10] text-black shadow-lg" : "text-neutral-500"}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-[#FEBE10] text-black shadow-lg" : "text-neutral-500"}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={`appearance-none bg-transparent py-2 pl-4 pr-10 text-[10px] uppercase tracking-[0.4em] font-bold cursor-pointer focus:outline-none transition-all ${isDark ? "hover:text-white" : "hover:text-black"}`}
                                >
                                    <option value="featured">Featured Archive</option>
                                    <option value="price-low">Value: Low to High</option>
                                    <option value="price-high">Value: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-12" : "space-y-12"}>
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, i) => (
                                    <motion.div
                                        layout
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                        className={`group cursor-pointer ${viewMode === "list" ? "flex flex-col sm:flex-row gap-8 items-center" : ""}`}
                                        onClick={() => { window.location.href = getShopifyProductUrl(product.productHandle!, product.shopifyVariantId); }}
                                    >
                                        <div className={`relative overflow-hidden aspect-square rounded-[32px] sm:rounded-[48px] shadow-2xl transition-all duration-1000 group-hover:shadow-[#FEBE10]/10 ${viewMode === "list" ? "w-full sm:w-1/3" : "w-full"} ${isDark ? "bg-white/[0.03]" : "bg-neutral-50"}`}>
                                            <Image
                                                src={product.smallImage}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-[2000ms] group-hover:scale-110 group-hover:rotate-1"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000 backdrop-grayscale-[0.5] group-hover:backdrop-grayscale-0" />

                                            {/* Luxury Label */}
                                            {product.cardContent.price?.discount && (
                                                <div className="absolute top-6 left-6 py-1.5 px-3 bg-[#FEBE10] text-black text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg z-10">
                                                    Limited Offer
                                                </div>
                                            )}

                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-90 group-hover:scale-100">
                                                <span className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-[0.3em] rounded-full text-white">
                                                    Examine
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`space-y-4 ${viewMode === "list" ? "w-full sm:w-2/3 px-4" : "px-4 pt-8"}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">{product.category}</span>
                                                <div className="flex items-center gap-1 text-[#FEBE10] scale-75 origin-left">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-xs font-bold opacity-60 tracking-normal">{product.rating}</span>
                                                </div>
                                            </div>
                                            <h4 className="text-xl sm:text-2xl font-bold tracking-tighter group-hover:text-[#FEBE10] transition-colors leading-tight line-clamp-1">{product.title.split('–')[0]}</h4>

                                            <div className="flex items-center gap-3 sm:gap-6">
                                                <span className="font-bold text-[#FEBE10] text-lg sm:text-2xl tracking-tighter">₹{product.cardContent.price?.current}</span>
                                                {product.cardContent.price?.original && (
                                                    <span className="text-sm text-neutral-600 line-through font-light opacity-50">₹{product.cardContent.price.original}</span>
                                                )}
                                            </div>

                                            {viewMode === "list" && (
                                                <p className="text-neutral-500 text-sm leading-relaxed max-w-xl line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Loading State */}
                        {loading && products.length === 0 && (
                            <div className="py-40 flex justify-center">
                                <div className="w-10 h-10 border-2 border-[#FEBE10] border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredProducts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-40 text-center"
                            >
                                <h3 className="text-2xl font-bold text-neutral-600 mb-4 tracking-tighter">
                                    {products.length === 0 ? "No products available yet." : "No archives match your ritual."}
                                </h3>
                                {products.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
                                            setPriceRange(1000);
                                        }}
                                        className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FEBE10] border-b border-[#FEBE10] pb-2 hover:opacity-50 transition-all"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {filteredProducts.length > 9 && (
                            <div className="flex items-center justify-center gap-6 pt-24">
                                <div className="h-[1px] w-12 bg-neutral-800" />
                                <div className="flex gap-4">
                                    {[1, 2, 3].map(page => (
                                        <button
                                            key={page}
                                            className={`w-10 h-10 rounded-full text-[10px] font-bold border transition-all ${page === 1 ? "bg-[#FEBE10] border-[#FEBE10] text-black" : "border-neutral-800 text-neutral-500 hover:border-[#FEBE10] hover:text-[#FEBE10]"}`}
                                        >
                                            0{page}
                                        </button>
                                    ))}
                                </div>
                                <div className="h-[1px] w-12 bg-neutral-800" />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
