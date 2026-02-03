// Lightweight heuristics shared by WHOIS/RDAP parsing.

export function looksLikeNotFoundWhois(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t) return false;

  // Common patterns across ccTLD / gTLD WHOIS pages and proxies.
  const patterns: RegExp[] = [
    /no whois data was found/i,
    /no match for/i,
    /not found/i,
    /no entries found/i,
    /domain not found/i,
    /no information available/i,
    /status:\s*available/i,
    /is free/i,
    /available for registration/i,
    /no data found/i,
    /object does not exist/i,
    /unknown domain/i,
    /domain name not known/i,
  ];

  return patterns.some((p) => p.test(t));
}
