import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  root: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'js/main.js'),
        styles: resolve(__dirname, 'scss/style.scss'),
        index: resolve(__dirname, 'index.html'),
        aPropos: resolve(__dirname, 'a-propos.html'),
        equipe: resolve(__dirname, 'equipe.html'),
        sentiers: resolve(__dirname, 'sentiers.html'),
        nousJoindre: resolve(__dirname, 'nous-joindre.html'),
        achats: resolve(__dirname, 'achats.html')
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[hash][extname]';
          }
          if (assetInfo.name.match(/\.(png|jpe?g|gif|svg)$/)) {
            if (assetInfo.name.includes('logo')) {
              return 'assets/logos/[name][extname]';
            }
            if (assetInfo.name.includes('icon')) {
              return 'assets/icons/[name][extname]';
            }
            return 'assets/images/[name][extname]';
          }
          if (assetInfo.name.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'js'),
      '@scss': resolve(__dirname, 'scss'),
      '@assets': resolve(__dirname, 'assets')
    }
  },
  server: {
    port: 3000,
    open: true,
    hot: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@scss/variables.scss";`
      }
    }
  },
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot', '**/*.otf'],
  optimizeDeps: {
    include: ['js/main.js']
  }
}); 