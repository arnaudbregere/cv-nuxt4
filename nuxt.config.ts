export default defineNuxtConfig({
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
