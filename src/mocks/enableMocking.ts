export const enableMocking = async () => {
  const { worker } = await import('@/mocks/browser')
  await worker.start()
}
