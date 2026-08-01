// --- Merchandising badges ---------------------------------------------------
// Badges are driven by Shopify product tags so they can be switched on and off
// per product from admin. Only tags listed here surface on the storefront —
// internal tags like "aromatherapy" stay hidden.
//
// Keep these lists in sync with the Shopify theme's product section, which
// applies the same rule to gweelherbals.myshopify.com.

/** Praise tags — shown in brand gold. */
const HIGHLIGHT_TAGS = ["bestseller"];

/** Scarcity tags — shown in red so they read as urgent. */
const URGENCY_TAGS = ["last few pieces left"];

export type BadgeKind = "highlight" | "urgency";

export interface ProductBadge {
    /** The tag exactly as Shopify stores it, so admin controls the wording. */
    label: string;
    kind: BadgeKind;
}

/**
 * Map a product's Shopify tags to the badges it should display.
 * Matching is case- and whitespace-insensitive; unrecognised tags are dropped.
 */
export function badgesFor(tags: string[] | undefined): ProductBadge[] {
    if (!tags?.length) return [];

    const badges: ProductBadge[] = [];
    for (const tag of tags) {
        const key = tag.trim().toLowerCase();
        if (HIGHLIGHT_TAGS.includes(key)) {
            badges.push({ label: tag, kind: "highlight" });
        } else if (URGENCY_TAGS.includes(key)) {
            badges.push({ label: tag, kind: "urgency" });
        }
    }
    return badges;
}

/** Tailwind classes for a badge pill, by kind. */
export const badgeClasses: Record<BadgeKind, string> = {
    highlight: "bg-[#FEBE10] text-[#1A1A1A]",
    urgency: "bg-[#B3261E] text-white",
};
