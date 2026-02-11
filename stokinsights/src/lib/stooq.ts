export function toStooqSymbol(symbol: string): string {
  // Default assumption: US stocks for now.
  // Stooq uses lowercase + ".us"
  return `${symbol.toLowerCase()}.us`;
}
