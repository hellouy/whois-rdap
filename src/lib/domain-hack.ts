// Domain Hack Generator Logic — imports from modular files

import { WORD_LIBRARY } from "./word-library";
import { WORD_MEANINGS } from "./word-meanings";
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

function getWordsForTld(tld: string): string[] {
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  return WORD_LIBRARY[tldClean] || [];
}

function generateVariants(keyword: string): string[] {
  const variants = new Set<string>();
  variants.add(keyword);
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
  if (keyword.length <= 5 && /[bcdfgklmnprstvz]$/.test(keyword)) {
    const doubled = keyword + keyword[keyword.length - 1];
    variants.add(doubled + "ing");
    variants.add(doubled + "er");
    variants.add(doubled + "ed");
  }
  // prefix variants
  const prefixes = ["un", "re", "pre", "mis", "out", "over", "under", "up"];
  for (const p of prefixes) {
    variants.add(p + keyword);
  }
  return Array.from(variants);
}

function findHackPosition(word: string, tldClean: string): number | null {
  const wordLower = word.toLowerCase();
  const endIndex = wordLower.length - tldClean.length;
  if (endIndex > 0 && wordLower.endsWith(tldClean)) {
    return endIndex;
  }
  return null;
}

function calculateCreativity(prefix: string, word: string, tld: string, isFromLibrary: boolean): number {
  let score = 50;
  const tldClean = tld.replace(/^\./, "");

  if ((prefix + tldClean).toLowerCase() === word.toLowerCase()) {
    score += 30;
  }
  if (isFromLibrary) score += 15;
  if (prefix.length <= 2) score += 15;
  else if (prefix.length <= 4) score += 10;
  else if (prefix.length <= 6) score += 5;
  if (/[aeiou]/i.test(prefix)) score += 3;
  if (prefix.length >= 2 && /^[a-z]+$/i.test(prefix)) score += 3;
  if (prefix.length > 10) score -= 10;
  if (prefix.length > 15) score -= 15;

  return Math.min(100, Math.max(0, score));
}

export type SortMode = "score" | "creativity" | "length" | "alpha";

export function generateDomainHacks(
  keyword: string,
  tlds: string[],
  includeVariants: boolean = true
): HackResult[] {
  if (!keyword.trim()) return [];

  const cleanKeyword = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!cleanKeyword) return [];

  const keywordWords = includeVariants
    ? generateVariants(cleanKeyword)
    : [cleanKeyword];

  const results: HackResult[] = [];
  const seen = new Set<string>();

  for (const word of keywordWords) {
    for (const tld of tlds) {
      const tldClean = tld.replace(/^\./, "").toLowerCase();
      const pos = findHackPosition(word, tldClean);
      if (pos !== null) {
        const prefix = word.substring(0, pos);
        const domain = `${prefix}.${tldClean}`;
        if (seen.has(domain)) continue;
        seen.add(domain);

        const creativity = calculateCreativity(prefix, word, tld, false);
        const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
        const score = Math.round(creativity * 0.6 + lengthScore * 0.4);
        const isExact = (prefix + tldClean).toLowerCase() === cleanKeyword;

        results.push({
          domain, keyword: word, tld, prefix, score, creativity, lengthScore,
          isExact, isFromLibrary: false,
        });
      }
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

      const creativity = calculateCreativity(prefix, wordLower, tld, true);
      const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
      const score = Math.round(creativity * 0.6 + lengthScore * 0.4);

      results.push({
        domain, keyword: wordLower, tld, prefix, score, creativity, lengthScore,
        isExact: false, isFromLibrary: true,
      });
    }
  }

  return results;
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
  return results.map(r => r.domain).join("\n");
}
