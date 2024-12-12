import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { UserConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      hmr: {
        path: "/hmr",
        port: 7001,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@common": path.resolve(__dirname, "./src/common"),
        "@styles": path.resolve(__dirname, "./src/common/styles"),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
    optimizeDeps: {
      include: ["@stripe/stripe-js"],  // Ensure Vite pre-bundles this
    }
  };

  return config;
});
