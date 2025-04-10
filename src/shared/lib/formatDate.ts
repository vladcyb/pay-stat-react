export function formatDate(dateStr: string) {
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  return `${day}.${month}.${year}`
}
