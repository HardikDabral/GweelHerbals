// --- Shopify Storefront config ---------------------------------------------
// All values come from the gitignored .env (NEXT_PUBLIC_* so they reach the
// browser — the Storefront public token is safe to expose by design).
// The token is intentionally NOT hardcoded here so it never lands in the repo.
const SHOPIFY_DOMAIN =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "gn9skg-tb.myshopify.com";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-10";

const cleanDomain = (d: string) => d.replace(/^https?:\/\//, "").replace(/\/$/, "");

// --- Checkout / product permalinks (no API needed) -------------------------
export const getShopifyCheckoutUrl = (variantId: string, quantity: number = 1): string => {
    const domain = cleanDomain(SHOPIFY_DOMAIN);
    if (!domain) {
        console.error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined");
        return "#";
    }
    // Cart permalinks expect the NUMERIC variant id, e.g. cart/47926278684846:1
    return `https://${domain}/cart/${variantId}:${quantity}`;
};

export const getShopifyProductUrl = (handle: string, variantId?: string): string => {
    const domain = cleanDomain(SHOPIFY_DOMAIN);
    if (!domain) {
        console.error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined");
        return "#";
    }
    const baseUrl = `https://${domain}/products/${encodeURIComponent(handle)}`;
    return variantId ? `${baseUrl}?variant=${variantId}` : baseUrl;
};

// --- Storefront GraphQL API ------------------------------------------------
export interface ShopifyLiveProduct {
    id: string;           // numeric product id
    handle: string;
    title: string;
    description: string;
    productType: string;
    vendor: string;
    tags: string[];
    availableForSale: boolean;
    price: number;        // first variant's price amount
    compareAtPrice: number | null; // "original" price, if on sale
    currencyCode: string;
    sku: string;
    variantId: string;    // NUMERIC id, ready for cart permalinks
    variantGid: string;   // full gid://... id
    images: string[];
}

/** Turn a variant gid ("gid://shopify/ProductVariant/123") into "123". */
export const parseVariantNumericId = (gid: string): string =>
    gid.split("/").pop() || gid;

/** Decode HTML entities (e.g. "&amp;" → "&") that the Storefront API can return in text. */
export function decodeEntities(str: string): string {
    if (!str) return str;
    return str
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&#x27;|&apos;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
        .replace(/&amp;/g, "&");
}

async function shopifyFetch<T>(query: string): Promise<T | null> {
    if (!STOREFRONT_TOKEN) {
        console.warn("Storefront token missing — skipping Shopify fetch (using local data).");
        return null;
    }
    try {
        const res = await fetch(
            `https://${cleanDomain(SHOPIFY_DOMAIN)}/api/${API_VERSION}/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
                },
                body: JSON.stringify({ query }),
            }
        );
        if (!res.ok) {
            console.warn(`Shopify API returned ${res.status} — falling back to local data.`);
            return null;
        }
        const json = await res.json();
        if (json.errors) {
            console.warn("Shopify API errors:", json.errors);
            return null;
        }
        return json.data as T;
    } catch (err) {
        console.warn("Shopify fetch failed — falling back to local data.", err);
        return null;
    }
}

/** Fetch all live products. Returns [] if the store/token is unavailable. */
export async function getShopifyProducts(): Promise<ShopifyLiveProduct[]> {
    const query = `{
        products(first: 100) {
            edges {
                node {
                    id
                    handle
                    title
                    description
                    productType
                    vendor
                    tags
                    availableForSale
                    images(first: 6) { edges { node { url } } }
                    variants(first: 1) {
                        edges {
                            node {
                                id
                                sku
                                price { amount currencyCode }
                                compareAtPrice { amount }
                            }
                        }
                    }
                }
            }
        }
    }`;

    type Resp = {
        products: {
            edges: Array<{
                node: {
                    id: string;
                    handle: string;
                    title: string;
                    description: string;
                    productType: string;
                    vendor: string;
                    tags: string[];
                    availableForSale: boolean;
                    images: { edges: Array<{ node: { url: string } }> };
                    variants: {
                        edges: Array<{
                            node: {
                                id: string;
                                sku: string;
                                price: { amount: string; currencyCode: string };
                                compareAtPrice: { amount: string } | null;
                            };
                        }>;
                    };
                };
            }>;
        };
    };

    const data = await shopifyFetch<Resp>(query);
    if (!data) return [];

    return data.products.edges.map(({ node }) => {
        const variant = node.variants.edges[0]?.node;
        return {
            id: parseVariantNumericId(node.id),
            handle: node.handle,
            title: decodeEntities(node.title),
            description: decodeEntities(node.description),
            productType: decodeEntities(node.productType || ""),
            vendor: decodeEntities(node.vendor || ""),
            tags: (node.tags || []).map(decodeEntities),
            availableForSale: node.availableForSale,
            price: variant ? parseFloat(variant.price.amount) : 0,
            compareAtPrice: variant?.compareAtPrice
                ? parseFloat(variant.compareAtPrice.amount)
                : null,
            currencyCode: variant?.price.currencyCode || "INR",
            sku: variant?.sku || "",
            variantId: variant ? parseVariantNumericId(variant.id) : "",
            variantGid: variant?.id || "",
            images: node.images.edges.map((e) => e.node.url),
        };
    });
}
