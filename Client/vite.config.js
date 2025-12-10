// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Restore the alias mapping @ to /src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://182.74.4.110:1081', // SAP API base URL
        changeOrigin: true, // Change the origin to match the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
        secure: false, // Allow HTTP (insecure) or self-signed SSL (development only)
      },
    },
  },  
});