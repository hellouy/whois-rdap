/**
 * Domain Hack Generator — orchestration layer
 *
 * Handles library loading (lazy, cached), corpus-index building, and the
 * main generateDomainHacks / getAllHacksForTld entry points.
 *
 * Pure algorithm functions live in hack-logic.ts and are unit-tested there.
 */

import { PRESET_TLDS, POPULAR_TLDS } from "./tld-list";
import {
  generateVariants,
  tokenizePhrase,
  findHackPosition,
  calculateCreativity,
  sortHacks,
  exportHacks,
  buildHackResult,
  type HackResult,
  type SortMode,
} from "./hack-logic";

export { PRESET_TLDS, POPULAR_TLDS };
export type { HackResult, SortMode };
export { sortHacks, exportHacks };

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

function buildCorpusIndex(
  corpus: string[],
  allTlds: string[]
): Record<string, string[]> {
  const tldCleans = allTlds.map((t) => t.replace(/^\./, "").toLowerCase());
  const index: Record<string, string[]> = {};

  for (const word of corpus) {
    const wl = word.toLowerCase();
    for (let i = 0; i < tldCleans.length; i++) {
      const tldClean = tldCleans[i];
      if (wl.length > tldClean.length && wl.endsWith(tldClean)) {
        if (!index[tldClean]) index[tldClean] = [];
        index[tldClean].push(word);
      }
    }
  }
  return index;
}

async function fetchCorpusJson(path: string): Promise<{ words: string[]; meanings: Record<string, string> }> {
  try {
    const resp = await fetch(path, { headers: { Accept: "application/json" } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  } catch {
    return { words: [], meanings: {} };
  }
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
    { WORD_LIBRARY_EXTRA7, WORD_MEANINGS_EXTRA7 },
    { WORD_LIBRARY_EXTRA8 },
    { WORD_LIBRARY_EXTRA9 },
    { WORD_LIBRARY_EXTRA10 },
    { WORD_LIBRARY_EXTRA11 },
    { WORD_LIBRARY_EXTRA12 },
    { WORD_LIBRARY_EXTRA13 },
    { WORD_LIBRARY_EXTRA14 },
    { WORD_LIBRARY_EXTRA15 },
    { WORD_LIBRARY_EXTRA16A },
    { WORD_LIBRARY_EXTRA16B },
    { WORD_LIBRARY_EXTRA16C },
    { WORD_LIBRARY_EXTRA16D },
    { WORD_LIBRARY_EXTRA16E },
    { WORD_LIBRARY_EXTRA16F },
    { WORD_LIBRARY_EXTRA16G },
    { WORD_LIBRARY_EXTRA16H },
    { WORD_LIBRARY_EXTRA17 },
    { WORD_LIBRARY_EXTRA18 },
    { WORD_LIBRARY_EXTRA19 },
    { WORD_LIBRARY_EXTRA20 },
    { WORD_LIBRARY_EXTRA21 },
    { PINYIN_WORD_LIBRARY, PINYIN_MEANINGS },
    { WORD_MEANINGS: BASE_MEANINGS },
    { WORD_MEANINGS_EXTRA },
    { WORD_MEANINGS_EXTRA2 },
    { WORD_MEANINGS_EXTRA3 },
    { WORD_MEANINGS_EXTRA4 },
    { WORD_MEANINGS_EXTRA8 },
    { WORD_MEANINGS_EXTRA9 },
    { WORD_MEANINGS_EXTRA10 },
    { WORD_MEANINGS_EXTRA11 },
    { WORD_MEANINGS_EXTRA12 },
    { WORD_MEANINGS_EXTRA13 },
    { WORD_MEANINGS_EXTRA14A },
    { WORD_MEANINGS_EXTRA14B },
    { WORD_MEANINGS_EXTRA14C },
    { WORD_MEANINGS_EXTRA15A },
    { WORD_MEANINGS_EXTRA15B },
    { WORD_MEANINGS_EXTRA16A },
    { WORD_MEANINGS_EXTRA16B },
    { WORD_MEANINGS_EXTRA16C },
    { WORD_MEANINGS_EXTRA17 },
    { WORD_MEANINGS_WORDS },
    corpusJson,
    corpusExtraJson,
  ] = await Promise.all([
    import("./word-library"),
    import("./word-library-extra"),
    import("./word-library-extra2"),
    import("./word-library-extra3"),
    import("./word-library-extra4"),
    import("./word-library-extra5"),
    import("./word-library-extra6"),
    import("./word-library-extra7"),
    import("./word-library-extra8"),
    import("./word-library-extra9"),
    import("./word-library-extra10"),
    import("./word-library-extra11"),
    import("./word-library-extra12"),
    import("./word-library-extra13"),
    import("./word-library-extra14"),
    import("./word-library-extra15"),
    import("./word-library-extra16a"),
    import("./word-library-extra16b"),
    import("./word-library-extra16c"),
    import("./word-library-extra16d"),
    import("./word-library-extra16e"),
    import("./word-library-extra16f"),
    import("./word-library-extra16g"),
    import("./word-library-extra16h"),
    import("./word-library-extra17"),
    import("./word-library-extra18"),
    import("./word-library-extra19"),
    import("./word-library-extra20"),
    import("./word-library-extra21"),
    import("./pinyin-library"),
    import("./word-meanings"),
    import("./word-meanings-extra"),
    import("./word-meanings-extra2"),
    import("./word-meanings-extra3"),
    import("./word-meanings-extra4"),
    import("./word-meanings-extra8"),
    import("./word-meanings-extra9"),
    import("./word-meanings-extra10"),
    import("./word-meanings-extra11"),
    import("./word-meanings-extra12"),
    import("./word-meanings-extra13"),
    import("./word-meanings-extra14a"),
    import("./word-meanings-extra14b"),
    import("./word-meanings-extra14c"),
    import("./word-meanings-extra15a"),
    import("./word-meanings-extra15b"),
    import("./word-meanings-extra16a"),
    import("./word-meanings-extra16b"),
    import("./word-meanings-extra16c"),
    import("./word-meanings-extra17"),
    import("./word-meanings-words"),
    fetchCorpusJson("/data/word-corpus.json"),
    fetchCorpusJson("/data/word-corpus-extra.json"),
  ]);

  const allWords = [...corpusJson.words, ...corpusExtraJson.words];
  const corpusIndex = buildCorpusIndex(allWords, PRESET_TLDS);

  const library: Record<string, string[]> = { ...corpusIndex };
  mergeLibrary(library, BASE_LIBRARY);
  mergeLibrary(library, WORD_LIBRARY_EXTRA);
  mergeLibrary(library, WORD_LIBRARY_EXTRA2);
  mergeLibrary(library, WORD_LIBRARY_EXTRA3);
  mergeLibrary(library, WORD_LIBRARY_EXTRA4);
  mergeLibrary(library, WORD_LIBRARY_EXTRA5);
  mergeLibrary(library, WORD_LIBRARY_EXTRA6);
  mergeLibrary(library, WORD_LIBRARY_EXTRA7);
  mergeLibrary(library, WORD_LIBRARY_EXTRA8);
  mergeLibrary(library, WORD_LIBRARY_EXTRA9);
  mergeLibrary(library, WORD_LIBRARY_EXTRA10);
  mergeLibrary(library, WORD_LIBRARY_EXTRA11);
  mergeLibrary(library, WORD_LIBRARY_EXTRA12);
  mergeLibrary(library, WORD_LIBRARY_EXTRA13);
  mergeLibrary(library, WORD_LIBRARY_EXTRA14);
  mergeLibrary(library, WORD_LIBRARY_EXTRA15);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16A);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16B);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16C);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16D);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16E);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16F);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16G);
  mergeLibrary(library, WORD_LIBRARY_EXTRA16H);
  mergeLibrary(library, WORD_LIBRARY_EXTRA17);
  mergeLibrary(library, WORD_LIBRARY_EXTRA18);
  mergeLibrary(library, WORD_LIBRARY_EXTRA19);
  mergeLibrary(library, WORD_LIBRARY_EXTRA20);
  mergeLibrary(library, WORD_LIBRARY_EXTRA21);
  mergeLibrary(library, PINYIN_WORD_LIBRARY);

  const meanings: Record<string, string> = {
    ...corpusJson.meanings,
    ...corpusExtraJson.meanings,
    ...WORD_MEANINGS_WORDS,
    ...BASE_MEANINGS,
    ...WORD_MEANINGS_EXTRA,
    ...WORD_MEANINGS_EXTRA2,
    ...WORD_MEANINGS_EXTRA3,
    ...WORD_MEANINGS_EXTRA4,
    ...WORD_MEANINGS_EXTRA5,
    ...WORD_MEANINGS_EXTRA7,
    ...WORD_MEANINGS_EXTRA8,
    ...WORD_MEANINGS_EXTRA9,
    ...WORD_MEANINGS_EXTRA10,
    ...WORD_MEANINGS_EXTRA11,
    ...WORD_MEANINGS_EXTRA12,
    ...WORD_MEANINGS_EXTRA13,
    ...WORD_MEANINGS_EXTRA14A,
    ...WORD_MEANINGS_EXTRA14B,
    ...WORD_MEANINGS_EXTRA14C,
    ...WORD_MEANINGS_EXTRA15A,
    ...WORD_MEANINGS_EXTRA15B,
    ...WORD_MEANINGS_EXTRA16A,
    ...WORD_MEANINGS_EXTRA16B,
    ...WORD_MEANINGS_EXTRA16C,
    ...WORD_MEANINGS_EXTRA17,
    ...PINYIN_MEANINGS,
  };

  _wordLibrary = library;
  _wordMeanings = meanings;
  return { library, meanings };
}

function getLibrary(): Record<string, string[]> { return _wordLibrary || {}; }
function getMeanings(): Record<string, string> { return _wordMeanings || {}; }
function getWordsForTld(tld: string): string[] {
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  return getLibrary()[tldClean] || [];
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function preloadLibraries(): Promise<void> {
  await loadLibraries();
}

export function isLibraryReady(): boolean {
  return _wordLibrary !== null;
}

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

  const tokens = tokenizePhrase(rawInput);

  for (const token of tokens) {
    const cleanKeyword = token.replace(/[^a-z0-9]/g, "");
    if (!cleanKeyword || cleanKeyword.length < 1) continue;

    const keywordWords = includeVariants ? generateVariants(cleanKeyword) : [cleanKeyword];

    for (const word of keywordWords) {
      for (const tld of tlds) {
        const tldClean = tld.replace(/^\./, "").toLowerCase();
        const pos = findHackPosition(word, tldClean);
        if (pos === null) continue;

        const prefix = word.substring(0, pos);
        const domain = `${prefix}.${tldClean}`;
        if (seen.has(domain)) continue;
        seen.add(domain);

        const meaning = meanings[domain] || meanings[word] || meanings[cleanKeyword] || "";
        results.push(buildHackResult(domain, word, tld, prefix, false, meaning));
      }
    }

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

        const meaning = meanings[domain] || meanings[wordLower] || meanings[cleanKeyword] || "";
        results.push(buildHackResult(domain, wordLower, tld, prefix, true, meaning));
      }
    }
  }

  return results;
}

export function getAllHacksForTld(tld: string): HackResult[] {
  const library = getLibrary();
  const meanings = getMeanings();
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  const words = library[tldClean] || [];
  const tldDot = tld.startsWith(".") ? tld : "." + tld;
  const results: HackResult[] = [];

  for (const word of words) {
    const wordLower = word.toLowerCase();
    const pos = findHackPosition(wordLower, tldClean);
    if (pos === null) continue;
    const prefix = wordLower.substring(0, pos);
    const domain = `${prefix}.${tldClean}`;
    const meaning = meanings[domain] || meanings[wordLower] || "";
    results.push(buildHackResult(domain, wordLower, tldDot, prefix, true, meaning));
  }

  return results.sort((a, b) => b.score - a.score);
}

export function getTldWordCount(tld: string): number {
  const library = getLibrary();
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  return (library[tldClean] || []).length;
}
