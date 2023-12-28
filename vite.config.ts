import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: { proxy: { "/api": "http://localhost:3002" } },
  define: {
    __DEV__: process.env.DEV === "true",
  },
})
