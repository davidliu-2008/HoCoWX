import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        bay: "#2563eb",
        ink: "#10213f",
        frost: "#eaf4ff",
        warning: "#1d4ed8",
        ice: "#f4f9ff",
        navy: "#12305f"
      },
      boxShadow: {
        panel: "0 1px 0 rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
