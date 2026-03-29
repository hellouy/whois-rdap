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

  // Basic inflections
  if (!kw.endsWith("s")) variants.add(kw + "s");
  if (kw.endsWith("s") && kw.length > 2) variants.add(kw.slice(0, -1));
  variants.add(kw + "ing");
  variants.add(kw + "er");
  variants.add(kw + "ers");
  variants.add(kw + "ed");
  variants.add(kw + "ly");
  variants.add(kw + "tion");
  variants.add(kw + "tions");
  variants.add(kw + "ment");
  variants.add(kw + "ments");
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
  variants.add(kw + "ical");
  variants.add(kw + "age");
  variants.add(kw + "ure");
  variants.add(kw + "ive");
  variants.add(kw + "or");
  variants.add(kw + "ors");

  // Double-last-consonant before suffix
  if (kw.length <= 5 && /[bcdfgklmnprstvz]$/.test(kw)) {
    const doubled = kw + kw[kw.length - 1];
    variants.add(doubled + "ing");
    variants.add(doubled + "er");
    variants.add(doubled + "ed");
  }

  // Common English prefixes
  const prefixes = ["un", "re", "pre", "mis", "out", "over", "under", "up", "non", "dis", "in", "ex", "co", "pro", "anti", "de", "sub", "super", "inter", "self", "multi", "over", "micro", "macro"];
  for (const p of prefixes) {
    variants.add(p + kw);
  }

  // Common English suffixes applied to base
  const suffixes = [
    "ware", "work", "base", "lab", "hub", "net", "tech", "app", "box",
    "core", "flow", "link", "mark", "meet", "now", "pay", "ship", "spot",
    "stack", "star", "ify", "ly", "er", "ism", "ist", "ish",
    "ward", "wide", "side", "land", "scape",
    "craft", "space", "time", "house", "room",
    "cast", "stream", "cast", "show",
    "way", "path", "road", "gate", "bridge",
    "shop", "store", "mart", "place",
    "health", "care", "life", "wise",
  ];
  for (const s of suffixes) {
    variants.add(kw + s);
  }

  // Additional compound patterns for -ism / -ist / -ight / -ck etc.
  // These help find matches for .sm, .ht, .ck TLDs
  variants.add(kw + "ight");   // for .ht hacks
  variants.add(kw + "ight" + "s");
  variants.add(kw + "ism");    // for .sm hacks
  variants.add(kw + "ist");
  variants.add(kw + "ack");    // for .ck hacks
  variants.add(kw + "ick");
  variants.add(kw + "ock");
  variants.add(kw + "uck");

  return Array.from(variants);
}

// ── Compound word splitter ────────────────────────────────────────────────────

/**
 * Known common English word segments used to split compound words.
 * When a compound token like "techblog" or "startup" is found, we check if
 * it starts or ends with one of these segments so we can split it.
 */
const SPLIT_SEGMENTS = [
  // ── Long prefixes (try first for greedy splitting) ──────────────────────────
  "understand", "international", "information", "entertainment",
  "communication", "environment", "development", "management",
  "infrastructure", "semiconductor", "cryptocurrency",
  // ── Standard prefixes ────────────────────────────────────────────────────────
  "self", "over", "under", "inter", "multi", "micro", "macro", "semi",
  "super", "hyper", "ultra", "anti", "auto", "bio", "crypto", "cyber",
  "data", "eco", "geo", "info", "meta", "nano", "tele", "web", "net",
  "pre", "pro", "sub", "co", "re", "de", "un", "in", "up", "ex",
  "fore", "mid", "non", "out", "mis", "dis", "air", "all",
  "trans", "cross", "back", "down", "high", "free", "full",
  // ── Tech / startup prefix words ───────────────────────────────────────────────
  "tech", "soft", "hard", "cloud", "open", "smart", "fast", "easy",
  "quick", "safe", "live", "real", "true", "high",
  "low", "top", "hot", "cool", "new", "big", "mini", "next",
  "deep", "dark", "bright", "clean", "green", "blue", "red",
  "super", "hyper", "nano", "omni", "poly", "mono",
  "quantum", "virtual", "digital", "global", "local",
  // ── Common suffix segments ─────────────────────────────────────────────────
  "hub", "lab", "app", "box", "io", "api", "sdk", "ai", "ml", "ux",
  "ui", "dev", "ops", "sec", "db", "bot", "pay", "kit", "map",
  "book", "shop", "mart", "park", "link", "mark", "spot", "base",
  "cast", "chat", "code", "core", "drop", "feed", "flow", "fund",
  "gate", "grid", "hack", "host", "list", "live", "meet", "mint",
  "note", "pass", "pipe", "play", "pool", "push", "rack", "read",
  "ring", "run", "sale", "scan", "send", "ship", "sign", "site",
  "snap", "sort", "spin", "star", "sync", "tag", "task", "team",
  "test", "tool", "track", "view", "wave", "wire", "word", "work",
  "yard", "zone", "port", "pod", "bay", "camp", "nest",
  "space", "land", "side", "ward", "way", "path",
  "time", "day", "night", "week", "year",
  "house", "room", "hall", "town", "city", "world", "earth",
  "health", "care", "life", "mind", "body", "soul",
  "learn", "edu", "school", "teach", "study",
  "media", "news", "blog", "cast", "stream",
  "art", "craft", "design", "studio",
  "market", "trade", "store", "sell", "buy",
  "invest", "fund", "bank", "pay", "earn",
  "build", "make", "grow", "launch", "start",
  "help", "serve", "care", "give", "share",
  "social", "network", "connect", "match",
  "search", "find", "look", "seek",
  "game", "play", "sport", "race",
  "travel", "trip", "tour", "road", "map",
  "food", "meal", "cook", "eat", "drink",
  "farm", "garden", "nature", "wild",
  "photo", "video", "audio", "music",
  "book", "read", "write", "story", "text",
  "safe", "guard", "shield", "lock", "key",
  "mail", "post", "send", "msg", "chat",
  "stack", "chain", "block", "token", "coin",
  "cloud", "data", "byte", "bit", "hex",
  "print", "scan", "render", "draw",
  "ship", "freight", "cargo", "move", "go",
];

/**
 * Split a compound word into sub-tokens.
 * Returns the sub-words found by segmenting at known segment boundaries.
 */
export function splitCompoundWord(word: string): string[] {
  if (!word || word.length < 4) return [];
  const results = new Set<string>();
  const wl = word.toLowerCase();

  for (const seg of SPLIT_SEGMENTS) {
    // Word starts with this segment
    if (wl.startsWith(seg) && wl.length > seg.length + 2) {
      results.add(seg);
      results.add(wl.slice(seg.length));
    }
    // Word ends with this segment
    if (wl.endsWith(seg) && wl.length > seg.length + 2) {
      results.add(wl.slice(0, wl.length - seg.length));
      results.add(seg);
    }
  }

  return Array.from(results).filter(s => s.length >= 2);
}

// ── CamelCase splitter ────────────────────────────────────────────────────────

/**
 * Split a camelCase or PascalCase string into lower-case parts.
 * "TechBlog" → ["tech", "blog"]
 * "domainHack" → ["domain", "hack"]
 */
export function splitCamelCase(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/)
    .map(p => p.toLowerCase())
    .filter(p => p.length > 0);
}

// ── Phrase tokenizer ──────────────────────────────────────────────────────────

/**
 * Split a user input phrase into individual tokens suitable for hack generation.
 * Handles spaces, hyphens, underscores, camelCase, and compound words.
 */
export function tokenizePhrase(input: string): string[] {
  if (!input || typeof input !== "string") return [];

  // 1. First pass: CamelCase splitting (before lowercasing)
  const camelParts = splitCamelCase(input.trim());

  // 2. Sanitize and split on whitespace/separators
  const sanitized = input
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, "")
    .split(/[\s\-_]+/)
    .filter((p) => p.length > 0);

  const tokens = new Set<string>();

  // Add camelCase parts
  for (const p of camelParts) {
    const clean = p.replace(/[^a-z0-9]/g, "");
    if (clean.length >= 2) tokens.add(clean);
  }

  // Add raw sanitized parts
  for (const p of sanitized) tokens.add(p);

  // Add adjacent-pair combinations
  if (sanitized.length >= 2) {
    for (let i = 0; i < sanitized.length - 1; i++) {
      tokens.add(sanitized[i] + sanitized[i + 1]);
    }
    tokens.add(sanitized.join(""));
  }

  // 3. Compound splitting: for single-word inputs, try segment splitting
  const allBase = Array.from(tokens);
  for (const tok of allBase) {
    if (tok.length >= 5) {
      const parts = splitCompoundWord(tok);
      for (const p of parts) {
        if (p.length >= 2) tokens.add(p);
      }
    }
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
 * Calculate a pronounceability bonus (0-15) for a prefix string.
 * Prefers alternating consonants/vowels and pure-alpha short prefixes.
 */
function pronounceabilityBonus(prefix: string): number {
  if (!prefix) return 10; // empty prefix = word IS the TLD, very creative
  if (!/^[a-z]+$/i.test(prefix)) return 0; // has digits/hyphens
  if (prefix.length <= 2) return 8;
  if (prefix.length <= 4) return 5;
  if (prefix.length <= 6) return 3;
  return 0;
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

  // Perfect hack: the domain spells the complete word
  if ((prefix + tldClean).toLowerCase() === word.toLowerCase()) score += 30;
  if (isFromLibrary) score += 15;

  // Prefix length bonus — shorter prefix = more creative
  if (prefix.length === 0) score += 25;
  else if (prefix.length <= 2) score += 18;
  else if (prefix.length <= 4) score += 12;
  else if (prefix.length <= 6) score += 7;
  else if (prefix.length <= 8) score += 3;

  // Pronounceability
  score += pronounceabilityBonus(prefix);

  // Penalty for very long prefixes
  if (prefix.length > 10) score -= 10;
  if (prefix.length > 15) score -= 15;
  if (prefix.length > 20) score -= 20;

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
  // Length score: rewards short total domain length
  const totalLen = prefix.length + tldClean.length;
  const lengthScore = Math.max(0, 100 - totalLen * 6);
  const score = Math.round(creativity * 0.55 + lengthScore * 0.45);
  const isExact = (prefix + tldClean).toLowerCase() === keyword.toLowerCase();
  return { domain, keyword, tld, prefix, score, creativity, lengthScore, isExact, isFromLibrary, meaning };
}
