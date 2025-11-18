import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#0B1B3B",
          deep80: "#0B1B3Bcc",
          light: "#EAF2FF",
          accent: "#1B66FF"
        }
      },
      backgroundImage: {
        "deep-blue-gradient":
          "radial-gradient(1200px 600px at 80% -20%, rgba(27,102,255,0.18) 0%, rgba(11,27,59,0) 60%), radial-gradient(800px 400px at 10% 110%, rgba(27,102,255,0.15) 0%, rgba(11,27,59,0) 60%)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(11,27,59,0.15)"
      }
    }
  },
  plugins: []
};

export default config;


