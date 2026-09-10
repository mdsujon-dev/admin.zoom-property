import tailwindScrollbar from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        primary: "0 4px 6px -1px rgba(75, 128, 45, 0.45)",
        // Soft, layered elevation for cards — subtle at rest, richer on hover.
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px -2px rgba(16, 24, 40, 0.08)",
        "card-hover": "0 2px 4px rgba(16, 24, 40, 0.05), 0 12px 28px -4px rgba(75, 128, 45, 0.18)",
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
        //   #4B802D  deep green (primary — buttons, sidebar active, headings)
        //   #67AE3E  mid green  (fills, rules, hover washes)
        //   #99FF99  light green(highlights on dark grounds only)
        //   #495045  charcoal   (the guideline's secondary — body text, surfaces)
        //
        // The scale is one hue at different lightnesses, so `primary`,
        // `primary-500` and `primary-950` all belong to the same family.
        //
        // Which step may carry text is a contrast question, not a taste one:
        // white on `primary-800` (#4B802D) is 4.75:1 and passes AA, while
        // `primary-500` (#67AE3E) is 2.73:1 and fails at any size — so 500 is
        // for fills and rules, never for a label.
        "web-primary": "#4b802d",
        primary: {
          DEFAULT: "#4b802d",
          50: "#f6faf3",
          100: "#ebf4e6",
          200: "#d7eacd",
          300: "#bbdba8",
          400: "#95c678",
          500: "#67ae3e",
          600: "#589535",
          700: "#4f8730",
          800: "#4b802d",
          900: "#3e6925",
          950: "#32541e",
        },

        // The guideline's charcoal secondary, rolled into a surface/text ramp.
        // `secondary-800` (#495045) on white is 8.3:1, so it carries body copy.
        secondary: {
          DEFAULT: "#495045",
          50: "#f6f6f6",
          100: "#e9eae9",
          200: "#d2d3d0",
          300: "#b3b6b1",
          400: "#8e928c",
          500: "#6d736a",
          600: "#6a7066",
          700: "#565c52",
          800: "#495045",
          900: "#333830",
        },

        // The mid green that partners the deep green in gradients and fills.
        // Use as `bg-accent`, `text-accent`, etc.
        accent: {
          DEFAULT: "#67ae3e",
          50: "#f6faf3",
          100: "#ebf4e6",
          200: "#d7eacd",
          300: "#bbdba8",
          400: "#95c678",
          500: "#67ae3e",
          600: "#589535",
          700: "#4f8730",
          800: "#4b802d",
          900: "#3e6925",
          950: "#32541e",
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
