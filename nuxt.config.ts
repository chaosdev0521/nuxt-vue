// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,
  future: {
    compatibilityVersion: 4
  },
  experimental: {
    payloadExtraction: false
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  // Router configuration
  router: {
    options: {
      strict: false
    }
  },
  // App configuration
  app: {
    head: {
      title: 'FinanceFlow - Transaction Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern transaction management application with role-based authentication' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'robots', content: 'noindex, nofollow' } // Since it's a demo app
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },
  // Nitro configuration
  nitro: {
    preset: 'node'
  },
  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia']
    },
    define: {
      __VUE_PROD_DEVTOOLS__: false
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia']
          }
        }
      }
    }
  },
  // Allow access from network
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {
    public: {
      // Use environment variable or detect from browser location
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3002/api'
    }
  }
})
