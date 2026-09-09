import tailwindScrollbar from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        primary: "0 4px 6px -1px rgba(19, 48, 80, 0.45)",
        // Soft, layered elevation for cards — subtle at rest, richer on hover.
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px -2px rgba(16, 24, 40, 0.08)",
        "card-hover": "0 2px 4px rgba(16, 24, 40, 0.05), 0 12px 28px -4px rgba(19, 48, 80, 0.18)",
      },
      maxWidth: {
        "8xl": "96rem", // 1536px
        "9xl": "104rem", // 1664px
        "10xl": "112rem", // 1792px
      },
      animation: {
        marquee: "marquee 80s linear infinite",
        dotBounce: "dotBounce 1.2s infinite",
        "marquee-reverse": "marquee 130s linear infinite reverse",
        fadeIn: "fadeIn 0.3s ease-in-out",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "spin-slow": "spin 22s linear infinite",
        slideDown: "slideDown 0.3s ease-out forwards",
        slideUp: "slideUp 0.3s ease-in forwards",
      },
      keyframes: {
        dotBounce: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(6px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "scaleY(0.95)" },
          "100%": { opacity: "1", transform: "scaleY(1)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },

      },
      fontFamily: {
        // Single typeface for the whole admin — everything inherits this.
        sans: ['"Montserrat"', '"Noto Sans Bengali"', "sans-serif"],
        serif: ['"Montserrat"', '"Noto Sans Bengali"', "sans-serif"],
        // Headings and the wordmark, matching the site's display face.
        display: ['"Quicksand"', '"Montserrat"', "sans-serif"],
      },
      display: ["group-hover"],
      colors: {
        // Brand palette — Zoom Property, taken from the frontend's
        // `globals.css` so the panel and the public site are literally the
        // same numbers.
        //
        //   #133050  deep navy  (primary — buttons, sidebar active, headings)
        //   #2867A0  mid blue   (links, focus rings, secondary emphasis)
        //   #C00918  brand red  (the mark, destructive actions, alerts)
        //
        // The scale is one hue (212deg) at different lightnesses, so `primary`,
        // `primary-500` and `primary-950` all belong to the same family.
        // White on `primary` (#133050) is 13.4:1 — safe for body text, which
        // the old leaf green never was.
        "web-primary": "#133050",
        primary: {
          DEFAULT: "#133050",
          50: "#eef3f8",
          100: "#dae6f2",
          200: "#b8cee3",
          300: "#8db0d1",
          400: "#5a8dbb",
          500: "#2867a0",
          600: "#21558a",
          700: "#1a4570",
          800: "#133050",
          900: "#0f2740",
          950: "#0a1b2d",
        },

        // Neutral surface shades — kept as dark grays for UI backgrounds/text.
        secondary: {
          DEFAULT: "#1a1a1a",
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#4d4d4d",
          700: "#333333",
          800: "#1a1a1a",
          900: "#101010",
        },

        // Secondary brand colour — the mid blue that partners the navy in
        // gradients and link text. Use as `bg-accent`, `text-accent`, etc.
        accent: {
          DEFAULT: "#2867a0",
          50: "#eef3f8",
          100: "#dae6f2",
          200: "#b8cee3",
          300: "#8db0d1",
          400: "#5a8dbb",
          500: "#2867a0",
          600: "#21558a",
          700: "#1a4570",
          800: "#133050",
          900: "#0f2740",
          950: "#0a1b2d",
        },

        // The brand red off the logo mark. Small, deliberate emphasis only —
        // the house icon, destructive confirmations, overdue markers.
        brand: {
          DEFAULT: "#c00918",
          50: "#fdf2f3",
          100: "#fbdfe1",
          200: "#f5bcc0",
          300: "#ec8b93",
          400: "#df5661",
          500: "#cc2833",
          600: "#c00918",
          700: "#9d0714",
          800: "#820918",
          900: "#6b0a15",
          950: "#3b0409",
        },
      },
    },
  },
  plugins: [tailwindScrollbar, scrollbarHide],
};
