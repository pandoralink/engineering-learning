import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import vitePluginPrintName from "./plugin/vite-plugin-print-name";

// https://vitejs.dev/config/
export default defineConfig({
  // root 默认值是 process.cwd(), 即当前工作文件夹
  // index.html 中引用的 .js 需要在同一个 root 目录下
  root: process.cwd(),
  server: {
    port: 5173, // 默认端口是 5173
  },
  plugins: [vue(), vitePluginPrintName()],
});
