import type { MetadataRoute } from "next";
import { getShopifyProducts } from "@/lib/utils/shopify";
import { absoluteUrl } from "@/lib/utils/site";

// Products come from Shopify at request time, so re-generate hourly rather than
// baking the product list in at build time.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl("/"),
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: absoluteUrl("/shop"),
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    // getShopifyProducts() already swallows network/token failures and returns
    // [] — so a Shopify outage degrades to a static-only sitemap instead of
    // failing the whole route.
    const products = await getShopifyProducts();

    const productRoutes: MetadataRoute.Sitemap = products
        .filter((product) => Boolean(product.handle))
        .map((product) => ({
            url: absoluteUrl(`/product/${encodeURIComponent(product.handle)}`),
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

    return [...staticRoutes, ...productRoutes];
}
