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
 * Build the UI product shape entirely from a live Shopify product.
 * Shopify is the single source of truth — anything Shopify doesn't provide
 * (e.g. star ratings) gets a sensible neutral default.
 */
function mapLiveToProduct(live: ShopifyLiveProduct, index: number): MergedProduct {
    const images = live.images.length > 0 ? live.images : [PLACEHOLDER_IMAGE];
    const current = Math.round(live.price);
    // Use Shopify's compare-at price if set; otherwise show a "was" price of current + 200.
    const original =
        live.compareAtPrice && live.compareAtPrice > live.price
            ? Math.round(live.compareAtPrice)
            : current + 200;
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
        rating: 5,
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
