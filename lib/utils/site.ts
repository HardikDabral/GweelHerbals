// --- Canonical site origin -------------------------------------------------
// Used by app/sitemap.ts and app/robots.ts to build absolute URLs (the sitemap
// spec requires them). Override per-environment with NEXT_PUBLIC_SITE_URL —
// e.g. a Vercel preview deploy — otherwise we fall back to the live domain.
const FALLBACK_SITE_URL = "https://gweelherbals.com";

/** Site origin with any trailing slash stripped, e.g. "https://gweelherbals.com". */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL)
    .replace(/\/$/, "");

/** Join a root-relative path onto SITE_URL, e.g. absoluteUrl("/shop"). */
export const absoluteUrl = (path: string): string =>
    `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
