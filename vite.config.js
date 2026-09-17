import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/my-pace/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'My Pace',
        short_name: 'My Pace',
        description: 'A little better, every day.',
        id: '/my-pace/',
        start_url: '/my-pace/',
        scope: '/my-pace/',
        display: 'standalone',
        background_color: '#f5f6f8',
        theme_color: '#665df5',
        lang: 'ko',
        icons: [
          { src: '/my-pace/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/my-pace/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/my-pace/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/my-pace/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico}'],
        cleanupOutdatedCaches: true
      }
    })
  ]
})
