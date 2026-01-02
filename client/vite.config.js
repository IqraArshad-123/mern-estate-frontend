import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target:'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
})

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         secure: false,
//       },
//     },

//     // ---- COOP/COEP DISABLED (Google Login FIX) ----
//     headers: {
//       "Cross-Origin-Opener-Policy": "unsafe-none",
//       "Cross-Origin-Embedder-Policy": "unsafe-none",
      
//     }
//   },

//   plugins: [react()],
// });


