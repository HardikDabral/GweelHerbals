export const getShopifyCheckoutUrl = (variantId: string, quantity: number = 1): string => {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "8199997907.myshopify.com";

    if (!domain) {
        console.error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined");
        return "#";
    }

    // Ensure domain doesn't have https:// or trailing slashes for consistency (though inputs vary)
    // But typically it's "shop.myshopify.com"
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    return `https://${cleanDomain}/cart/${variantId}:${quantity}`;
};

export const getShopifyProductUrl = (handle: string, variantId?: string): string => {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "8199997907.myshopify.com";

    if (!domain) {
        console.error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined");
        return "#";
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const baseUrl = `https://${cleanDomain}/products/${handle}`;

    return variantId ? `${baseUrl}?variant=${variantId}` : baseUrl;
};
