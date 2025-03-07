export const getSchedules = async () => {
  const response = await window.api.fetchSchedules()
  return response
}
