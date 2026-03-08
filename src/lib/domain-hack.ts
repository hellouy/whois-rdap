// Domain Hack Generator Logic — Enhanced with comprehensive word library

export interface HackResult {
  domain: string;       // e.g. "doma.in"
  keyword: string;      // original keyword or source word
  tld: string;          // e.g. ".in"
  prefix: string;       // part before TLD: "doma"
  score: number;        // composite score
  creativity: number;   // creativity score 0-100
  lengthScore: number;  // shorter = better
  isExact: boolean;     // keyword === prefix + tld (no dot)
  isFromLibrary: boolean; // from word library vs keyword variant
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
  ".mc", ".md", ".mg", ".mk", ".ml", ".mn", ".mo", ".mp", ".mq",
  ".mr", ".ms", ".mt", ".mv", ".mw", ".mx", ".my", ".mz", ".na", ".nc",
  ".ne", ".nf", ".ni", ".nl", ".np", ".nr", ".nz", ".pa", ".pf", ".pg",
  ".pk", ".pn", ".pr", ".ps", ".pw", ".py", ".qa", ".rw", ".sa", ".sb",
  ".sc", ".sd", ".sg", ".sl", ".sm", ".sn", ".sr", ".sv", ".sx", ".sy",
  ".sz", ".td", ".tg", ".th", ".tj", ".tk", ".tl", ".tm", ".tn", ".tr",
  ".tt", ".tw", ".tz", ".ua", ".ug", ".ve", ".vg", ".vi", ".vn", ".vu",
  ".ye", ".za", ".zm", ".zw",
];

export const POPULAR_TLDS = [
  ".io", ".ai", ".co", ".me", ".ly", ".is", ".it", ".us", ".am", ".be",
  ".es", ".in", ".rs", ".re", ".al", ".at", ".ch", ".de", ".id", ".im",
  ".la", ".ng", ".no", ".nu", ".sh", ".so", ".st", ".to", ".tv",
];

// ============================================================
// Comprehensive English word library for domain hack splitting
// Organized by common TLD endings for efficient matching
// ============================================================
const WORD_LIBRARY: Record<string, string[]> = {
  // .in words
  in: [
    "domain", "join", "train", "brain", "gain", "chain", "main", "plain",
    "again", "remain", "contain", "obtain", "login", "plugin", "begin",
    "win", "skin", "spin", "twin", "pin", "bin", "thin", "grin", "fin",
    "cabin", "satin", "resin", "basin", "ruin", "coin", "latin", "margin",
    "origin", "virgin", "certain", "captain", "mountain", "fountain",
    "curtain", "villain", "terrain", "explain", "complain", "maintain",
    "entertain", "sustain", "attain", "detain", "retain", "strain",
    "admin", "bulletin", "dolphin", "penguin", "pumpkin", "napkin",
    "vitamin", "assassin", "insulin", "berlin", "darwin", "protein",
  ],
  // .ly words
  ly: [
    "daily", "weekly", "monthly", "quickly", "safely", "lovely", "lively",
    "finally", "actually", "totally", "naturally", "virtually", "only",
    "truly", "holy", "early", "nearly", "clearly", "exactly", "definitely",
    "barely", "rarely", "merely", "surely", "purely", "lately", "widely",
    "deeply", "badly", "sadly", "madly", "gladly", "friendly", "kindly",
    "costly", "ghostly", "mostly", "likely", "lonely", "homely", "ugly",
    "supply", "apply", "reply", "multiply", "imply", "comply", "rely",
    "fly", "sly", "ally", "bully", "jelly", "belly", "silly", "hilly",
    "family", "italy", "anomaly", "assembly", "butterfly", "centrally",
    "smartly", "partly", "softly", "gently", "simply", "openly",
  ],
  // .am words
  am: [
    "stream", "dream", "team", "beam", "seam", "cream", "scream",
    "program", "diagram", "jam", "spam", "gram", "slam", "clam",
    "exam", "foam", "roam", "steam", "gleam", "swam", "tram",
    "instagram", "telegram", "monogram", "histogram", "anagram",
  ],
  // .is words
  is: [
    "this", "his", "crisis", "basis", "analysis", "thesis", "emphasis",
    "hypothesis", "genesis", "oasis", "tennis", "ibis", "cannabis",
    "diagnosis", "synopsis", "paralysis", "metamorphosis", "synthesis",
    "antithesis", "parenthesis", "nemesis", "catharsis", "chassis",
  ],
  // .it words
  it: [
    "bit", "fit", "hit", "kit", "unit", "edit", "visit", "credit",
    "profit", "benefit", "submit", "commit", "reddit", "limit", "spit",
    "quit", "admit", "permit", "exhibit", "inhabit", "rabbit", "orbit",
    "spirit", "transit", "deposit", "merit", "digit", "audit", "summit",
    "circuit", "biscuit", "pursuit", "recruit", "outfit", "legit",
    "transmit", "explicit", "implicit", "illicit", "solicit", "elicit",
  ],
  // .us words
  us: [
    "focus", "bonus", "status", "genius", "virus", "campus", "plus",
    "minus", "bus", "circus", "cactus", "radius", "famous", "curious",
    "serious", "obvious", "previous", "enormous", "gorgeous", "generous",
    "ambiguous", "continuous", "anonymous", "census", "consensus",
    "nexus", "corpus", "stimulus", "surplus", "apparatus", "nucleus",
    "fungus", "octopus", "platypus", "prospectus", "syllabus", "calculus",
  ],
  // .io words
  io: [
    "studio", "audio", "radio", "ratio", "patio", "portfolio", "scenario",
    "bio", "trio", "cardio", "folio", "pistachio", "cheerio", "presidio",
  ],
  // .ai words
  ai: [
    "domain", "samurai", "bonsai", "dubai", "thai", "shanghai", "versai",
    "assai",
  ],
  // .co words
  co: [
    "taco", "eco", "disco", "morocco", "tobacco", "fiasco", "fresco",
    "cisco", "bronco", "micro", "macro",
  ],
  // .me words
  me: [
    "game", "name", "home", "time", "shame", "frame", "blame", "flame",
    "scheme", "extreme", "costume", "volume", "resume", "assume",
    "consume", "welcome", "become", "outcome", "income", "awesome",
    "handsome", "lonesome", "overcome", "sometime", "lifetime", "runtime",
    "bedtime", "prime", "crime", "rhyme", "enzyme", "genome", "syndrome",
    "chrome", "dome", "gnome", "theme", "supreme", "regime",
  ],
  // .be words
  be: [
    "tube", "cube", "globe", "probe", "tribe", "scribe", "describe",
    "subscribe", "prescribe", "adobe", "robe", "vibe", "bribe",
  ],
  // .es words
  es: [
    "games", "notes", "votes", "pages", "lines", "eyes", "waves",
    "shares", "codes", "nodes", "modes", "zones", "tones", "bones",
    "stones", "drones", "clones", "phones", "homes", "names", "flames",
    "frames", "files", "tiles", "miles", "smiles", "styles", "types",
    "rates", "dates", "gates", "states", "plates", "updates", "creates",
    "loves", "moves", "drives", "lives", "gives", "serves", "curves",
    "nerves", "solves", "evolves", "involves", "resolves",
  ],
  // .al words
  al: [
    "digital", "global", "local", "social", "natural", "virtual",
    "central", "general", "federal", "liberal", "mineral", "animal",
    "capital", "hospital", "criminal", "original", "terminal", "personal",
    "tropical", "classical", "universal", "commercial", "professional",
    "emotional", "etical", "practical", "magical", "logical", "musical",
    "physical", "optical", "radical", "vital", "metal", "crystal",
    "signal", "journal", "festival", "survival", "arrival", "approval",
    "removal", "proposal", "renewal", "royal", "loyal", "coral", "moral",
    "neural", "plural", "rural", "viral", "total", "brutal", "rental",
  ],
  // .at words
  at: [
    "chat", "flat", "format", "combat", "cat", "hat", "bat", "mat",
    "rat", "sat", "fat", "pat", "brat", "stat", "treat", "beat",
    "heat", "meat", "seat", "feat", "great", "threat", "repeat",
    "defeat", "habitat", "diplomat", "democrat", "aristocrat",
  ],
  // .de words
  de: [
    "code", "mode", "node", "guide", "inside", "outside", "decide",
    "provide", "include", "exclude", "trade", "grade", "blade",
    "shade", "upgrade", "arcade", "cascade", "decade", "facade",
    "lemonade", "parade", "crusade", "blockade", "handmade",
    "homemade", "attitude", "gratitude", "magnitude", "latitude",
    "altitude", "multitude", "solitude", "fortitude", "aptitude",
    "worldwide", "override", "pride", "ride", "slide", "glide",
    "hide", "side", "wide", "divide", "collide", "confide",
  ],
  // .id words
  id: [
    "rapid", "valid", "vivid", "solid", "liquid", "stupid", "hybrid",
    "android", "avoid", "grid", "kid", "bid", "lid", "amid", "acid",
    "orchid", "pyramid", "squid", "lucid", "morbid", "timid", "rigid",
    "fluid", "placid", "torrid", "horrid", "squalid", "candid",
    "splendid", "intrepid", "limpid", "tepid", "arid", "fervid",
  ],
  // .ch words
  ch: [
    "search", "launch", "branch", "match", "watch", "catch", "patch",
    "batch", "attach", "dispatch", "scratch", "sketch", "stretch",
    "fetch", "switch", "rich", "which", "such", "much", "touch",
    "approach", "research", "reproach", "coach", "poach", "reach",
    "beach", "teach", "preach", "bleach", "breach", "tech", "fintech",
  ],
  // .er words
  er: [
    "maker", "player", "hacker", "gamer", "coder", "leader", "builder",
    "finder", "minder", "reader", "speaker", "thinker", "worker",
    "helper", "keeper", "seeker", "walker", "talker", "tracker",
    "blogger", "driver", "writer", "killer", "thriller", "filler",
    "banner", "scanner", "planner", "dinner", "winner", "inner",
    "outer", "super", "power", "tower", "flower", "shower", "clever",
    "never", "ever", "fever", "river", "silver", "deliver", "cover",
    "discover", "recover", "hover", "lover", "over", "under", "wonder",
    "thunder", "render", "tender", "gender", "sender", "defender",
    "blender", "slender", "surrender", "transfer", "offer", "differ",
    "buffer", "suffer", "trigger", "bigger", "digger", "bitter", "litter",
    "matter", "scatter", "shatter", "chatter", "better", "letter",
    "shelter", "filter", "master", "faster", "cluster", "monster",
    "register", "minister", "chapter", "character", "computer", "center",
    "counter", "encounter", "pointer", "printer", "enter", "winter",
    "summer", "number", "member", "remember", "timber", "chamber",
  ],
  // .ge words
  ge: [
    "page", "stage", "image", "change", "range", "strange", "challenge",
    "message", "package", "storage", "voltage", "vintage", "cottage",
    "manage", "damage", "garage", "passage", "massage", "sausage",
    "language", "knowledge", "college", "privilege", "voyage", "engage",
    "encourage", "advantage", "leverage", "coverage", "average", "erage",
    "luggage", "village", "marriage", "courage", "usage", "dosage",
    "bridge", "ridge", "edge", "ledge", "wedge", "pledge", "hedge",
    "judge", "badge", "lodge", "nudge", "budge", "forge", "gorge",
    "huge", "refuge", "large", "merge", "emerge", "surge", "purge",
  ],
  // .ng words  
  ng: [
    "coding", "gaming", "making", "building", "finding", "reading",
    "speaking", "thinking", "working", "helping", "keeping", "seeking",
    "walking", "talking", "tracking", "blogging", "driving", "writing",
    "killing", "filling", "planning", "running", "winning", "beginning",
    "opening", "closing", "hosting", "testing", "meeting", "setting",
    "getting", "letting", "sitting", "hitting", "cutting", "putting",
    "shopping", "shipping", "mapping", "tapping", "wrapping", "clapping",
    "string", "spring", "bring", "ring", "king", "thing", "sing",
    "wing", "swing", "sting", "cling", "fling", "sling", "wring",
    "strong", "long", "song", "wrong", "along", "belong", "among",
    "young", "hung", "lung", "tongue",
  ],
  // .se words
  se: [
    "close", "choose", "browse", "course", "horse", "house", "mouse",
    "cause", "pause", "clause", "phrase", "raise", "praise", "chase",
    "base", "case", "lease", "release", "increase", "decrease",
    "purchase", "promise", "surprise", "exercise", "enterprise",
    "database", "paradise", "precise", "concise", "pulse", "impulse",
    "reverse", "diverse", "universe", "inverse", "converse", "immerse",
    "disperse", "nurse", "purse", "curse", "verse", "adverse",
    "response", "defense", "offense", "expense", "suspense", "intense",
    "dense", "sense", "tense", "license", "silence", "violence",
    "patience", "absence", "presence", "essence", "conscience",
  ],
  // .no words
  no: [
    "piano", "casino", "volcano", "techno", "rhino", "albino", "domino",
    "espresso", "cappuccino", "soprano",
  ],
  // .to words
  to: [
    "crypto", "photo", "auto", "potato", "tomato", "mosquito", "veto",
    "pluto", "manifesto", "risotto", "grotto", "lotto", "motto", "proto",
  ],
  // .sh words
  sh: [
    "crash", "flash", "splash", "clash", "trash", "smash", "bash",
    "cash", "dash", "hash", "lash", "mash", "rash", "wash", "squash",
    "fresh", "mesh", "flesh", "refresh", "crush", "brush", "rush",
    "blush", "flush", "hush", "push", "bush", "gush", "plush",
    "finish", "publish", "polish", "abolish", "establish", "demolish",
    "accomplish", "cherish", "flourish", "furnish", "nourish", "perish",
    "punish", "vanish", "banish", "garnish", "tarnish", "diminish",
    "distinguish", "extinguish", "relinquish", "astonish",
    "fish", "wish", "dish", "swish",
  ],
  // .so words
  so: [
    "also", "espresso",
  ],
  // .rs words
  rs: [
    "makers", "players", "hackers", "gamers", "coders", "leaders",
    "builders", "finders", "readers", "speakers", "thinkers", "workers",
    "helpers", "keepers", "seekers", "walkers", "talkers", "trackers",
    "bloggers", "drivers", "writers", "killers", "planners", "winners",
    "doors", "floors", "colors", "favors", "motors", "actors",
    "factors", "doctors", "editors", "authors", "mirrors", "errors",
    "sensors", "mentors", "tutors", "vectors", "sectors",
    "stars", "bars", "cars", "wars", "scars", "jars", "cigars",
    "guitars", "avatars", "radars", "calendars", "pillars", "scholars",
    "flowers", "powers", "towers", "showers", "answers", "offers",
    "matters", "letters", "numbers", "members", "masters", "chapters",
    "computers", "centers", "counters", "pointers", "printers", "filters",
  ],
  // .tv words
  tv: [],
  // .re words
  re: [
    "share", "care", "dare", "rare", "bare", "fare", "glare", "spare",
    "stare", "compare", "prepare", "declare", "aware", "beware",
    "software", "hardware", "firmware", "malware", "nightmare", "welfare",
    "warfare", "elsewhere", "therefore", "before", "explore", "restore",
    "ignore", "adore", "store", "score", "core", "more", "shore",
    "secure", "mature", "future", "nature", "culture", "structure",
    "adventure", "creature", "feature", "mixture", "texture", "picture",
    "capture", "gesture", "posture", "torture", "moisture", "vulture",
    "inspire", "desire", "require", "acquire", "retire", "entire",
    "fire", "hire", "wire", "tire", "empire", "vampire", "admire",
    "aspire", "conspire", "expire",
  ],
  // .nu words
  nu: [
    "menu", "venue", "avenue", "revenue", "continue",
  ],
  // .la words
  la: [
    "gala", "villa", "gorilla", "vanilla", "umbrella", "stella",
    "formula", "nebula", "peninsula", "mandala", "koala",
  ],
  // .im words
  im: [
    "claim", "aim", "slim", "swim", "trim", "brim", "grim", "whim",
    "victim", "pilgrim", "interim", "maximum", "minimum", "optimum",
    "premium", "stadium", "medium", "podium", "aquarium", "curriculum",
  ],
};

// Build a reverse index: for each TLD, get all words that END with it
function getWordsForTld(tld: string): string[] {
  const tldClean = tld.replace(/^\./, "").toLowerCase();
  return WORD_LIBRARY[tldClean] || [];
}

// Generate word variants from the keyword
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
  if (keyword.length <= 5 && /[bcdfgklmnprstvz]$/.test(keyword)) {
    const doubled = keyword + keyword[keyword.length - 1];
    variants.add(doubled + "ing");
    variants.add(doubled + "er");
    variants.add(doubled + "ed");
  }
  return Array.from(variants);
}

// Find hack position: TLD must be at end of word with at least 1 char prefix
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

  // Exact match → highest creativity
  if ((prefix + tldClean).toLowerCase() === word.toLowerCase()) {
    score += 30;
  }
  // Real English word from library → extra bonus
  if (isFromLibrary) score += 15;
  // Short prefix → more creative
  if (prefix.length <= 2) score += 15;
  else if (prefix.length <= 4) score += 10;
  else if (prefix.length <= 6) score += 5;
  // Readable prefix
  if (/[aeiou]/i.test(prefix)) score += 3;
  if (prefix.length >= 2 && /^[a-z]+$/i.test(prefix)) score += 3;
  // Penalize very long domains
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

  // 1. Generate variants from the keyword
  const keywordWords = includeVariants
    ? generateVariants(cleanKeyword)
    : [cleanKeyword];

  const results: HackResult[] = [];
  const seen = new Set<string>();

  // 2. Match keyword variants against selected TLDs
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

  // 3. Search the word library for words CONTAINING the keyword
  for (const tld of tlds) {
    const tldClean = tld.replace(/^\./, "").toLowerCase();
    const libraryWords = getWordsForTld(tldClean);

    for (const word of libraryWords) {
      const wordLower = word.toLowerCase();
      // Word must contain the keyword as substring
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
