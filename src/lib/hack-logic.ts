/**
 * hack-logic.ts — Pure business logic for domain hack generation.
 *
 * All functions here are pure (no React state, no side effects, no API calls).
 * They can be unit-tested in isolation via Vitest.
 *
 * The stateful orchestration layer (library loading, memoisation) lives in
 * domain-hack.ts, which imports and re-uses these functions.
 */

export interface HackResult {
  domain: string;
  keyword: string;
  tld: string;
  prefix: string;
  score: number;
  creativity: number;
  lengthScore: number;
  isExact: boolean;
  isFromLibrary: boolean;
  meaning?: string;
}

export type SortMode = "score" | "creativity" | "length" | "alpha";

// ── Word variant generator ────────────────────────────────────────────────────

/**
 * Generate morphological variants of a keyword.
 * All outputs are lowercase alpha strings.
 */
export function generateVariants(keyword: string): string[] {
  if (!keyword || typeof keyword !== "string") return [];
  const kw = keyword.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!kw) return [];

  const variants = new Set<string>();
  variants.add(kw);

  if (!kw.endsWith("s")) variants.add(kw + "s");
  if (kw.endsWith("s") && kw.length > 2) variants.add(kw.slice(0, -1));
  variants.add(kw + "ing");
  variants.add(kw + "er");
  variants.add(kw + "ed");
  variants.add(kw + "ly");
  variants.add(kw + "tion");
  variants.add(kw + "ment");
  variants.add(kw + "ness");
  variants.add(kw + "able");
  variants.add(kw + "ful");
  variants.add(kw + "less");
  variants.add(kw + "ize");
  variants.add(kw + "ise");
  variants.add(kw + "ous");
  variants.add(kw + "ive");
  variants.add(kw + "al");
  variants.add(kw + "ish");
  variants.add(kw + "ate");
  variants.add(kw + "ence");
  variants.add(kw + "ance");
  variants.add(kw + "ity");
  variants.add(kw + "ist");
  variants.add(kw + "ism");
  variants.add(kw + "ify");
  variants.add(kw + "ic");

  if (kw.length <= 5 && /[bcdfgklmnprstvz]$/.test(kw)) {
    const doubled = kw + kw[kw.length - 1];
    variants.add(doubled + "ing");
    variants.add(doubled + "er");
    variants.add(doubled + "ed");
  }

  const prefixes = ["un", "re", "pre", "mis", "out", "over", "under", "up", "non", "dis"];
  for (const p of prefixes) {
    variants.add(p + kw);
  }

  return Array.from(variants);
}

// ── Phrase tokenizer ──────────────────────────────────────────────────────────

/**
 * Split a user input phrase into individual tokens suitable for hack generation.
 * Handles spaces, hyphens, underscores, and generates concatenated forms.
 */
export function tokenizePhrase(input: string): string[] {
  if (!input || typeof input !== "string") return [];
  const sanitized = input
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, "")
    .split(/[\s\-_]+/)
    .filter((p) => p.length > 0);

  if (sanitized.length === 0) return [];

  const tokens = new Set<string>();
  for (const p of sanitized) tokens.add(p);

  if (sanitized.length >= 2) {
    for (let i = 0; i < sanitized.length - 1; i++) {
      tokens.add(sanitized[i] + sanitized[i + 1]);
    }
    tokens.add(sanitized.join(""));
  }

  return Array.from(tokens);
}

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Find the split position in `word` where the TLD starts.
 * Returns the character index of the start of the TLD suffix, or null if not found.
 */
export function findHackPosition(word: string, tldClean: string): number | null {
  if (!word || !tldClean) return null;
  const wordLower = word.toLowerCase();
  const tldLower = tldClean.toLowerCase();
  const endIndex = wordLower.length - tldLower.length;
  if (endIndex > 0 && wordLower.endsWith(tldLower)) return endIndex;
  return null;
}

/**
 * Calculate a creativity score (0–100) for a domain hack.
 * Higher = shorter prefix, library match, readable.
 */
export function calculateCreativity(
  prefix: string,
  word: string,
  tld: string,
  isFromLibrary: boolean
): number {
  let score = 50;
  const tldClean = tld.replace(/^\./, "");

  if ((prefix + tldClean).toLowerCase() === word.toLowerCase()) score += 30;
  if (isFromLibrary) score += 15;

  if (prefix.length === 0) score += 20;
  else if (prefix.length <= 2) score += 15;
  else if (prefix.length <= 4) score += 10;
  else if (prefix.length <= 6) score += 5;

  if (/[aeiou]/i.test(prefix)) score += 3;
  if (prefix.length >= 2 && /^[a-z]+$/i.test(prefix)) score += 3;

  if (prefix.length > 10) score -= 10;
  if (prefix.length > 15) score -= 15;

  return Math.min(100, Math.max(0, score));
}

// ── Sort & export ─────────────────────────────────────────────────────────────

/**
 * Sort an array of HackResults by the given mode.
 * Returns a new sorted array; does not mutate the input.
 */
export function sortHacks(results: HackResult[], mode: SortMode): HackResult[] {
  const sorted = [...results];
  switch (mode) {
    case "score":      return sorted.sort((a, b) => b.score - a.score);
    case "creativity": return sorted.sort((a, b) => b.creativity - a.creativity);
    case "length":     return sorted.sort((a, b) => a.domain.length - b.domain.length);
    case "alpha":      return sorted.sort((a, b) => a.domain.localeCompare(b.domain));
    default:           return sorted;
  }
}

/**
 * Serialise an array of HackResults to a plain-text list of domain names.
 */
export function exportHacks(results: HackResult[]): string {
  return results.map((r) => r.domain).join("\n");
}

/**
 * Build a single HackResult from its constituent parts.
 * Centralises the score formula so it's consistent everywhere.
 */
export function buildHackResult(
  domain: string,
  keyword: string,
  tld: string,
  prefix: string,
  isFromLibrary: boolean,
  meaning: string
): HackResult {
  const tldClean = tld.replace(/^\./, "");
  const creativity = calculateCreativity(prefix, keyword, tld, isFromLibrary);
  const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
  const score = Math.round(creativity * 0.6 + lengthScore * 0.4);
  const isExact = (prefix + tldClean).toLowerCase() === keyword.toLowerCase();
  return { domain, keyword, tld, prefix, score, creativity, lengthScore, isExact, isFromLibrary, meaning };
}
