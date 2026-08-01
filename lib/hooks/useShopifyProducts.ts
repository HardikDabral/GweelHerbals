"use client";

import { useEffect, useState } from "react";
import { type TalentSection } from "@/lib/data/products";
import { getShopifyProducts, type ShopifyLiveProduct } from "@/lib/utils/shopify";

export interface MergedProduct extends TalentSection {
    /** The live Shopify product this entry was built from. */
    live: ShopifyLiveProduct;
    isLive: true;
}

const PLACEHOLDER_IMAGE = "/images/talents/bigImageone.jpg";

/**
 * Headline discount the storefront advertises. Used only to derive a
 * struck-through "MRP" when a product has no compare-at price in Shopify:
 * at 0.25 a ₹299 product shows against ₹399. Setting a compare-at price on
 * the product in Shopify always overrides this.
 */
const ASSUMED_DISCOUNT = 0.25;

/** Lowest star rating a product can be shown with. */
const MIN_RATING = 4.2;
const MAX_RATING = 5;

/**
 * Ratings pinned by hand, keyed on the Shopify product handle. Anything not
 * listed here falls back to the derived rating below.
 */
const RATING_OVERRIDES: Record<string, number> = {
    "berry-velvet-luxury-car-perfume-10ml": 4.7,
    "lemongrass-aroma-essence-100-pure-organic-amp-undiluted-lemongrass-oil": 5,
};

/**
 * Pick a star rating in the MIN_RATING–MAX_RATING band, varied per product.
 *
 * Derived by hashing the product handle rather than calling Math.random(), so a
 * product keeps the same rating across re-renders, route changes and reloads —
 * a number that shifted on every paint would read as broken, and the shop page
 * sorts by rating, so an unstable value would reshuffle the grid as you look
 * at it.
 */
function ratingFor(key: string): number {
    const pinned = RATING_OVERRIDES[key];
    if (pinned !== undefined) return pinned;

    // FNV-1a — small, stable, and well spread across short strings like handles.
    let hash = 0x811c9dc5;
    for (let i = 0; i < key.length; i++) {
        hash ^= key.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    const steps = Math.round((MAX_RATING - MIN_RATING) * 10) + 1; // 4.2, 4.3, … 5.0
    const step = (hash >>> 0) % steps;
    return Math.round((MIN_RATING + step * 0.1) * 10) / 10;
}

/**
 * Build the UI product shape entirely from a live Shopify product.
 * Shopify is the single source of truth — anything Shopify doesn't provide
 * (e.g. star ratings) gets a sensible neutral default.
 */
function mapLiveToProduct(live: ShopifyLiveProduct, index: number): MergedProduct {
    const images = live.images.length > 0 ? live.images : [PLACEHOLDER_IMAGE];
    const current = Math.round(live.price);
    // Use Shopify's compare-at price if set; otherwise work the "was" price back
    // out of ASSUMED_DISCOUNT so the pair always reads as that percentage off.
    const original =
        live.compareAtPrice && live.compareAtPrice > live.price
            ? Math.round(live.compareAtPrice)
            : Math.round(current / (1 - ASSUMED_DISCOUNT));
    const discount =
        original > current ? Math.round(((original - current) / original) * 100) : 0;
    const category = live.productType || "Wellness";

    const additionalInfo: Record<string, string> = {
        Availability: live.availableForSale ? "In Stock" : "Out of Stock",
    };
    if (live.sku) additionalInfo["SKU"] = live.sku;
    if (live.vendor) additionalInfo["Brand"] = live.vendor;
    if (live.productType) additionalInfo["Type"] = live.productType;

    return {
        id: index + 1,
        number: category,
        title: live.title,
        description: live.description,
        bigImage: images[0],
        smallImage: images[1] || images[0],
        additionalImages: images,
        shopifyVariantId: live.variantId,
        productHandle: live.handle,
        sku: live.sku,
        category,
        tags: live.tags,
        rating: ratingFor(live.handle || live.id || live.title),
        reviewsCount: 0,
        fullDescription: live.description,
        additionalInfo,
        cardContent: {
            title: category.toUpperCase(),
            price: { current, original, discount, unit: "" },
        },
        live,
        isLive: true,
    };
}

/**
 * Returns the products listed in Shopify, mapped into the UI shape.
 * No hardcoded products — if the store is empty or unreachable, returns [].
 */
export function useShopifyProducts() {
    const [products, setProducts] = useState<MergedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        getShopifyProducts()
            .then((live) => {
                if (active) setProducts(live.map(mapLiveToProduct));
            })
            .catch((e) => {
                if (active) setError(String(e));
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    return { products, loading, error };
}
