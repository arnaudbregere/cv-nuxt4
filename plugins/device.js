import MobileDetect from 'mobile-detect'

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders()
  const userAgent = process.server ? headers['user-agent'] : navigator.userAgent

  const md = new MobileDetect(userAgent)
  const device = reactive({
    isMobile: md.phone() !== null || md.mobile() === 'UnknownMobile',
    isTablet: md.tablet() !== null || md.mobile() === 'UnknownTablet',
    isDesktop: false
  })
  device.isDesktop = !device.isMobile && !device.isTablet

  if (process.client) {
    onMounted(() => {
      const mdClient = new MobileDetect(navigator.userAgent)
      device.isMobile = mdClient.phone() !== null || mdClient.mobile() === 'UnknownMobile'
      device.isTablet = mdClient.tablet() !== null || mdClient.mobile() === 'UnknownTablet'
      device.isDesktop = !device.isMobile && !device.isTablet
    })
  }

  return {
    provide: {
      device
    }
  }
})
