import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // configureWebpack: {
  //   plugins: [new MonacoWebpackPlugin({ languages: ["markdown"] })],
  // },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  // proxy: {
  //   "/api": {
  //     target: process.env.BASE_URL,
  //     changeOrigin: true,
  //     ws: true,
  //     pathRewrite: {
  //       "^/api": "",
  //     },
  //   },
  // },
});
