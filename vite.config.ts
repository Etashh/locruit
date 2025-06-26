import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/", // This is fine for root domain deployment like Vercel
  build: {
    rollupOptions: {
      external: [],
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: mode === "development" ? {
      '/scrape': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    } : undefined, // disable proxy for production build
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
