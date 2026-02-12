const DOMAIN_MAP: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  NVDA: "nvidia.com",
  AMZN: "amazon.com",
  GOOGL: "abc.xyz",
  META: "meta.com",
  TSLA: "tesla.com",
  JPM: "jpmorganchase.com",
  SNDK: "sandisk.com",
  IREN: "iren.com",
  PANW: "paloalto.com",
  NFLX: "netflix.com"
};

export function logoCandidates(symbol: string): string[] {
  const s = symbol.toUpperCase();
  const domain = DOMAIN_MAP[s];
  if (!domain) return [];

  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];
}
