export const useDevice = () => {
  const { $device } = useNuxtApp()
  return $device
}