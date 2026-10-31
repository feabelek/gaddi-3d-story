import { defineConfig } from 'vite';

import {
  resolve
} from 'node:path';


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        atlas: resolve(
          process.cwd(),
          'index.html'
        ),
        bharmourPreview: resolve(
          process.cwd(),
          'bharmour-preview.html'
        ),
        bharmourAssets: resolve(
          process.cwd(),
          'bharmour-assets.html'
        ),
        bharmourLivingPreview: resolve(
          process.cwd(),
          'bharmour-living-preview.html'
        )
      }
    }
  }
});
