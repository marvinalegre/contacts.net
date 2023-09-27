import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      "/api/createcontact": "http://localhost:5003",
      "/api/signup": "http://localhost:5003",
      "/api/signin": "http://localhost:5003",
      "/api/signout": "http://localhost:5003",
      "/api/root": "http://localhost:5003",
      "/api/checkifsignedin": "http://localhost:5003",
      "^/api/.*": "http://localhost:5003",
    },
  },
});
