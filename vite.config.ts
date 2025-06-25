import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// hey
// Adjusted for deployment to the root of the repository
export default defineConfig(({ mode }) => ({
  base: "/",
  build: {
    rollupOptions: {
      external: [], // Removed specific external files to allow proper resolution
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/scrape': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
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
