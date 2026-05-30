export type TalentSection = {
    id: number;
    number: string;
    title: string;
    description: string;
    bigImage: string;
    smallImage: string;
    additionalImages?: string[];
    shopifyVariantId?: string;
    productHandle?: string;
    luxuryProofPoints?: string[];
    cardContent: {
        title?: string;
        subtitle?: string;
        age?: string;
        price?: {
            current: number;
            original: number;
            discount: number;
            unit: string;
        };
        items?: Array<{ score: string; label: string } | string>;
        recommendations?: Array<{ category: string; item: string }>;
    };
    sku?: string;
    category?: string;
    tags?: string[];
    rating?: number;
    reviewsCount?: number;
    fullDescription?: string;
    additionalInfo?: Record<string, string>;
};

// Products are sourced live from Shopify (see lib/utils/shopify.ts +
// lib/hooks/useShopifyProducts.ts). No products are hardcoded here anymore.
export const talentSections: TalentSection[] = [];
