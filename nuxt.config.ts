export default defineNuxtConfig({
 nitro: {
  esbuild: {
    options: { target: 'es2022' }
  }
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
  },
runtimeConfig: {
  mistralApiKey: process.env.MISTRAL_API_KEY
}
})
