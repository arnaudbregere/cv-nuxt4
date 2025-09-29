export default defineNuxtConfig({
  nitro: {
    target: 'es2022', // or 'es2020' or later
  },
  css: [
    '~/assets/scss/base.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/variables.scss" as *;
          `
        }
      }
    }
  }
})
