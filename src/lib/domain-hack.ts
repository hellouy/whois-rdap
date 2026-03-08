// Domain Hack Generator Logic

export interface HackResult {
  domain: string;       // e.g. "doma.in"
  keyword: string;      // original keyword
  tld: string;          // e.g. ".in"
  prefix: string;       // part before TLD: "doma"
  score: number;        // composite score
  creativity: number;   // creativity score 0-100
  lengthScore: number;  // shorter = better
  isExact: boolean;     // keyword === prefix + tld (no dot)
}

export const PRESET_TLDS = [
  ".com", ".net", ".org", ".io", ".ai", ".co", ".me", ".ly", ".is", ".it",
  ".us", ".am", ".be", ".es", ".in", ".rs", ".re", ".al", ".at", ".ch",
  ".de", ".do", ".er", ".ge", ".gl", ".id", ".im", ".ir", ".ke", ".la",
  ".li", ".ma", ".mu", ".ng", ".no", ".nu", ".om", ".pe", ".ph", ".pl",
  ".pm", ".pt", ".ro", ".ru", ".se", ".sh", ".si", ".sk", ".so", ".st",
  ".su", ".tc", ".tf", ".to", ".tv", ".uk", ".uy", ".uz", ".vc", ".ws",
  ".ac", ".ad", ".ag", ".as", ".ax", ".bi", ".bz", ".cc", ".cf", ".cg",
  ".ci", ".cl", ".cm", ".cr", ".cx", ".cz", ".dj", ".dk", ".dm", ".dz",
  ".ec", ".ee", ".eg", ".fi", ".fm", ".fo", ".ga", ".gd", ".gg", ".gi",
  ".gn", ".gp", ".gq", ".gr", ".gs", ".gt", ".gy", ".hk", ".hm", ".hn",
  ".hr", ".ht", ".hu", ".ie", ".il", ".je", ".jo", ".jp", ".ki", ".kn",
  ".kr", ".ky", ".kz", ".lb", ".lc", ".lk", ".ls", ".lt", ".lu", ".lv",
  ".ly", ".mc", ".md", ".mg", ".mk", ".ml", ".mn", ".mo", ".mp", ".mq",
  ".mr", ".ms", ".mt", ".mv", ".mw", ".mx", ".my", ".mz", ".na", ".nc",
  ".ne", ".nf", ".ni", ".nl", ".np", ".nr", ".nz", ".pa", ".pf", ".pg",
  ".pk", ".pn", ".pr", ".ps", ".pw", ".py", ".qa", ".rw", ".sa", ".sb",
  ".sc", ".sd", ".sg", ".sl", ".sm", ".sn", ".sr", ".sv", ".sx", ".sy",
  ".sz", ".td", ".tg", ".th", ".tj", ".tk", ".tl", ".tm", ".tn", ".tr",
  ".tt", ".tw", ".tz", ".ua", ".ug", ".ve", ".vg", ".vi", ".vn", ".vu",
  ".ye", ".za", ".zm", ".zw",
];

// Popular TLDs shown by default
export const POPULAR_TLDS = [
  ".io", ".ai", ".co", ".me", ".ly", ".is", ".it", ".us", ".am", ".be",
  ".es", ".in", ".rs", ".re", ".al", ".at", ".ch", ".de", ".id", ".im",
  ".la", ".ng", ".no", ".nu", ".sh", ".so", ".st", ".to", ".tv",
];

// Generate word variants
function generateVariants(keyword: string): string[] {
  const variants = new Set<string>();
  variants.add(keyword);

  // Plural
  if (!keyword.endsWith("s")) {
    variants.add(keyword + "s");
  }
  // Remove trailing s
  if (keyword.endsWith("s") && keyword.length > 2) {
    variants.add(keyword.slice(0, -1));
  }
  // -ing
  variants.add(keyword + "ing");
  // -er
  variants.add(keyword + "er");
  // -ed
  variants.add(keyword + "ed");
  // -ly
  variants.add(keyword + "ly");
  // -tion
  variants.add(keyword + "tion");
  // -ment
  variants.add(keyword + "ment");
  // -ness
  variants.add(keyword + "ness");
  // -able
  variants.add(keyword + "able");
  // -ful
  variants.add(keyword + "ful");
  // -less
  variants.add(keyword + "less");
  // double last letter + ing/er/ed (for short words)
  if (keyword.length <= 5 && /[bcdfgklmnprstvz]$/.test(keyword)) {
    const doubled = keyword + keyword[keyword.length - 1];
    variants.add(doubled + "ing");
    variants.add(doubled + "er");
    variants.add(doubled + "ed");
  }

  return Array.from(variants);
}

// Find all positions where TLD matches within word
function findHackPositions(word: string, tld: string): number[] {
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  const wordLower = word.toLowerCase();
  const positions: number[] = [];

  for (let i = 0; i <= wordLower.length - tldClean.length; i++) {
    if (wordLower.substring(i, i + tldClean.length) === tldClean) {
      // Valid: TLD must be at end of word, or leave at least 1 char prefix
      if (i + tldClean.length === wordLower.length && i > 0) {
        positions.push(i);
      }
    }
  }

  return positions;
}

function calculateCreativity(prefix: string, keyword: string, tld: string): number {
  let score = 50;
  const tldClean = tld.replace(/^\./, "");

  // Exact match (word = prefix + tld) → highest creativity
  if ((prefix + tldClean).toLowerCase() === keyword.toLowerCase()) {
    score += 40;
  }
  // Short prefix → more creative
  if (prefix.length <= 3) score += 15;
  else if (prefix.length <= 5) score += 8;

  // Readable prefix (no weird consonant clusters)
  if (/[aeiou]/i.test(prefix)) score += 5;

  // Common English word prefix boost
  if (prefix.length >= 2 && /^[a-z]+$/i.test(prefix)) score += 5;

  // Penalize very long domains
  if (prefix.length > 10) score -= 10;

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

  const words = includeVariants
    ? generateVariants(cleanKeyword)
    : [cleanKeyword];

  const results: HackResult[] = [];
  const seen = new Set<string>();

  for (const word of words) {
    for (const tld of tlds) {
      const positions = findHackPositions(word, tld);
      for (const pos of positions) {
        const prefix = word.substring(0, pos);
        const domain = `${prefix}.${tld.replace(/^\./, "")}`;

        if (seen.has(domain.toLowerCase())) continue;
        seen.add(domain.toLowerCase());

        const tldClean = tld.replace(/^\./, "");
        const creativity = calculateCreativity(prefix, cleanKeyword, tld);
        const lengthScore = Math.max(0, 100 - (prefix.length + tldClean.length) * 5);
        const score = Math.round(creativity * 0.6 + lengthScore * 0.4);
        const isExact = (prefix + tldClean).toLowerCase() === cleanKeyword;

        results.push({
          domain,
          keyword: word,
          tld,
          prefix,
          score,
          creativity,
          lengthScore,
          isExact,
        });
      }
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
