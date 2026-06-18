import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem", "2xl": "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand scales — the Hiring OS identity
        electric: {
          DEFAULT: "hsl(var(--electric))",
          soft: "hsl(var(--electric-soft))",
        },
        plasma: {
          DEFAULT: "hsl(var(--plasma))",
          soft: "hsl(var(--plasma-soft))",
        },
        aurora: "hsl(var(--aurora))",
      },
      borderRadius: {
        "2xl": "1.25rem",
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--electric) / 0.18), 0 0 24px -4px hsl(var(--electric) / 0.45)",
        "glow-plasma":
          "0 0 0 1px hsl(var(--plasma) / 0.20), 0 0 32px -6px hsl(var(--plasma) / 0.50)",
        elevated:
          "0 1px 0 0 hsl(0 0% 100% / 0.04) inset, 0 24px 60px -24px hsl(230 60% 2% / 0.85), 0 8px 24px -12px hsl(230 60% 2% / 0.6)",
        card: "0 1px 0 0 hsl(0 0% 100% / 0.03) inset, 0 12px 32px -16px hsl(230 60% 2% / 0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)",
        "brand-gradient":
          "linear-gradient(135deg, hsl(var(--electric)) 0%, hsl(var(--plasma)) 100%)",
        "aurora-radial":
          "radial-gradient(60% 60% at 50% 0%, hsl(var(--electric) / 0.18) 0%, transparent 70%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(-4%, -2%, 0) scale(1)" },
          "50%": { transform: "translate3d(4%, 3%, 0) scale(1.08)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.92)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-50% - 1.5rem))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 2s infinite",
        "aurora-drift": "aurora-drift 16s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
