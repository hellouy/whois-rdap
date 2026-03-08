import { useState, useEffect } from "react";

/**
 * Lazily loads all word meaning dictionaries and looks up
 * the meaning for a given domain (e.g. "h.ai" → "海/嗨/害/还/孩/氦/骸/亥/骇").
 */
export function useDomainMeaning(domain: string) {
  const [meaning, setMeaning] = useState<string | null>(null);

  useEffect(() => {
    if (!domain) {
      setMeaning(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const [
        { WORD_MEANINGS },
        { WORD_MEANINGS_EXTRA },
        { WORD_MEANINGS_EXTRA2 },
        { WORD_MEANINGS_EXTRA3 },
        { WORD_MEANINGS_EXTRA4 },
        { WORD_MEANINGS_EXTRA5 },
        { PINYIN_MEANINGS },
      ] = await Promise.all([
        import("@/lib/word-meanings"),
        import("@/lib/word-meanings-extra"),
        import("@/lib/word-meanings-extra2"),
        import("@/lib/word-meanings-extra3"),
        import("@/lib/word-meanings-extra4"),
        import("@/lib/word-library-extra5"),
        import("@/lib/pinyin-library"),
      ]);

      if (cancelled) return;

      const key = domain.toLowerCase();
      const result =
        PINYIN_MEANINGS[key] ||
        WORD_MEANINGS[key] ||
        WORD_MEANINGS_EXTRA[key] ||
        WORD_MEANINGS_EXTRA2[key] ||
        WORD_MEANINGS_EXTRA3[key] ||
        WORD_MEANINGS_EXTRA4[key] ||
        WORD_MEANINGS_EXTRA5?.[key] ||
        null;

      setMeaning(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [domain]);

  return meaning;
}
