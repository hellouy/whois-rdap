// Domain Hack Generator — smart engine with corpus auto-indexer + phrase decomposition

import { PRESET_TLDS, POPULAR_TLDS } from "./tld-list";

export { PRESET_TLDS, POPULAR_TLDS };

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

// ── Lazy-loaded singletons ────────────────────────────────────────────────────
let _wordLibrary: Record<string, string[]> | null = null;
let _wordMeanings: Record<string, string> | null = null;

function mergeLibrary(
  target: Record<string, string[]>,
  source: Record<string, string[]>
) {
  for (const [tld, words] of Object.entries(source)) {
    if (!target[tld]) {
      target[tld] = [...words];
    } else {
      const existing = new Set(target[tld]);
      for (const w of words) {
        if (!existing.has(w)) target[tld].push(w);
      }
    }
  }
}

// Build an auto-index: for each word in corpus, find all TLDs it ends with
function buildCorpusIndex(
  corpus: string[],
  allTlds: string[]
): Record<string, string[]> {
  // Pre-compute TLD strings (clean, no dot)
  const tldCleans = allTlds.map((t) => t.replace(/^\./, "").toLowerCase());

  const index: Record<string, string[]> = {};

  for (const word of corpus) {
    const wl = word.toLowerCase();
    for (let i = 0; i < tldCleans.length; i++) {
      const tldClean = tldCleans[i];
      // Word must END with tld and have at least 1 char prefix
      if (
        wl.length > tldClean.length &&
        wl.endsWith(tldClean)
      ) {
        if (!index[tldClean]) index[tldClean] = [];
        index[tldClean].push(word);
      }
    }
  }
  return index;
}

async function loadLibraries(): Promise<{
  library: Record<string, string[]>;
  meanings: Record<string, string>;
}> {
  if (_wordLibrary && _wordMeanings) {
    return { library: _wordLibrary, meanings: _wordMeanings };
  }

  const [
    { WORD_LIBRARY: BASE_LIBRARY },
    { WORD_LIBRARY_EXTRA },
    { WORD_LIBRARY_EXTRA2 },
    { WORD_LIBRARY_EXTRA3 },
    { WORD_LIBRARY_EXTRA4 },
    { WORD_LIBRARY_EXTRA5, WORD_MEANINGS_EXTRA5 },
    { WORD_LIBRARY_EXTRA6 },
    { PINYIN_WORD_LIBRARY, PINYIN_MEANINGS },
    { WORD_MEANINGS: BASE_MEANINGS },
    { WORD_MEANINGS_EXTRA },
    { WORD_MEANINGS_EXTRA2 },
    { WORD_MEANINGS_EXTRA3 },
    { WORD_MEANINGS_EXTRA4 },
    { WORD_MEANINGS_WORDS },
    { WORD_CORPUS, CORPUS_MEANINGS },
  ] = await Promise.all([
    import("./word-library"),
    import("./word-library-extra"),
    import("./word-library-extra2"),
    import("./word-library-extra3"),
    import("./word-library-extra4"),
    import("./word-library-extra5"),
    import("./word-library-extra6"),
    import("./pinyin-library"),
    import("./word-meanings"),
    import("./word-meanings-extra"),
    import("./word-meanings-extra2"),
    import("./word-meanings-extra3"),
    import("./word-meanings-extra4"),
    import("./word-meanings-words"),
    import("./word-corpus"),
  ]);

  // 1. Build corpus auto-index (covers all PRESET_TLDS automatically)
  const corpusIndex = buildCorpusIndex(WORD_CORPUS, PRESET_TLDS);

  // 2. Merge curated libraries (higher quality, override corpus if present)
  const library: Record<string, string[]> = { ...corpusIndex };
  mergeLibrary(library, BASE_LIBRARY);
  mergeLibrary(library, WORD_LIBRARY_EXTRA);
  mergeLibrary(library, WORD_LIBRARY_EXTRA2);
  mergeLibrary(library, WORD_LIBRARY_EXTRA3);
  mergeLibrary(library, WORD_LIBRARY_EXTRA4);
  mergeLibrary(library, WORD_LIBRARY_EXTRA5);
  mergeLibrary(library, WORD_LIBRARY_EXTRA6);
  mergeLibrary(library, PINYIN_WORD_LIBRARY);

  // 3. Merge all meanings
  const meanings: Record<string, string> = {
    ...CORPUS_MEANINGS,
    ...WORD_MEANINGS_WORDS,
    ...BASE_MEANINGS,
    ...WORD_MEANINGS_EXTRA,
    ...WORD_MEANINGS_EXTRA2,
    ...WORD_MEANINGS_EXTRA3,
    ...WORD_MEANINGS_EXTRA4,
    ...WORD_MEANINGS_EXTRA5,
    ...PINYIN_MEANINGS,
  };

  _wordLibrary = library;
  _wordMeanings = meanings;
  return { library, meanings };
}

function getLibrary(): Record<string, string[]> {
  return _wordLibrary || {};
}
function getMeanings(): Record<string, string> {
  return _wordMeanings || {};
}
function getWordsForTld(tld: string): string[] {
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  return getLibrary()[tldClean] || [];
}

// ── Word variant generator ────────────────────────────────────────────────────
function generateVariants(keyword: string): string[] {
  const variants = new Set<string>();
  variants.add(keyword);

  // Plurals / tense / morphology
  if (!keyword.endsWith("s")) variants.add(keyword + "s");
  if (keyword.endsWith("s") && keyword.length > 2) variants.add(keyword.slice(0, -1));
  variants.add(keyword + "ing");
  variants.add(keyword + "er");
  variants.add(keyword + "ed");
  variants.add(keyword + "ly");
  variants.add(keyword + "tion");
  variants.add(keyword + "ment");
  variants.add(keyword + "ness");
  variants.add(keyword + "able");
  variants.add(keyword + "ful");
  variants.add(keyword + "less");
  variants.add(keyword + "ize");
  variants.add(keyword + "ise");
  variants.add(keyword + "ous");
  variants.add(keyword + "ive");
  variants.add(keyword + "al");
  variants.add(keyword + "ish");
  variants.add(keyword + "ate");
  variants.add(keyword + "ence");
  variants.add(keyword + "ance");
  variants.add(keyword + "ity");
  variants.add(keyword + "ist");
  variants.add(keyword + "ism");
  variants.add(keyword + "ify");
  variants.add(keyword + "ic");

  // Doubled consonant forms
  if (keyword.length <= 5 && /[bcdfgklmnprstvz]$/.test(keyword)) {
    const doubled = keyword + keyword[keyword.length - 1];
    variants.add(doubled + "ing");
    variants.add(doubled + "er");
    variants.add(doubled + "ed");
  }

  // Common prefixes
  const prefixes = ["un", "re", "pre", "mis", "out", "over", "under", "up", "non", "dis"];
  for (const p of prefixes) {
    variants.add(p + keyword);
  }

  return Array.from(variants);
}

// ── Phrase tokenizer: split input into searchable sub-words ──────────────────
function tokenizePhrase(input: string): string[] {
  // Split on spaces, hyphens, underscores; also try the full concatenated form
  const parts = input
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, "")
    .split(/[\s\-_]+/)
    .filter((p) => p.length > 0);

  const tokens = new Set<string>();

  // Individual words
  for (const p of parts) tokens.add(p);

  // Concatenated pairs (e.g. "big data" → "bigdata")
  if (parts.length >= 2) {
    for (let i = 0; i < parts.length - 1; i++) {
      tokens.add(parts[i] + parts[i + 1]);
    }
    // Full concatenation
    tokens.add(parts.join(""));
  }

  return Array.from(tokens);
}

// ── Scoring ───────────────────────────────────────────────────────────────────
function findHackPosition(word: string, tldClean: string): number | null {
  const wordLower = word.toLowerCase();
  const endIndex = wordLower.length - tldClean.length;
  if (endIndex > 0 && wordLower.endsWith(tldClean)) {
    return endIndex;
  }
  return null;
}

function calculateCreativity(
  prefix: string,
  word: string,
  tld: string,
  isFromLibrary: boolean
): number {
  let score = 50;
  const tldClean = tld.replace(/^\./, "");

  // Exact match (prefix + tld = word)
  if ((prefix + tldClean).toLowerCase() === word.toLowerCase()) score += 30;

  if (isFromLibrary) score += 15;

  // Shorter prefix = more creative
  if (prefix.length === 0) score += 20;
  else if (prefix.length <= 2) score += 15;
  else if (prefix.length <= 4) score += 10;
  else if (prefix.length <= 6) score += 5;

  // Has vowels = more readable
  if (/[aeiou]/i.test(prefix)) score += 3;

  // All alphabetic = cleaner
  if (prefix.length >= 2 && /^[a-z]+$/i.test(prefix)) score += 3;

  // Penalty for long prefixes
  if (prefix.length > 10) score -= 10;
  if (prefix.length > 15) score -= 15;

  return Math.min(100, Math.max(0, score));
}

// ── Preload ───────────────────────────────────────────────────────────────────
export async function preloadLibraries(): Promise<void> {
  await loadLibraries();
}

export function isLibraryReady(): boolean {
  return _wordLibrary !== null;
}

// ── Main generator ────────────────────────────────────────────────────────────
export function generateDomainHacks(
  keyword: string,
  tlds: string[],
  includeVariants: boolean = true
): HackResult[] {
  if (!keyword.trim() || !_wordLibrary) return [];

  const rawInput = keyword.trim().toLowerCase().replace(/[^a-z0-9\s\-_]/g, "");
  if (!rawInput) return [];

  const meanings = getMeanings();
  const results: HackResult[] = [];
  const seen = new Set<string>();

  // Tokenize phrase → multiple search tokens
  const tokens = tokenizePhrase(rawInput);

  for (const token of tokens) {
    const cleanKeyword = token.replace(/[^a-z0-9]/g, "");
    if (!cleanKeyword || cleanKeyword.length < 1) continue;

    // 1. Algorithmic: generate variant words from the keyword and match against TLDs
    const keywordWords = includeVariants
      ? generateVariants(cleanKeyword)
      : [cleanKeyword];

    for (const word of keywordWords) {
      for (const tld of tlds) {
        const tldClean = tld.replace(/^\./, "").toLowerCase();
        const pos = findHackPosition(word, tldClean);
        if (pos === null) continue;

        const prefix = word.substring(0, pos);
        const domain = `${prefix}.${tldClean}`;
        if (seen.has(domain)) continue;
        seen.add(domain);

        const creativity = calculateCreativity(prefix, word, tld, false);
        const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
        const score = Math.round(creativity * 0.6 + lengthScore * 0.4);
        const isExact = (prefix + tldClean).toLowerCase() === cleanKeyword;
        const meaning =
          meanings[domain] || meanings[word] || meanings[cleanKeyword] || "";

        results.push({
          domain,
          keyword: word,
          tld,
          prefix,
          score,
          creativity,
          lengthScore,
          isExact,
          isFromLibrary: false,
          meaning,
        });
      }
    }

    // 2. Library: find words in per-TLD lists that contain the keyword
    for (const tld of tlds) {
      const tldClean = tld.replace(/^\./, "").toLowerCase();
      const libraryWords = getWordsForTld(tldClean);

      for (const word of libraryWords) {
        const wordLower = word.toLowerCase();
        if (!wordLower.includes(cleanKeyword)) continue;

        const pos = findHackPosition(wordLower, tldClean);
        if (pos === null) continue;

        const prefix = wordLower.substring(0, pos);
        const domain = `${prefix}.${tldClean}`;
        if (seen.has(domain)) continue;
        seen.add(domain);

        const creativity = calculateCreativity(prefix, wordLower, tld, true);
        const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
        const score = Math.round(creativity * 0.6 + lengthScore * 0.4);
        const meaning =
          meanings[domain] || meanings[wordLower] || meanings[cleanKeyword] || "";

        results.push({
          domain,
          keyword: wordLower,
          tld,
          prefix,
          score,
          creativity,
          lengthScore,
          isExact: false,
          isFromLibrary: true,
          meaning,
        });
      }
    }
  }

  return results;
}

// ── Browse mode: all words for a given TLD ────────────────────────────────────
export function getAllHacksForTld(tld: string): HackResult[] {
  const library = getLibrary();
  const meanings = getMeanings();
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  const words = library[tldClean] || [];
  const results: HackResult[] = [];
  const tldDot = tld.startsWith(".") ? tld : "." + tld;

  for (const word of words) {
    const wordLower = word.toLowerCase();
    const pos = findHackPosition(wordLower, tldClean);
    if (pos === null) continue;
    const prefix = wordLower.substring(0, pos);
    const domain = `${prefix}.${tldClean}`;
    const meaning = meanings[domain] || meanings[wordLower] || "";
    const creativity = calculateCreativity(prefix, wordLower, tldDot, true);
    const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
    const score = Math.round(creativity * 0.6 + lengthScore * 0.4);
    results.push({
      domain,
      keyword: wordLower,
      tld: tldDot,
      prefix,
      score,
      creativity,
      lengthScore,
      isExact: prefix === "",
      isFromLibrary: true,
      meaning,
    });
  }
  return results.sort((a, b) => b.score - a.score);
}

export function getTldWordCount(tld: string): number {
  const library = getLibrary();
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  return (library[tldClean] || []).length;
}

export function sortHacks(results: HackResult[], mode: SortMode): HackResult[] {
  const sorted = [...results];
  switch (mode) {
    case "score":
      return sorted.sort((a, b) => b.score - a.score);
    case "creativity":
      return sorted.sort((a, b) => b.creativity - a.creativity);
    case "length":
      return sorted.sort((a, b) => a.domain.length - b.domain.length);
    case "alpha":
      return sorted.sort((a, b) => a.domain.localeCompare(b.domain));
    default:
      return sorted;
  }
}

export function exportHacks(results: HackResult[]): string {
  return results.map((r) => r.domain).join("\n");
}
