"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Star,
    Share2,
    Heart,
    Plus,
    Minus,
    Facebook,
    Twitter,
    Linkedin,
    ArrowLeft
} from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useShopifyProducts } from "@/lib/hooks/useShopifyProducts";
import { getShopifyCheckoutUrl, getShopifyProductUrl } from "@/lib/utils/shopify";

export default function ProductPage() {
    const { handle } = useParams();
    const { theme } = useThemeStore();
    const { products, loading } = useShopifyProducts();
    const [isDark, setIsDark] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [selectedImage, setSelectedImage] = useState(0);

    const product = products.find((p) => p.productHandle === handle);

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

    if (loading && !product) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}`}>
                <div className="w-10 h-10 border-2 border-[#FEBE10] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}`}>
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link href="/shop" className="text-[#FEBE10] hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </div>
        );
    }

    const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

    const images = [product.bigImage, ...(product.additionalImages || [])].slice(0, 5);

    const variantId = product.shopifyVariantId;
    const canCheckout = !!variantId && !variantId.startsWith("YOUR_VARIANT_ID");

    const handleAddToCart = () => {
        if (!canCheckout) return;
        // Hand off to Shopify's hosted cart/checkout
        window.location.href = getShopifyCheckoutUrl(variantId, quantity);
    };

    return (
        <div className={`min-h-screen pt-32 pb-12 transition-colors duration-300 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}`}>
            <div className="max-w-[1440px] mx-auto px-12 sm:px-16 lg:px-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm mb-8 text-neutral-500">
                    <Link href="/" className="hover:text-[#FEBE10]">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/#products" className="hover:text-[#FEBE10]">Products</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#FEBE10] font-medium">{product.category}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className={`relative aspect-square rounded-2xl overflow-hidden border ${isDark ? "border-white/10" : "border-black/5"}`}>
                            <Image
                                src={images[selectedImage]}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-[#FEBE10]" : (isDark ? "border-transparent" : "border-transparent")
                                        }`}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-[#FEBE10]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? "fill-current" : ""}`} />
                                    ))}
                                    <span className="ml-2 text-sm text-neutral-500">({product.reviewsCount} customer reviews)</span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-3xl font-bold text-[#FEBE10]">₹{product.cardContent.price?.current}</span>
                                {product.cardContent.price?.original && (
                                    <span className="text-xl text-neutral-500 line-through">₹{product.cardContent.price.original}</span>
                                )}
                            </div>
                            <p className="text-neutral-500 leading-relaxed max-w-xl">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-neutral-800">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold w-24">Sku:</span>
                                <span className="text-neutral-400">{product.sku}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold w-24">Category:</span>
                                <span className="text-neutral-400">{product.category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold w-24">Tags:</span>
                                <span className="text-neutral-400">{product.tags?.join(", ")}</span>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <span className="font-semibold w-24">Share:</span>
                                <div className="flex gap-4">
                                    <Facebook className="w-4 h-4 cursor-pointer hover:text-[#FEBE10]" />
                                    <Twitter className="w-4 h-4 cursor-pointer hover:text-[#FEBE10]" />
                                    <Linkedin className="w-4 h-4 cursor-pointer hover:text-[#FEBE10]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-6">
                            <div className={`flex items-center rounded-full border ${isDark ? "border-white/10" : "border-black/10"} overflow-hidden`}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-[#FEBE10] hover:text-black transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-[#FEBE10] hover:text-black transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!canCheckout}
                                className={`flex-1 font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2 ${canCheckout
                                    ? "bg-[#FEBE10] text-black hover:scale-105"
                                    : "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed"
                                    }`}
                            >
                                {canCheckout ? "ADD TO CART" : "COMING SOON"}
                                <ShoppingBag className="w-5 h-5" />
                            </button>
                            <button className={`p-4 rounded-full border ${isDark ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-black/5"} transition-all`}>
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs section */}
                <div className="mb-20">
                    <div className="flex border-b border-neutral-800 mb-8 overflow-x-auto">
                        {["Description", "Additional Information", "Reviews"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-8 py-4 font-semibold text-sm transition-all whitespace-nowrap relative ${activeTab === tab.toLowerCase() ? "text-[#FEBE10]" : "text-neutral-500"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FEBE10]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === "description" && (
                            <p className="text-neutral-400 leading-relaxed text-lg">
                                {product.fullDescription || product.description}
                            </p>
                        )}
                        {activeTab === "additional information" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.additionalInfo && Object.entries(product.additionalInfo).map(([key, value]) => (
                                    <div key={key} className="flex border-b border-neutral-800/50 py-3">
                                        <span className="font-semibold w-40 text-neutral-300">{key}</span>
                                        <span className="text-neutral-500">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === "reviews" && (
                            <p className="text-neutral-400 italic">No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <section className="pt-24 border-t border-neutral-800/10 dark:border-white/5">
                    <div className="text-center mb-20 relative">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-6">Related Products</h2>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4">
                            <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 10.5C3.5 10.5 6 1.5 8.5 1.5C11 1.5 13.5 10.5 16 10.5C18.5 10.5 21 1.5 23.5 1.5C26 1.5 28.5 10.5 31 10.5C33.5 10.5 36 1.5 38.5 1.5C41 1.5 43.5 10.5 46 10.5C48.5 10.5 51 1.5 53.5 1.5C56 1.5 58.5 10.5 61 10.5" stroke="#FEBE10" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {relatedProducts.map((item) => (
                            <div
                                key={item.id}
                                className="group cursor-pointer"
                                onClick={() => { window.location.href = getShopifyProductUrl(item.productHandle!, item.shopifyVariantId); }}
                            >
                                <div className={`relative aspect-square rounded-2xl overflow-hidden mb-4 border ${isDark ? "border-white/10" : "border-black/5"}`}>
                                    <Image src={item.smallImage} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h4 className="font-semibold mb-1 group-hover:text-[#FEBE10] transition-colors line-clamp-1">{item.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#FEBE10]">₹{item.cardContent.price?.current}</span>
                                    {item.cardContent.price?.original && (
                                        <span className="text-sm text-neutral-500 line-through">₹{item.cardContent.price.original}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
