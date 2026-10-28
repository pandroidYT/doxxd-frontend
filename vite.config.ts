import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // In dev, forward API calls to the backend (npm run dev in doxxd-backend).
  server: { proxy: { "/api": "http://localhost:3000" } },
});
