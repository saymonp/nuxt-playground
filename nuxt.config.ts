import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    public: {
      apiBase: import.meta.env.VITE_BASE_URL
    }
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0',
      // Alternatively, you can use the meta array:
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ]
    }
  },

  modules: ['@pinia/nuxt',
    '@vueuse/nuxt'
  ]
})