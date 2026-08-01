# Gweel Herbals — Shopify theme sections

Two ready-to-use Liquid sections that mirror the Next.js storefront, so the
Shopify-hosted home page (`gn9skg-tb.myshopify.com`) isn't blank if a visitor
trims the URL down to the root.

## Files

| File | What it is |
|------|------------|
| `sections/gweel-hero.liquid`   | Full-screen rounded hero with background image, headline, "Shop Now" button. |
| `sections/gweel-header.liquid`  | Floating pill navbar — centered brand, nav links, gold "Buy on Amazon" button, mobile drawer. |
| `sections/gweel-announcement-bar.liquid` | Gold scrolling marquee strip for promos / discount codes. |

## Install

1. In Shopify admin → **Online Store → Themes → ⋯ → Edit code**.
2. Under **Sections**, click **Add a new section**, name it `gweel-hero`, and paste
   the contents of `gweel-hero.liquid`. Repeat for `gweel-header`.
3. Create the nav menu: **Online Store → Navigation → Add menu** named
   `main-menu` with: Shop → `/collections/all`, About Us, Stories, FAQs.
4. Go to **Customize** → on the **Home page** template click **Add section** →
   pick **Gweel Hero**. Add **Gweel Header** to the header group (or top of the page).
5. In the editor, set the hero **Background image**, text, and button link.

## Announcement bar (marquee)

1. **Edit code → Sections → Add a new section**, name it
   `gweel-announcement-bar`, paste in `gweel-announcement-bar.liquid`.
2. **Customize** → in the left panel open the **Header** group → **Add section**
   → **Gweel Announcement Bar**. Drag it so it sits **above** the header.
3. Edit the **Message**, **Scroll duration**, and colours in the right-hand panel.

Notes:

- `gweel-header.liquid` is `position: fixed`, so it floats over the page and
  will cover a non-sticky bar once the visitor scrolls. Either tick
  **Stick to top on scroll** on the announcement bar, or bump `.gweel-nav`'s
  `top` value so the pill clears the strip.
- The strip only fills the viewport if one repetition of the message is wider
  than the screen. If a blank gap appears mid-loop on a wide monitor, raise
  **Repetitions**.
- The bar hides itself entirely when **Message** is left blank — that's the
  clean way to switch the promo off without deleting the section.
- Scrolling is disabled under `prefers-reduced-motion`; the message is centred
  and static instead.

## Brand reference (matches the Next.js site)

- Accent / gold: `#FEBE10`
- Dark: `#1A1A1A`
- Font: Manrope (set this in the theme's typography settings)

## Differences from the React version (on purpose)

- **No JS animations.** The framer-motion scroll/3D and stagger effects are
  dropped — Liquid sections are static HTML/CSS. The visual design is preserved.
- **No dark/light toggle.** The React `useThemeStore` toggle isn't ported;
  Shopify themes manage their own color scheme. The navbar/hero use the dark
  treatment from the site.
- **Mobile menu** uses a tiny inline `onclick` to open/close the drawer (no
  framework needed).
- All settings (text, image, colors, links) are editable in the theme customizer
  via the `{% schema %}` blocks — nothing is hardcoded that a merchant would
  want to change.
