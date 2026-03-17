import { describe, it, expect } from "vitest";
import {
  generateVariants,
  tokenizePhrase,
  findHackPosition,
  calculateCreativity,
  sortHacks,
  exportHacks,
  buildHackResult,
  type HackResult,
} from "@/lib/hack-logic";

// ── generateVariants ──────────────────────────────────────────────────────────

describe("generateVariants", () => {
  it("always includes the base keyword", () => {
    const v = generateVariants("cloud");
    expect(v).toContain("cloud");
  });

  it("generates common English morphological forms", () => {
    const v = generateVariants("work");
    expect(v).toContain("works");
    expect(v).toContain("working");
    expect(v).toContain("worker");
    expect(v).toContain("worked");
    expect(v).toContain("rework");
    expect(v).toContain("overwork");
  });

  it("returns empty array for empty string", () => {
    expect(generateVariants("")).toEqual([]);
  });

  it("strips special characters from the keyword before generating", () => {
    const v = generateVariants("clou-d!");
    expect(v).toContain("cloud");
    expect(v).toContain("clouds");
  });

  it("handles very long keyword without errors", () => {
    const longWord = "a".repeat(200);
    const v = generateVariants(longWord);
    expect(Array.isArray(v)).toBe(true);
    expect(v.length).toBeGreaterThan(0);
  });

  it("generates doubled-consonant forms for short words ending in consonant", () => {
    const v = generateVariants("run");
    expect(v).toContain("running");
    expect(v).toContain("runner");
  });

  it("adds un/re/pre prefixes", () => {
    const v = generateVariants("link");
    expect(v).toContain("unlink");
    expect(v).toContain("relink");
    expect(v).toContain("prelink");
  });

  it("handles numeric-only keyword", () => {
    const v = generateVariants("42");
    expect(Array.isArray(v)).toBe(true);
  });

  it("returns unique variants (no duplicates)", () => {
    const v = generateVariants("set");
    const s = new Set(v);
    expect(s.size).toBe(v.length);
  });
});

// ── tokenizePhrase ────────────────────────────────────────────────────────────

describe("tokenizePhrase", () => {
  it("returns individual words for space-separated input", () => {
    const tokens = tokenizePhrase("big data");
    expect(tokens).toContain("big");
    expect(tokens).toContain("data");
  });

  it("generates concatenated pair tokens", () => {
    const tokens = tokenizePhrase("big data");
    expect(tokens).toContain("bigdata");
  });

  it("handles hyphen-separated words", () => {
    const tokens = tokenizePhrase("next-gen");
    expect(tokens).toContain("next");
    expect(tokens).toContain("gen");
    expect(tokens).toContain("nextgen");
  });

  it("returns empty array for empty string", () => {
    expect(tokenizePhrase("")).toEqual([]);
  });

  it("returns empty array for null-ish input", () => {
    expect(tokenizePhrase("   ")).toEqual([]);
  });

  it("strips special characters", () => {
    const tokens = tokenizePhrase("hello@world.com");
    expect(tokens).toContain("helloworldcom");
  });

  it("handles single word without producing empty tokens", () => {
    const tokens = tokenizePhrase("cloud");
    expect(tokens).toContain("cloud");
    expect(tokens.filter((t) => t === "")).toHaveLength(0);
  });

  it("handles three-word phrase", () => {
    const tokens = tokenizePhrase("one two three");
    expect(tokens).toContain("one");
    expect(tokens).toContain("two");
    expect(tokens).toContain("three");
    expect(tokens).toContain("onetwo");
    expect(tokens).toContain("twothree");
    expect(tokens).toContain("onetwothree");
  });
});

// ── findHackPosition ──────────────────────────────────────────────────────────

describe("findHackPosition", () => {
  it("finds the split position when TLD is at the end", () => {
    expect(findHackPosition("clever", "er")).toBe(4);
    expect(findHackPosition("connect", "ct")).toBe(5);
    expect(findHackPosition("cloud", "ud")).toBe(3);
  });

  it("returns null when TLD is not at the end", () => {
    expect(findHackPosition("cloudy", "ud")).toBeNull();
    expect(findHackPosition("network", "org")).toBeNull();
  });

  it("returns null when prefix would be empty (word === tld)", () => {
    expect(findHackPosition("io", "io")).toBeNull();
    expect(findHackPosition("com", "com")).toBeNull();
  });

  it("returns null for empty inputs", () => {
    expect(findHackPosition("", "io")).toBeNull();
    expect(findHackPosition("cloud", "")).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(findHackPosition("CLEVER", "er")).toBe(4);
    expect(findHackPosition("Cloud", "UD")).toBe(3);
  });
});

// ── calculateCreativity ───────────────────────────────────────────────────────

describe("calculateCreativity", () => {
  it("returns a number between 0 and 100", () => {
    const score = calculateCreativity("clov", "clover", ".er", false);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("gives a higher score for exact matches (prefix + tld === word)", () => {
    const exact = calculateCreativity("clov", "clover", ".er", false);
    const notExact = calculateCreativity("long-prefix-here", "long-prefix-hereer", ".er", false);
    expect(exact).toBeGreaterThan(notExact);
  });

  it("gives a higher score for library words vs algorithmic", () => {
    const library = calculateCreativity("cl", "clever", ".ever", true);
    const algo = calculateCreativity("cl", "clever", ".ever", false);
    expect(library).toBeGreaterThan(algo);
  });

  it("penalises very long prefixes", () => {
    const short = calculateCreativity("a", "aio", ".io", false);
    const longPfx = calculateCreativity("a".repeat(20), "a".repeat(20) + "io", ".io", false);
    expect(short).toBeGreaterThan(longPfx);
  });
});

// ── sortHacks ─────────────────────────────────────────────────────────────────

const makeHack = (domain: string, score: number, creativity: number): HackResult => ({
  domain,
  keyword: domain,
  tld: ".io",
  prefix: domain.replace(".io", ""),
  score,
  creativity,
  lengthScore: 50,
  isExact: false,
  isFromLibrary: false,
  meaning: "",
});

describe("sortHacks", () => {
  const items: HackResult[] = [
    makeHack("z.io", 10, 80),
    makeHack("a.io", 90, 20),
    makeHack("m.io", 50, 50),
  ];

  it("sorts by score descending", () => {
    const sorted = sortHacks(items, "score");
    expect(sorted[0].domain).toBe("a.io");
    expect(sorted[2].domain).toBe("z.io");
  });

  it("sorts by creativity descending", () => {
    const sorted = sortHacks(items, "creativity");
    expect(sorted[0].domain).toBe("z.io");
    expect(sorted[2].domain).toBe("a.io");
  });

  it("sorts by domain length ascending", () => {
    const withLengths: HackResult[] = [
      makeHack("longer.io", 50, 50),
      makeHack("a.io", 50, 50),
      makeHack("mid.io", 50, 50),
    ];
    const sorted = sortHacks(withLengths, "length");
    expect(sorted[0].domain).toBe("a.io");
    expect(sorted[2].domain).toBe("longer.io");
  });

  it("sorts alphabetically", () => {
    const sorted = sortHacks(items, "alpha");
    expect(sorted[0].domain).toBe("a.io");
    expect(sorted[2].domain).toBe("z.io");
  });

  it("does not mutate the original array", () => {
    const original = [...items];
    sortHacks(items, "score");
    expect(items[0].domain).toBe(original[0].domain);
  });
});

// ── exportHacks ───────────────────────────────────────────────────────────────

describe("exportHacks", () => {
  it("returns a newline-separated list of domains", () => {
    const results: HackResult[] = [
      makeHack("clev.er", 80, 80),
      makeHack("netw.ork", 70, 70),
    ];
    expect(exportHacks(results)).toBe("clev.er\nnetw.ork");
  });

  it("returns empty string for empty array", () => {
    expect(exportHacks([])).toBe("");
  });
});

// ── buildHackResult ───────────────────────────────────────────────────────────

describe("buildHackResult", () => {
  it("produces a complete HackResult with consistent score formula", () => {
    const r = buildHackResult("clev.er", "clever", ".er", "clev", true, "聪明的");
    expect(r.domain).toBe("clev.er");
    expect(r.keyword).toBe("clever");
    expect(r.tld).toBe(".er");
    expect(r.prefix).toBe("clev");
    expect(r.isFromLibrary).toBe(true);
    expect(r.meaning).toBe("聪明的");
    expect(r.score).toBeGreaterThan(0);
    expect(r.creativity).toBeGreaterThan(0);
  });

  it("marks exact match correctly", () => {
    // prefix="clov" + tldClean="er" = "clover" matches keyword "clover" → isExact=true
    const realExact = buildHackResult("clov.er", "clover", ".er", "clov", false, "");
    expect(realExact.isExact).toBe(true);

    // prefix="cl" + tldClean="er" = "cler" ≠ "clever" → isExact=false
    const notExact = buildHackResult("cl.er", "clever", ".er", "cl", false, "");
    expect(notExact.isExact).toBe(false);
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("generateVariants: unicode/emoji input returns empty or safe result", () => {
    const v = generateVariants("你好");
    expect(Array.isArray(v)).toBe(true);
  });

  it("tokenizePhrase: only special chars returns empty", () => {
    expect(tokenizePhrase("!!!@@@###")).toEqual([]);
  });

  it("findHackPosition: TLD longer than word returns null", () => {
    expect(findHackPosition("io", "website")).toBeNull();
  });

  it("sortHacks: handles empty array without throwing", () => {
    expect(() => sortHacks([], "score")).not.toThrow();
    expect(sortHacks([], "score")).toEqual([]);
  });
});
