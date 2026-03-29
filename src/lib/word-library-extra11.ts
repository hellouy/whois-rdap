/**
 * word-library-extra11.ts — Massive expansion: .ht .sm .pt .ck .ax .ir .hm + gTLD supplements
 *
 * Key insight: some ccTLDs are gold mines for English words:
 *   .ht → ALL "-ight" words:  night, light, right, bright, insight…
 *   .sm → ALL "-ism" words:   organism, capitalism, optimism, symbolism…
 *   .pt → ALL "-pt" words:    encrypt, decrypt, script, accept, concept…
 *   .ck → ALL "-ck" words:    track, click, trick, black, check, quick…
 *   .ax → ALL "-ax" words:    syntax, relax, climax, Ajax, tax, wax…
 *   .ir → ALL "-ir/-air" words: hair, fair, repair, stir, algorithm…
 */

export const WORD_LIBRARY_EXTRA11: Record<string, string[]> = {

  // ── .ht — Haiti ─────────────────────────────────────────────────────────────
  // Every "-ight" English word → HUGE category!
  ht: [
    // basic -ight
    "night", "light", "right", "bright", "fight", "might", "sight",
    "tight", "flight", "slight", "blight", "plight", "knight",
    // -weight / -eight
    "weight", "height", "eighth",
    // compound -ight (common)
    "delight", "tonight", "moonlight", "sunlight", "spotlight",
    "insight", "foresight", "oversight", "highlight", "midnight",
    "daylight", "starlight", "flashlight", "headlight", "outright",
    "birthright", "copyright", "downright", "forthright", "upright",
    "alright", "uptight", "airtight", "watertight", "fortnight",
    "hindsight", "searchlight", "floodlight", "streetlight",
    "candlelight", "firelight", "torchlight", "nightlight",
    "backlight", "twilight", "limelight", "footlight",
    "playwright", "lightweight", "heavyweight", "featherweight",
    "middleweight", "flyweight", "bantamweight", "welterweight",
    // -aught / -ought (end in "ht" too)
    "ught", "thought", "brought", "fought", "caught", "taught",
    "bought", "sought", "naught", "ought", "drought",
    "distraught", "overwrought", "overwrought",
    // -echt (tech words)
    "echt",
  ],

  // ── .sm — San Marino ─────────────────────────────────────────────────────────
  // Every "-ism" word → English has 1000+ -ism words, take the best:
  sm: [
    // core -asm
    "chasm", "spasm", "sarcasm", "orgasm", "enthusiasm", "phantasm",
    "protoplasm", "ectoplasm", "plasm",
    // -ism worldviews / politics
    "capitalism", "socialism", "communism", "fascism", "liberalism",
    "conservatism", "nationalism", "patriotism", "imperialism",
    "colonialism", "federalism", "anarchism", "populism", "globalism",
    "feminism", "humanism", "pacifism", "materialism", "naturalism",
    "rationalism", "empiricism", "idealism", "realism", "pragmatism",
    "utilitarianism", "altruism", "egoism", "individualism",
    "collectivism", "totalitarianism", "authoritarianism",
    "libertarianism", "republicanism", "monarchism", "extremism",
    "radicalism", "fundamentalism", "sectarianism", "separatism",
    "secessionism", "unionism", "reformism", "progressivism",
    // -ism religion/philosophy
    "atheism", "theism", "deism", "pantheism", "monotheism", "polytheism",
    "buddhism", "hinduism", "islamism", "judaism", "catholicism",
    "protestantism", "stoicism", "cynicism", "epicureanism",
    "skepticism", "mysticism", "asceticism", "agnosticism",
    // -ism science/medicine
    "organism", "metabolism", "mechanism", "magnetism", "symbolism",
    "metabolism", "botulism", "alcoholism", "narcissism", "nepotism",
    "plagiarism", "despotism", "heroism", "hypnotism", "criticism",
    "racism", "sexism", "ageism", "classism", "elitism", "ableism",
    "terrorism", "activism", "reformism", "tourism", "voyeurism",
    "journalism", "academicism", "eclecticism", "minimalism",
    "maximalism", "modernism", "postmodernism", "romanticism",
    "classicism", "impressionism", "expressionism", "surrealism",
    "cubism", "futurism", "dadaism", "realism", "naturalism",
    "absurdism", "nihilism", "existentialism", "stoicism",
    // -ism tech/language
    "algorithm",
    // short forms
    "prism", "schism",
    // -asm (full list)
    "clasm", "iconoclasm",
  ],

  // ── .pt — Portugal ───────────────────────────────────────────────────────────
  // Words ending in "-pt": AMAZING for crypto/tech!
  pt: [
    // -rypt (crypto gold!)
    "encrypt", "decrypt", "crypt",
    // -ript / -script
    "script", "transcript", "manuscript", "typescript", "javascript",
    "noscript", "postscript", "prescript", "subscript", "superscript",
    "conscript", "describe", "inscribe",
    // -ept
    "concept", "except", "accept", "precept", "intercept",
    "percept", "adept", "inept", "swept", "kept", "wept", "slept",
    "crept", "leapt",
    // -upt
    "disrupt", "corrupt", "erupt", "bankrupt", "abrupt", "interrupt",
    // -apt
    "adapt", "rapt", "enrapt", "inapt",
    // -ypt
    "egypt",
    // -opt
    "adopt", "opt",
    // -empt
    "exempt", "attempt", "contempt", "prompt",
    // -ipt (rare but valid)
    "crypt",
  ],

  // ── .ck — Cook Islands ────────────────────────────────────────────────────────
  // Words ending in "-ck": MASSIVE English word category!
  ck: [
    // -ack
    "back", "hack", "track", "stack", "black", "crack", "lack",
    "pack", "rack", "sack", "tack", "jack", "knack", "slack",
    "snack", "quack", "attack", "setback", "payback", "kickback",
    "feedback", "cutback", "comeback", "flashback", "callback",
    "drawback", "pullback", "rollback", "throwback", "hitback",
    "aback", "ransack", "rucksack", "almanac", "bivouac",
    // -ock
    "block", "clock", "dock", "flock", "knock", "lock", "mock",
    "rock", "sock", "shock", "smock", "stock", "unlock", "deadlock",
    "gridlock", "padlock", "shamrock", "dreadlock", "hemlock",
    "shamrock", "peacock", "woodcock", "hancock", "shamrock",
    "interlock", "overclock",
    // -ick
    "click", "trick", "stick", "quick", "brick", "thick", "slick",
    "flick", "kick", "lick", "nick", "pick", "sick", "tick", "wick",
    "chick", "prick", "quick", "trick", "uptick", "lipstick",
    "drumstick", "chapstick", "sidekick", "homesick", "lovesick",
    "airsick", "carsick", "seasick", "maverick", "limerick",
    // -eck / -eck
    "check", "deck", "neck", "peck", "wreck", "speck", "beck",
    "trek", "spec", "heck", "shipwreck",
    // -uck
    "duck", "luck", "muck", "puck", "suck", "tuck", "truck", "stuck",
    "pluck", "chuck", "cluck", "struck", "awestruck", "thunderstruck",
    "starstruck", "dumbstruck", "potluck", "woodchuck",
    // -eek / -eek (ends in "ek" which → ck? No... wait -ck)
    // hmm "geek" ends in "ek" not "ck"... let me stick to actual "-ck" endings
  ],

  // ── .ax — Åland Islands ──────────────────────────────────────────────────────
  // Words ending in "-ax": sharp, memorable domain hacks!
  ax: [
    "tax", "wax", "max", "fax", "lax", "pax",
    "relax", "climax", "anthrax", "thorax", "syntax", "surtax",
    "earwax", "parallax", "coax", "hoax", "flax",
    "ajax", "beeswax", "pretax", "overtax",
    "ifax", "ajax",
  ],

  // ── .ir — Iran ───────────────────────────────────────────────────────────────
  // Words ending in "-ir": -air / -oir family + short words
  ir: [
    // -air
    "hair", "fair", "pair", "repair", "affair", "flair", "chair",
    "lair", "heir", "stair", "unfair", "midair", "éclair", "armchair",
    "deckchair", "mohair", "corsair",
    // -ir (short)
    "stir", "sir", "fir", "whir",
    // -oir (French borrowings common in English)
    "reservoir", "boudoir", "memoir", "espoir",
    // -ir (more)
    "elixir", "tapir", "nadir", "emir", "vizier",
    // -eir / -heir
    "their", "weir",
    // -ere (ends in "ir"? No... skip)
    "souvenir",
  ],

  // ── .hm — Heard & McDonald Islands ───────────────────────────────────────────
  // Words ending in "-hm": very few but ICONIC!
  hm: [
    "rhythm", "algorithm", "logarithm", "ohm", "ohm",
    "biorhythm", "polyrhythm", "pseudonym",
  ],

  // ── .cr — Costa Rica ─────────────────────────────────────────────────────────
  // Words ending in "-cr": very few, skip
  cr: [],

  // ── .hr — Croatia ─────────────────────────────────────────────────────────────
  // Words ending in "-hr": very few English words
  hr: [],

  // ── .br — Brazil ──────────────────────────────────────────────────────────────
  // Words ending in "-br"? Very few. Skip.
  br: [],

  // ── .fr — France (supplement) ─────────────────────────────────────────────────
  // Words ending in "-fr"? Very few. Skip.

  // ── .tr — Turkey ──────────────────────────────────────────────────────────────
  // Words ending in "-tr"? Very few pure English words.
  tr: [],

  // ── .km — Comoros ─────────────────────────────────────────────────────────────
  km: [],

  // ── .gr — Greece ──────────────────────────────────────────────────────────────
  gr: [],

  // ── .pr — Puerto Rico ─────────────────────────────────────────────────────────
  pr: [],

  // ── .ms — Montserrat ──────────────────────────────────────────────────────────
  // Words ending in "-ms"? Rhymes, arms, forms, terms, firms...
  ms: [
    "arms", "farms", "forms", "terms", "firms", "worms", "storms",
    "norms", "reforms", "confirms", "performs", "transforms",
    "informs", "conforms", "platforms", "uniforms",
    "dreams", "teams", "seems", "streams", "schemes", "gleams",
    "programs", "systems", "items", "problems", "symptoms",
    "algorithms", "rhythms",
  ],

  // ── .ls — Lesotho ─────────────────────────────────────────────────────────────
  // Words ending in "-ls": thrills, skills, hills, tools, schools...
  ls: [
    "skills", "thrills", "hills", "bills", "fills", "mills", "pills",
    "wills", "drills", "grills", "chills", "spills", "fulfills",
    "tools", "schools", "pools", "fools", "rules", "fuels",
    "jewels", "pixels", "tunnels", "channels", "panels", "models",
    "labels", "details", "emails", "totals", "goals", "deals",
    "reveals", "appeals", "seals", "meals", "heals", "wheels",
    "feels", "reels", "steels", "peels", "kneels",
  ],

  // ── .ns — not standard ────────────────────────────────────────────────────────

  // ── .bs — Bahamas ─────────────────────────────────────────────────────────────
  // Words ending in "-bs": jobs, labs, clubs, grabs...
  bs: [
    "labs", "clubs", "jobs", "mobs", "grabs", "cabs", "dabs", "jabs",
    "tabs", "webs", "curbs", "herbs", "verbs", "suburbs", "pub",
    "scribs", "scribes", "vibes", "tribes", "bribes",
  ],

  // ── .cs — not standard ────────────────────────────────────────────────────────

  // ── .ds — not standard ────────────────────────────────────────────────────────

  // ── .gs — South Georgia ──────────────────────────────────────────────────────
  // Words ending in "-gs": bugs, logs, blogs, dogs, jogs...
  gs: [
    "blogs", "logs", "dogs", "jogs", "hogs", "cogs", "frogs",
    "slugs", "mugs", "bugs", "drugs", "rugs", "hugs", "jugs",
    "plugs", "tags", "bags", "flags", "rags", "nags",
    "wings", "rings", "kings", "springs", "strings", "things",
    "settings", "listings", "offerings", "readings",
  ],

  // ── .ps — Palestinian Territory ───────────────────────────────────────────────
  // Words ending in "-ps": apps, maps, caps, chips, tips, ships...
  ps: [
    "apps", "maps", "caps", "chips", "tips", "ships", "trips",
    "drips", "grips", "clips", "dips", "lips", "sips", "rips",
    "zips", "hops", "tops", "drops", "shops", "crops", "props",
    "pops", "mops", "cops", "soups", "groups", "troops", "loops",
    "whoops", "mishaps", "perhaps", "scraps", "claps", "snaps",
    "gaps", "raps", "wraps", "laptops", "backdrops", "workshops",
  ],

  // ── .ss — not standard ────────────────────────────────────────────────────────

  // ── .ts — not standard ────────────────────────────────────────────────────────

  // ── .ws — Samoa ───────────────────────────────────────────────────────────────
  // Words ending in "-ws": news, views, brews, crews, flows, shows...
  ws: [
    "news", "views", "brews", "crews", "flows", "shows", "glows",
    "grows", "blows", "throws", "knows", "rows", "bows", "sows",
    "mows", "tows", "windows", "shadows", "meadows", "rainbows",
    "elbows", "below", "reviews", "interviews", "previews",
    "overflows", "outflows", "inflows", "cashflows", "workflows",
    "airflows", "dataflows",
  ],

  // ── .ns — not a standard TLD ─────────────────────────────────────────────────

  // ── .bz — Belize (supplement) ─────────────────────────────────────────────────
  // Words ending in "-bz": very few
  bz: [],

  // ── .dz — Algeria ─────────────────────────────────────────────────────────────
  dz: [],

  // ── .tz supplement ────────────────────────────────────────────────────────────
  tz: [
    "blitz", "fritz", "glitz", "ritz", "spitz", "waltz",
    "hertz", "quartz", "kibbutz", "klutz", "pretzel",
    "schmaltz", "spritz", "schnitzel",
  ],

  // ── .nz supplement ────────────────────────────────────────────────────────────
  nz: [
    "jazz", "razz", "pizzazz", "razzmatazz", "razzle", "dazzle",
  ],

  // ── .cz supplement ────────────────────────────────────────────────────────────
  cz: [],

  // ── .pz — not a standard TLD ─────────────────────────────────────────────────

  // ── .ks — not a TLD ──────────────────────────────────────────────────────────

  // ── .links / .link gTLD ──────────────────────────────────────────────────────
  // Some gTLDs listed in PRESET_TLDS need coverage too
  link: [
    "hyperlink", "interlink", "crosslink", "backlink", "deeplink",
    "permalink", "hotlink", "brainlink",
  ],

  // ── .work gTLD ────────────────────────────────────────────────────────────────
  work: [
    "network", "framework", "teamwork", "homework", "artwork",
    "footwork", "fieldwork", "legwork", "groundwork", "overwork",
    "bodywork", "patchwork", "clockwork", "guesswork", "handiwork",
    "woodwork", "ironwork", "steelwork", "brickwork", "lacework",
    "pipework", "wirework", "firework", "needlework", "metalwork",
    "stonework", "paperwork", "casework", "coursework", "busywork",
    "coachwork", "piecework", "timework", "outwork", "rework",
  ],

  // ── .run gTLD ─────────────────────────────────────────────────────────────────
  run: [
    "overrun", "outrun", "rerun",
  ],

  // ── .one gTLD ─────────────────────────────────────────────────────────────────
  one: [
    "phone", "stone", "bone", "tone", "cone", "zone", "drone", "clone",
    "throne", "ozone", "someone", "anyone", "backbone", "milestone",
    "cornerstone", "limestone", "keystone", "moonstone", "cobblestone",
    "saxophone", "microphone", "earphone", "headphone", "megaphone",
    "smartphone", "cellphone", "trombone", "testosterone", "cyclone",
    "hormone", "silicone",
  ],

  // ── .art gTLD ─────────────────────────────────────────────────────────────────
  art: [
    "smart", "heart", "chart", "start", "apart", "cart", "dart",
    "mart", "tart", "impart", "restart", "depart", "outsmart",
    "sweetheart", "upstart", "counterpart", "rampart", "bulwark",
  ],

  // ── .ink gTLD ─────────────────────────────────────────────────────────────────
  ink: [
    "think", "drink", "blink", "brink", "clink", "rink", "sink",
    "wink", "stink", "shrink", "link", "pink", "mink", "kink",
    "rethink", "overthink", "unlink", "interlink",
  ],

  // ── .fun gTLD ─────────────────────────────────────────────────────────────────
  fun: [
    "function", "dysfunction", "malfunction",
  ],

  // ── .io supplement ────────────────────────────────────────────────────────────
  io: [
    "radio", "studio", "folio", "portfolio", "scenario", "audio",
    "video", "cameo", "stereo", "romeo", "trio", "ratio", "patio",
    "oratorio", "pistachio", "polio", "kilo", "archipelago",
  ],

  // ── .co supplement ────────────────────────────────────────────────────────────
  co: [
    "disco", "cisco", "francisco", "bronco", "tobacco", "avocado",
    "cappuccino", "fiasco", "fresco", "stucco", "calico", "calypso",
    "tomato", "volcano", "echo", "gecko", "cargo", "embargo",
    "casino", "dynamo", "piano", "ergo", "limbo", "logo", "turbo",
  ],

  // ── .de supplement ────────────────────────────────────────────────────────────
  de: [
    "arcade", "barricade", "blockade", "cascade", "charade", "crusade",
    "decade", "facade", "grenade", "lemonade", "masquerade", "parade",
    "promenade", "renegade", "serenade", "tirade", "accolade",
    "escapade", "marmalade",
  ],

  // ── .ve supplement ────────────────────────────────────────────────────────────
  ve: [
    "archive", "alive", "drive", "hive", "dive", "jive", "live",
    "strive", "thrive", "survive", "revive", "arrive", "deprive",
    "derive", "connive", "contrive",
  ],

  // ── .me supplement ────────────────────────────────────────────────────────────
  me: [
    "outcome", "income", "welcome", "overcome", "syndrome",
    "chromosome", "rhinoceros", "airdrome",
  ],

  // ── .ne supplement ────────────────────────────────────────────────────────────
  ne: [
    "benzene", "kerosene", "neoprene", "polystyrene", "gasoline",
    "adrenaline", "morphine", "dopamine", "testosterone",
    "quarantine", "discipline", "medicine", "chocolate",
    "magazine", "sardine", "antine",
  ],

  // ── .de supplement 2 ──────────────────────────────────────────────────────────
  // -cide family
  // already have pesticide, herbicide, etc. in extra10
  // -ade family (added above)

  // ── .al supplement 2 ──────────────────────────────────────────────────────────
  al: [
    "technical", "logical", "physical", "medical", "political",
    "historical", "classical", "radical", "practical", "magical",
    "comical", "ethical", "cynical", "tropical", "typical",
    "topical", "critical", "clinical", "mythical", "rhythmical",
    "optical", "digital", "capital", "orbital", "mortal",
    "martial", "partial", "spatial", "initial", "facial",
    "racial", "social", "official", "special", "crucial",
    "financial", "commercial", "judicial", "artificial",
    "beneficial", "superficial", "provincial", "confidential",
    "residential", "presidential", "differential", "referential",
    "sequential", "consequential", "existential", "preferential",
    "potential", "essential", "credential", "torrential",
    "substantial", "circumstantial", "fundamental",
    "horizontal", "vertical", "diagonal", "peripheral",
    "universal", "general", "central", "natural",
    "cultural", "structural", "neural", "rural", "plural",
    "temporal", "ancestral", "integral", "mineral", "general",
    "lateral", "bilateral", "collateral", "multilateral",
    "unilateral", "peripheral", "immortal", "portal", "digital",
  ],

  // ── .in supplement 2 ──────────────────────────────────────────────────────────
  in: [
    "bulletin", "mannequin", "gelatin", "paladin", "jasmine",
    "heroine", "cocaine", "caffeine", "codeine", "morphine",
    "dopamine", "serotonin", "melatonin", "adrenalin",
    "penicillin", "aspirin", "vitamin", "protein", "albumin",
    "keratin", "melanin", "collagen", "fibrin", "heparin",
    "alanin", "creatine", "histamine", "nicotine", "ritalin",
  ],

  // ── .is supplement ────────────────────────────────────────────────────────────
  is: [
    "analysis", "diagnosis", "synthesis", "hypothesis", "thesis",
    "basis", "crisis", "axis", "nexus", "oasis", "basis",
    "emphasis", "genesis", "nemesis", "paralysis", "catharsis",
    "praxis", "physis", "psychoanalysis", "metamorphosis",
    "photosynthesis", "homeostasis", "osteoporosis", "scoliosis",
    "cirrhosis", "thrombosis", "fibrosis", "necrosis", "sclerosis",
    "neurosis", "psychosis", "hypnosis", "prognosis",
  ],

  // ── .at supplement 2 ──────────────────────────────────────────────────────────
  at: [
    "elevat", "vibrat", "decorat", "celebrat", "illustrat",
    "demonstrat", "eliminat", "communicat", "participat",
    "congratulat", "investigat", "consolidat", "accumulate",
    "stimulate", "circulate", "speculate", "calculate", "regulate",
    "simulate", "modulate", "populate", "legislate", "translate",
    "isolate", "violate", "retaliate", "collaborate",
    "elaborate", "separate", "operate", "generate",
    "refrigerate", "accelerate", "tolerate", "moderate",
    "aggregate", "compensate", "appreciate", "evaluate",
    "navigate", "illuminate", "activate", "motivate",
    "innovate", "create", "locate", "donate", "rate",
    "update", "migrate", "integrate", "automate",
    "debate", "rotate", "deflate", "inflate", "relate",
    "state", "great", "late", "fate", "gate", "hate",
    "plate", "slate", "skate", "crate", "grate",
    "overstate", "understate", "deadweight",
  ],

  // ── .it supplement 2 ──────────────────────────────────────────────────────────
  it: [
    "summit", "submit", "permit", "commit", "profit", "transit",
    "exhibit", "prohibit", "inhibit", "deposit", "composite",
    "opposite", "requisite", "exquisite", "prerequisite",
    "counterpart", "internet", "inherit",
    "permit", "commit", "omit", "emit", "transmit",
    "admit", "quit", "spit", "slit", "grit", "writ",
    "acquit", "outwit", "counterfeit",
  ],

  // ── .ro supplement ────────────────────────────────────────────────────────────
  ro: [
    "cargo", "embargo", "fiasco", "fresco", "grotto",
    "incognito", "inferno", "maestro", "manifesto",
    "micro", "macro", "metro", "nitro", "intro", "retro",
    "pro", "gyro", "hydro", "electro",
  ],

  // ── .th supplement ────────────────────────────────────────────────────────────
  th: [
    "growth", "warmth", "warmth", "coolth", "filth", "tilth",
    "stealth", "health", "wealth", "commonwealth",
    "goliath", "hyacinth", "labyrinth", "monolith",
    "megalith", "dolmen", "zenith",
    "garth", "shibboleth",
  ],

  // ── .gy supplement 2 ──────────────────────────────────────────────────────────
  gy: [
    "gerontology", "numerology", "astrology", "acarology",
    "myrmecology", "arachnology", "helminthology",
    "phrenology", "odontology", "phonology", "graphology",
    "kinesiology", "reflexology", "iridology",
    "nanotechnology", "biotechnology", "neurotechnology",
    "geotechnology", "photovoltaics",
    "synecology", "autecology", "paleoecology",
    "tautology", "eschatology", "deontology",
    "soteriology", "eschatology", "teleology",
  ],

  // ── .er supplement 2 ──────────────────────────────────────────────────────────
  er: [
    "accelerator", "calculator", "generator", "moderator",
    "navigator", "administrator", "translator", "terminator",
    "detonator", "innovator", "incubator", "indicator",
    "commentator", "collaborator", "coordinator",
    "investigator", "facilitator", "mediator", "educator",
    "illustrator", "separator", "regulator", "simulator",
    "accumulator", "activator", "perpetrator", "perpetuator",
    "refrigerator",
    // -ner / -ter families
    "container", "entertainer", "maintainer", "attainer",
    "detainer", "trainer", "complainer", "explainer",
    "sustainer", "abstainer",
    // -pher
    "philosopher", "geographer", "photographer", "stenographer",
    "choreographer", "cinematographer", "lexicographer",
  ],

  // ── .ng supplement 2 ─────────────────────────────────────────────────────────
  ng: [
    // common -ing words not yet covered
    "advertising", "manufacturing", "engineering", "programming",
    "networking", "computing", "consulting", "accounting",
    "investing", "marketing", "selling", "buying", "trading",
    "managing", "leading", "building", "creating", "designing",
    "writing", "reading", "speaking", "listening", "thinking",
    "working", "running", "moving", "growing", "changing",
    "improving", "optimizing", "automating", "deploying",
    "monitoring", "analyzing", "researching", "discovering",
    "exploring", "adventuring", "traveling", "experiencing",
    "collaborating", "connecting", "sharing", "contributing",
    "volunteering", "donating", "fundraising", "crowdfunding",
    "bootstrapping", "outsourcing", "freelancing", "consulting",
    "mentoring", "coaching", "teaching", "tutoring", "instructing",
    "entertaining", "performing", "recording", "broadcasting",
    "streaming", "podcasting", "vlogging", "blogging",
  ],

  // ── .ar supplement 2 ──────────────────────────────────────────────────────────
  ar: [
    // More -ular
    "jocular", "popular", "regular", "secular", "stellar",
    "perpendicular", "spectacular", "particular",
    "capsular", "valvular", "globular",
    // -ilar / -obar
    "similar", "peculiar", "familiar", "unfamiliar",
    // compound
    "cookiejar", "handlebars", "crossbar",
    // -sar / -zar
    "tsar", "czar",
    // -war
    "aware", "beware",
  ],

  // ── .an supplement 2 ──────────────────────────────────────────────────────────
  an: [
    "patrician", "mathematician", "statistician", "politician",
    "beautician", "dietitian", "pediatrician", "geriatrician",
    "obstetrician", "podiatrian", "veterinarian",
    "parliamentarian", "disciplinarian", "grammarian",
    "utilitarian", "nonpartisan", "bipartisan",
    "catamaran", "trimaran", "caravan",
    "boatswain", "chaplain", "villain", "captain",
    "certain", "curtain", "fountain", "mountain", "captain",
    "britain", "porcelain", "chaplain", "britain",
    "rattan", "attan",
  ],

  // ── .id supplement 2 ──────────────────────────────────────────────────────────
  id: [
    "ovoid", "rhomboid", "trapezoid", "ellipsoid", "toroid",
    "crystalloid", "spheroid", "cuboid", "conoid",
    "sigmoid", "sigmoid", "chlorid", "fluorid",
    "invalid", "splendid", "candid", "horrid",
    "sordid", "fetid", "morbid", "turbid",
    "druid", "fluid",
  ],

  // ── .ke supplement 2 ──────────────────────────────────────────────────────────
  ke: [
    "namesake", "snowflake", "handshake", "earthquake",
    "partake", "overtake", "undertake", "forsake", "intake",
    "sunstroke", "heatstroke", "heartache",
    "mistake", "cornflake", "cupcake",
    "typeface", "keystone", "keystone",
    "alike", "unlike", "dislike", "lifelike", "godlike",
    "warlike", "businesslike", "ladylike",
  ],

  // ── .sk supplement 2 ──────────────────────────────────────────────────────────
  sk: [
    "obelisk", "asterisk", "basilisk",
    "desk", "disk", "risk", "task", "mask", "flask",
    "brisk", "whisk", "frisk", "dusk", "musk", "tusk",
    "bask", "cask", "kiosk",
  ],

  // ── .ky supplement 2 ──────────────────────────────────────────────────────────
  ky: [
    "hockey", "jockey", "monkey", "donkey", "turkey",
    "whiskey", "lackey", "stocky", "blocky", "rocky",
    "murky", "quirky", "perky", "jerky", "lurky",
    "funky", "chunky", "spunky", "junky", "clunky",
    "tricky", "sticky", "picky", "sicky",
    "lucky", "plucky", "ducky",
    "cheeky", "geeky", "freaky", "sneaky", "squeaky",
    "lanky", "cranky", "swanky", "hanky", "spanky",
  ],

  // ── .sy supplement 2 ──────────────────────────────────────────────────────────
  sy: [
    "autopsy", "biopsy", "morbsy", "topsy",
    "gypsy", "tipsy", "dipsy",
    "classy", "sassy", "brassy", "grassy", "glassy",
    "bossy", "mossy", "glossy", "flossy",
    "fussy", "mussy", "messy", "dressy",
    "daisy", "pansy", "tansy",
    "controversy", "hypocrisy", "apostasy",
    "ecstasy", "fantasy", "heresy",
    "easy", "busy", "rosy", "nosy", "cozy",
    "posy", "dozy",
  ],

  // ── .my supplement 2 ──────────────────────────────────────────────────────────
  my: [
    "autonomy", "economy", "astronomy", "gastronomy",
    "taxonomy", "agronomy", "deuteronomy",
    "anatomy", "dichotomy",
    "harmony", "ceremony", "testimony", "matrimony",
    "parsimony", "hegemony", "alimony",
    "enemy", "academy",
    "infamy", "monogamy", "polygamy",
    "pharmacy", "company", "democracy",
    "diplomacy", "supremacy",
    "alchemy", "bigamy",
  ],
};
