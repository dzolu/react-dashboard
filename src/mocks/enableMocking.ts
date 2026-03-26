export const enableMocking = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser')
    await worker.start()
  }
}
