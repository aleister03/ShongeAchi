/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // --- NEW: ported from paymentSandbox-master/tailwind.config.ts —
      // used only by the payment checkout pages
      // (app/elder/[id]/subscription/checkout/**). Material 3 color
      // tokens plus the two payment-method brand colors.
      colors: {
        "inverse-primary": "#6fd6df",
        "secondary-fixed": "#d2e4ff",
        "tertiary": "#596100",
        "tertiary-container": "#717b00",
        "primary-fixed-dim": "#6fd6df",
        "on-surface": "#1c1c12",
        "surface-container": "#f1eede",
        "background": "#fdfae9",
        "inverse-surface": "#313126",
        "surface-container-highest": "#e6e3d2",
        "surface-tint": "#006970",
        "on-error-container": "#93000a",
        "surface-bright": "#fdfae9",
        "on-tertiary-container": "#feffdb",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "error-container": "#ffdad6",
        "on-primary-container": "#f5feff",
        "tertiary-fixed-dim": "#c2cf47",
        "tertiary-fixed": "#dfec60",
        "on-primary-fixed": "#002022",
        "outline-variant": "#bdc9ca",
        "surface-variant": "#e6e3d2",
        "on-background": "#1c1c12",
        "on-surface-variant": "#3d494a",
        "on-primary-fixed-variant": "#004f54",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f7f4e3",
        "on-secondary-fixed-variant": "#00497e",
        "on-error": "#ffffff",
        "secondary-fixed-dim": "#a0caff",
        "surface-container-high": "#ebe9d8",
        "secondary": "#0061a6",
        "on-secondary": "#ffffff",
        "surface-dim": "#dddaca",
        "primary-container": "#00818a",
        "surface": "#fdfae9",
        "inverse-on-surface": "#f4f1e0",
        "on-tertiary-fixed-variant": "#444b00",
        "on-tertiary-fixed": "#1a1d00",
        "on-secondary-container": "#004376",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#8df2fc",
        "outline": "#6d797a",
        "secondary-container": "#6eb2fe",
        "primary": "#00666d",
        "on-secondary-fixed": "#001c37",
        "bkash-pink": "#E2136E",
        "nagad-red": "#ed1c24",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5rem" }], // was 0.75rem/1rem
        sm: ["1rem", { lineHeight: "1.85rem" }], // was 0.875rem/1.25rem
        // --- NEW: ported from paymentSandbox-master, used only by the
        // payment checkout pages.
        "title-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-bold": ["14px", { lineHeight: "20px", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      // ---------------------------------------------------------------------------
    },
  },
  plugins: [],
};
