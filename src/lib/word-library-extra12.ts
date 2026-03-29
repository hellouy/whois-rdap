/**
 * word-library-extra12.ts — Further expansion: more TLD patterns + gTLD coverage
 *
 * Targets: .lt .lv .ee .hr .hu .ro .sk .mk supplement, and gTLD: .shop .store .tech .app
 * Also adds: .ws .ps .ls .bs .gs .ms plus massive -nt/-nd/-rm/-lm patterns
 */

export const WORD_LIBRARY_EXTRA12: Record<string, string[]> = {

  // ── .nt — not a TLD; skip ──────────────────────────────────────────────────────

  // ── .lt — Lithuania ───────────────────────────────────────────────────────────
  // Words ending in "-lt": adult, result, fault, salt...
  lt: [
    "adult", "result", "fault", "salt", "malt", "halt", "exalt",
    "vault", "cobalt", "asphalt", "basalt", "catapult", "tumult",
    "occult", "insult", "consult", "exult", "default", "assault",
    "somersault", "difficult", "built", "quilt", "guilt", "spilt",
    "jilt", "hilt", "tilt", "wilt", "melt", "felt", "belt",
    "dealt", "knelt", "dwelt", "svelte",
  ],

  // ── .lu (supplement) ──────────────────────────────────────────────────────────
  lu: [
    "flu", "blue", "glue", "clue", "true", "value", "venue", "issue",
    "tissue", "residue", "continue", "revenue", "avenue", "statue",
    "virtue", "rescue", "argue", "queue",
  ],

  // ── .hu supplement ────────────────────────────────────────────────────────────
  hu: [
    "tofu", "haiku", "wahoo", "voodoo", "taboo",
    "igloo", "tattoo", "shampoo", "bamboo", "yahoo",
  ],

  // ── .hr supplement ────────────────────────────────────────────────────────────
  // Words ending in "-hr"? Nearly none in English. Skip.

  // ── .mk supplement ────────────────────────────────────────────────────────────
  mk: [],

  // ── .sk supplement 3 ──────────────────────────────────────────────────────────
  sk: [
    "desk", "risk", "disk", "task", "mask", "flask",
    "brisk", "whisk", "frisk", "dusk", "musk", "tusk",
    "bask", "cask", "ask", "kiosk", "obelisk", "asterisk",
  ],

  // ── .nk — not a standard TLD ──────────────────────────────────────────────────

  // ── .rk — not a standard TLD ──────────────────────────────────────────────────

  // ── .lk supplement ────────────────────────────────────────────────────────────
  lk: [
    "silk", "milk", "bilk", "hulk", "sulk", "bulk", "skulk",
    "folk", "yolk", "stalk", "chalk", "walk", "talk", "balk",
    "caulk", "squawk",
  ],

  // ── .tech gTLD supplement ─────────────────────────────────────────────────────
  tech: [
    "edtech", "fintech", "biotech", "medtech", "govtech", "adtech",
    "cleantech", "deeptech", "proptech", "regtech", "insurtech",
    "agritech", "legaltech", "hrtech", "martech", "healthtech",
    "foodtech", "femtech", "climatetch", "spacetech",
  ],

  // ── .app gTLD supplement ──────────────────────────────────────────────────────
  app: [
    "webapp", "dapp", "zapp", "snap", "map", "trap", "wrap",
    "clap", "flap", "strap", "mishap", "recap", "unwrap",
  ],

  // ── .dev gTLD supplement ──────────────────────────────────────────────────────
  dev: [
    "webdev", "fulldev", "gamedev", "appdev",
  ],

  // ── .shop gTLD supplement ─────────────────────────────────────────────────────
  shop: [
    "workshop", "barbershop", "bookshop", "coffeeshop",
    "woodshop", "pawnshop", "sweatshop", "toyshop",
  ],

  // ── .store gTLD supplement ────────────────────────────────────────────────────
  store: [
    "restore", "appstore", "bookstore", "drugstore", "datastore",
    "keystore", "datastore",
  ],

  // ── .blog gTLD supplement ─────────────────────────────────────────────────────
  blog: [
    "microblog", "photoblog", "videoblog", "audioblog", "vlog",
  ],

  // ── .live gTLD supplement ─────────────────────────────────────────────────────
  live: [
    "outlive", "relive", "golive",
  ],

  // ── .media gTLD supplement ────────────────────────────────────────────────────
  media: [
    "social media", "multimedia", "new media",
  ],

  // ── .news supplement ──────────────────────────────────────────────────────────
  news: [
    "breaknews", "keynews",
  ],

  // ── .space supplement ─────────────────────────────────────────────────────────
  space: [
    "workspace", "airspace", "cyberspace", "namespace", "headspace",
    "innerspace", "outerspace", "hyperspace", "dataspace",
  ],

  // ── .site supplement ─────────────────────────────────────────────────────────
  site: [
    "website", "campsite", "offsite", "onsite",
  ],

  // ── .cloud supplement ─────────────────────────────────────────────────────────
  cloud: [
    "icloud", "raincloud", "stormcloud", "thundercloud",
  ],

  // ── .digital supplement ───────────────────────────────────────────────────────
  digital: [
    "superdigital",
  ],

  // ── .network supplement ───────────────────────────────────────────────────────
  network: [
    "subnetwork", "supernetwork",
  ],

  // ── .online supplement ────────────────────────────────────────────────────────
  online: [
    "inline", "baseline", "mainline", "streamline",
  ],

  // ── .studio supplement ────────────────────────────────────────────────────────
  studio: [
    "homestudio",
  ],

  // ── .world supplement ─────────────────────────────────────────────────────────
  world: [
    "netherworld", "underworld", "dreamworld",
  ],

  // ── .today supplement ─────────────────────────────────────────────────────────
  today: [],

  // ── .zone supplement ──────────────────────────────────────────────────────────
  zone: [
    "dropzone", "warzone", "ozone", "rezone", "safezone",
    "frostzone", "hotzone", "timezone",
  ],

  // ── .land supplement ──────────────────────────────────────────────────────────
  land: [
    "homeland", "highland", "mainland", "lowland", "upland",
    "flatland", "wetland", "grassland", "farmland", "wasteland",
    "wonderland", "disneyland", "neverland", "cloud-land",
    "marshland", "woodland", "borderland",
  ],

  // ── .city supplement ──────────────────────────────────────────────────────────
  city: [
    "intercity", "supercity", "megacity", "smart-city", "motorcity",
  ],

  // ── .team supplement ──────────────────────────────────────────────────────────
  team: [
    "upstream", "downstream", "mainstream", "bloodstream", "slipstream",
    "livestream", "midstream", "mainstream",
  ],

  // ── .club supplement ──────────────────────────────────────────────────────────
  club: [
    "nightclub",
  ],

  // ── .pro supplement ───────────────────────────────────────────────────────────
  pro: [
    "macro", "micro", "intro", "retro", "nitro", "gyro", "euro",
    "hydro", "electro", "metro", "bistro", "maestro", "allegro",
    "Castro", "necro", "astro", "gastro", "ferro", "ferro",
  ],

  // ── .lab supplement ───────────────────────────────────────────────────────────
  lab: [
    "fab", "cab", "tab", "slab", "crab", "drab", "grab",
    "stab", "jab", "nab", "scab",
  ],

  // ── .pub supplement ───────────────────────────────────────────────────────────
  pub: [
    "sub", "tub", "hub", "rub", "cub", "dub", "grub", "shrub",
    "club", "stub", "scrub", "snub",
  ],

  // ── .farm supplement ──────────────────────────────────────────────────────────
  farm: [
    "windarm", "sunfarm", "datafarm", "treefarm",
  ],

  // ── .camp supplement ──────────────────────────────────────────────────────────
  camp: [
    "bootcamp", "daycamp", "basecamp",
  ],

  // ── .care supplement ──────────────────────────────────────────────────────────
  care: [
    "healthcare", "skincare", "haircare", "childcare", "daycare",
    "eyecare", "medicare", "selfcare", "eldercare", "aftercare",
  ],

  // ── .fit supplement ───────────────────────────────────────────────────────────
  fit: [
    "outfit", "retrofit", "misfit", "overfit",
  ],

  // ── .run supplement ───────────────────────────────────────────────────────────
  run: [
    "overrun", "outrun", "rerun", "forerun",
  ],

  // ── .sm supplement ────────────────────────────────────────────────────────────
  sm: [
    "jingoism", "jingoism", "tokenism", "ageism", "classism",
    "lookism", "nativism", "activism", "pacifism",
    "progressivism", "conservatism", "traditionalism",
    "multiculturalism", "universalism", "cosmopolitanism",
    "communitarianism", "voluntarism", "determinism",
    "indeterminism", "compatibilism", "dualism", "monism",
    "pluralism", "relativism", "absolutism", "positivism",
    "constructivism", "deconstruction",
    "poststructuralism", "phenomenalism", "functionalism",
    "structuralism",
    // -asm
    "enthusiasm", "protoplasm", "sarcasm", "orgasm", "spasm",
    "phantasm", "miasm",
  ],

  // ── .ht supplement ────────────────────────────────────────────────────────────
  ht: [
    // compound -light family
    "backlight", "floodlight", "moonlight", "sunlight", "starlight",
    "daylight", "flashlight", "headlight", "streetlight",
    "spotlight", "candlelight", "firelight", "torchlight",
    "nightlight", "twilight", "limelight", "footlight", "highlight",
    // compound -right
    "birthright", "copyright", "outright", "downright", "forthright",
    "upright", "alright", "airtight", "watertight", "uptight",
    // compound -ight
    "plight", "slight", "blight", "knight",
    // -ight with prefix
    "fortnight", "overnight", "delight", "tonight", "insight",
    "foresight", "oversight", "hindsight",
    // -weight families
    "lightweight", "heavyweight", "featherweight", "middleweight",
    "flyweight", "welterweight", "bantamweight",
    // -thought family
    "thought", "rethought", "afterthought", "overthought",
    "forethought",
    // -ought family
    "fought", "bought", "sought", "ought", "brought", "naught",
    "distraught", "overwrought",
    // -aught
    "caught", "taught", "nought",
    // playwright types
    "playwright",
  ],

  // ── .pt supplement ────────────────────────────────────────────────────────────
  pt: [
    "encrypt", "decrypt", "crypt", "script", "transcript",
    "manuscript", "typescript", "postscript", "subscript",
    "superscript", "conscript", "prescript",
    "concept", "except", "accept", "precept", "intercept", "percept",
    "adept", "inept",
    "swept", "kept", "wept", "slept", "crept", "leapt",
    "disrupt", "corrupt", "erupt", "bankrupt", "abrupt", "interrupt",
    "adapt", "rapt",
    "adopt", "opt",
    "exempt", "attempt", "contempt", "prompt",
    "egypt",
  ],

  // ── .ck supplement ────────────────────────────────────────────────────────────
  ck: [
    // -ack
    "back", "hack", "track", "stack", "black", "crack", "lack",
    "pack", "rack", "sack", "tack", "jack", "knack", "slack",
    "snack", "quack", "attack", "setback", "payback", "kickback",
    "feedback", "cutback", "comeback", "flashback", "callback",
    "drawback", "pullback", "rollback", "throwback", "ransack",
    "rucksack", "paperback", "horseback", "hardback", "softback",
    "aback", "hijack", "knapsack",
    // -ock
    "block", "clock", "dock", "flock", "knock", "lock", "mock",
    "rock", "sock", "shock", "stock", "unlock", "deadlock",
    "gridlock", "padlock", "dreadlock", "peacock", "woodcock",
    "interlock", "overclock", "shamrock", "hemlock",
    // -ick
    "click", "trick", "stick", "quick", "brick", "thick", "slick",
    "flick", "kick", "lick", "nick", "pick", "sick", "tick", "wick",
    "chick", "uptick", "lipstick", "drumstick", "chapstick",
    "sidekick", "homesick", "lovesick", "airsick", "carsick",
    "seasick", "maverick", "limerick",
    // -eck
    "check", "deck", "neck", "peck", "wreck", "speck", "heck",
    "shipwreck", "paycheck", "redneck", "bottleneck",
    // -uck
    "duck", "luck", "muck", "puck", "suck", "tuck", "truck", "stuck",
    "pluck", "chuck", "struck", "awestruck", "thunderstruck",
    "starstruck", "dumbstruck", "potluck", "woodchuck",
    // -ack gTLD
    "counterattack", "piggyback",
  ],

  // ── .ax supplement ────────────────────────────────────────────────────────────
  ax: [
    "tax", "wax", "max", "fax", "lax", "pax", "flax",
    "relax", "climax", "anthrax", "thorax", "syntax", "surtax",
    "earwax", "parallax", "coax", "hoax", "beeswax", "pretax",
    "overtax", "ajax", "borax", "styrax", "styrax", "corax",
    "vertax",
  ],

  // ── .ir supplement ────────────────────────────────────────────────────────────
  ir: [
    "hair", "fair", "pair", "repair", "affair", "flair", "chair",
    "lair", "heir", "stair", "unfair", "midair", "armchair",
    "corsair", "mohair", "eclair", "deckchair",
    "stir", "sir", "fir", "whir",
    "reservoir", "boudoir", "memoir",
    "elixir", "tapir", "nadir", "emir", "vizier", "souvenir",
    "their", "weir", "air",
  ],

  // ── .hm supplement ────────────────────────────────────────────────────────────
  hm: [
    "rhythm", "algorithm", "logarithm", "biorhythm", "polyrhythm",
    "ohm",
  ],

  // ── .ng supplement 3 ──────────────────────────────────────────────────────────
  ng: [
    "understanding", "outstanding", "surrounding", "corresponding",
    "underlying", "overarching", "overwhelming", "forthcoming",
    "incoming", "outgoing", "ongoing", "lifelong", "lifelong",
    "headlong", "headstrong", "prolific",
  ],

  // ── .al supplement 3 ──────────────────────────────────────────────────────────
  al: [
    "universal", "general", "central", "natural", "plural",
    "cultural", "structural", "temporal", "neural", "rural",
    "lateral", "bilateral", "multilateral", "peripheral",
    "horizontal", "vertical", "diagonal",
    "orbital", "mortal", "immortal", "martial", "partial",
    "spatial", "initial", "facial", "racial",
    "financial", "commercial", "official", "special",
    "crucial", "judicial", "artificial", "beneficial",
    "superficial", "confidential", "residential",
    "presidential", "fundamental", "environmental",
    "governmental", "experimental", "developmental",
    "digital", "portal", "hospital", "capital",
    "festival", "carnival", "survival", "arrival",
    "proposal", "disposal", "refusal", "approval",
    "removal", "renewal", "rehearsal", "reversal",
    "withdrawal", "betrayal", "portrayal", "denial",
    "burial", "tutorial", "editorial", "memorial",
    "managerial", "territorial", "ceremonial",
    "testimonial", "antibacterial", "adversarial",
    "immaterial", "ministerial", "custodial",
    "remedial", "primordial", "memorial",
  ],

  // ── .ly supplement 2 ──────────────────────────────────────────────────────────
  ly: [
    "suddenly", "recently", "quickly", "quietly", "slowly", "clearly",
    "deeply", "widely", "highly", "largely", "mostly", "nearly",
    "simply", "solely", "barely", "fairly", "rarely", "barely",
    "merely", "purely", "freely", "openly", "boldly", "coldly",
    "firmly", "gently", "surely", "calmly", "warmly", "broadly",
    "strongly", "actively", "rapidly", "loudly", "briefly",
    "jointly", "locally", "safely", "neatly", "cleanly", "closely",
    "mainly", "newly", "partly", "fully", "daily", "early",
    "likely", "lively", "lovely", "orderly", "friendly",
    "ghostly", "earthly", "costly", "deadly", "godly", "lonely",
    "ugly", "oily", "ably", "equally", "strangely", "largely",
    "commonly", "heavily", "greatly",
  ],

  // ── .er supplement 3 ──────────────────────────────────────────────────────────
  er: [
    // -er profession words
    "blogger", "vlogger", "streamer", "podcaster", "influencer",
    "creator", "founder", "developer", "designer", "programmer",
    "engineer", "manager", "leader", "teacher", "speaker",
    "researcher", "scientist", "marketer", "investor",
    "entrepreneur", "consultant",
    // -er tool/thing words
    "browser", "scanner", "converter", "compiler", "debugger",
    "tracker", "monitor", "server", "router", "filter", "loader",
    "parser", "renderer", "scheduler", "dispatcher", "handler",
    "controller", "processor", "encoder", "decoder", "adapter",
    "wrapper", "helper", "builder", "runner", "tester",
  ],

  // ── .rs supplement 2 ──────────────────────────────────────────────────────────
  rs: [
    "developers", "engineers", "designers", "managers", "leaders",
    "teachers", "researchers", "bloggers", "streamers", "creators",
    "founders", "investors", "entrepreneurs", "users", "members",
    "visitors", "customers", "subscribers", "followers", "partners",
    "contributors", "volunteers", "advisors", "mentors",
  ],

  // ── .us supplement 2 ──────────────────────────────────────────────────────────
  us: [
    "calculus", "stimulus", "cumulus", "cirrus", "nimbus",
    "radius", "medium", "podium", "stadium", "aquarius",
    "aries", "taurus", "geminus", "virgo", "libras",
    "scopius", "sagittarius", "capricornus", "pisces",
    "thesaurus", "dinosaurus", "hydrangeas",
  ],

  // ── .it supplement 3 ──────────────────────────────────────────────────────────
  it: [
    "definit", "definite", "infinite", "finite", "opposite",
    "composite", "exquisite", "requisite", "prerequisite",
    "ignite", "reunite", "unite", "recite", "incite", "excite",
    "delight", "polite", "invite", "site", "bite", "kite",
    "mite", "quite", "spite", "white", "write", "ignite",
    "satellite", "dynamite", "parasite", "appetite",
    "termite", "granite", "favorite", "fluorite", "graphite",
  ],

  // ── .in supplement 3 ──────────────────────────────────────────────────────────
  in: [
    "discipline", "medicine", "gasoline", "nicotine", "caffeine",
    "dopamine", "serotonin", "melatonin", "adrenalin",
    "penicillin", "vitamin", "protein", "collagen", "insulin",
    "aspirin", "morphine", "heroin", "cocaine",
    "captain", "certain", "curtain", "fountain", "mountain",
    "bulletin", "mannequin", "gelatin", "paladin", "jasmine",
    "origin", "margin", "cabin", "goblin",
    "penguin", "dolphin", "pumpkin", "muffin", "napkin",
    "robin", "basin", "raisin", "cousin",
  ],

  // ── .am supplement 2 ──────────────────────────────────────────────────────────
  am: [
    "program", "diagram", "telegram", "histogram", "anagram",
    "hologram", "monogram", "ideogram", "pictogram",
    "parallelogram", "pentagram", "hexagram",
    "kilogram", "milligram", "microgram", "nanogram",
    "acronym", "pseudonym", "antonym", "synonym",
    "homonym", "patronym", "heteronym", "toponym",
    "tram", "slam", "clam", "pram", "cram", "sham",
    "exam", "imam", "madam", "adam",
  ],

  // ── .at supplement 3 ──────────────────────────────────────────────────────────
  at: [
    "candidate", "affiliate", "deliberate", "moderate", "accurate",
    "approximate", "adequate", "adequate", "celebrate",
    "collaborate", "consolidate", "coordinate", "cultivate",
    "dominate", "educate", "elaborate", "eliminate",
    "emulate", "facilitate", "generate", "graduate", "illustrate",
    "innovate", "integrate", "investigate", "liberate",
    "mediate", "motivate", "navigate", "obligate", "originate",
    "participate", "penetrate", "populate", "precipitate",
    "propagate", "stimulate", "terminate", "translate", "validate",
    "duplicate", "advocate", "designate", "dominate", "fascinate",
    "indicate", "motivate", "nominate", "saturate", "separate",
  ],

  // ── .se supplement 2 ──────────────────────────────────────────────────────────
  se: [
    "response", "impulse", "repulse", "convulse", "compulse",
    "propulse", "impasse", "morass", "crevasse", "terrace",
    "grimace", "palace", "surface", "interface", "workplace",
    "birthplace", "marketplace", "fireplace", "commonplace",
    "showcase", "briefcase", "suitcase", "pillowcase", "staircase",
    "database", "knowledge-base",
  ],

  // ── .co supplement 2 ──────────────────────────────────────────────────────────
  co: [
    "hippo", "hippo", "gecko", "volcano", "tobacco",
    "avocado", "cappuccino", "fiasco", "fresco", "stucco",
    "calico", "calypso", "cargo", "embargo", "casino",
    "dynamo", "piano", "echo", "ergo", "limbo", "logo", "turbo",
    "disco", "cisco", "francisco", "bronco",
  ],

  // ── .io supplement 2 ──────────────────────────────────────────────────────────
  io: [
    "radio", "studio", "folio", "portfolio", "scenario", "audio",
    "video", "cameo", "stereo", "trio", "ratio", "patio",
    "oratorio", "pistachio", "romeo",
  ],

  // ── .sh supplement 2 ──────────────────────────────────────────────────────────
  sh: [
    "splash", "crash", "rash", "hash", "mash", "bash",
    "trash", "flash", "smash", "clash", "gnash", "lash",
    "fresh", "flesh", "mesh", "mesh",
    "brainwash", "mouthwash", "hogwash",
    "eyelash", "backlash", "whiplash",
    "burnish", "tarnish", "varnish", "furnish", "nourish",
    "diminish", "vanquish", "languish", "anguish",
    "distinguish", "extinguish", "relinquish",
    "astonish", "demolish", "polish", "relish",
    "nourish", "flourish", "cherish", "perish",
    "publish", "lavish", "ravish",
    "blemish", "banish", "punish", "replenish",
  ],

  // ── .ge supplement 2 ──────────────────────────────────────────────────────────
  ge: [
    // More -age words
    "stage", "page", "cage", "rage", "sage", "wage",
    "courage", "marriage", "language", "passage", "package",
    "message", "village", "manage", "average", "beverage",
    "coverage", "heritage", "leverage", "mileage", "mortgage",
    "outrage", "pilgrimage", "privilege", "salvage", "shortage",
    "storage", "tonnage", "usage", "vintage", "voyage", "wreckage",
    "image", "college", "knowledge", "advantage", "disadvantage",
    "percentage", "homage", "courage", "encourage", "discourage",
    // -idge words
    "bridge", "ridge", "fridge", "abbridge", "porridge",
    "Cambridge", "knowledge",
    // -udge words
    "grudge", "judge", "nudge", "smudge", "trudge", "budge",
    // -odge words
    "dodge", "lodge", "dislodge",
    // -edge words
    "edge", "ledge", "pledge", "hedge", "wedge", "wedge",
    "knowledge", "acknowledge",
    // -uge words
    "huge", "refuge", "centrifuge", "subterfuge",
    // -oge (rare)
    "vogue",
  ],

  // ── .re supplement 2 ──────────────────────────────────────────────────────────
  re: [
    // More -ore words
    "explore", "ignore", "restore", "implore", "deplore",
    "adore", "bore", "core", "fore", "gore", "more", "pore",
    "score", "shore", "snore", "sore", "store", "swore", "tore",
    "wore", "Baltimore", "carnivore", "herbivore", "omnivore",
    "sophomore", "commodore", "sycamore", "furthermore",
    "evermore", "nevermore",
    // More -ure words
    "ure", "cure", "pure", "sure", "lure", "mature", "nature",
    "future", "figure", "picture", "feature", "culture",
    "structure", "capture", "fracture", "rupture", "vulture",
    "adventure", "departure", "exposure", "failure", "measure",
    "pleasure", "pressure", "procedure", "signature", "temperature",
    // -ire words
    "fire", "hire", "lire", "mire", "sire", "tire", "wire",
    "desire", "empire", "expire", "inspire", "require",
    "sapphire", "vampire", "wildfire", "campfire", "crossfire",
    "gunfire", "hellfire", "ceasefire",
  ],

  // ── .ve supplement 2 ──────────────────────────────────────────────────────────
  ve: [
    "achieve", "believe", "conceive", "deceive", "perceive",
    "receive", "retrieve", "relieve", "reprieve",
    "groove", "move", "prove", "improve", "remove", "approve",
    "disapprove", "disprove",
    "dive", "drive", "hive", "jive", "live", "strive",
    "thrive", "survive", "revive", "arrive", "deprive",
    "derive", "connive", "contrive",
    "brave", "cave", "crave", "gave", "grave", "have",
    "knave", "nave", "pave", "rave", "save", "shave", "slave",
    "wave", "behave", "concave", "deprave", "engrave",
    "archive", "captive", "active", "native", "creative",
    "narrative", "perspective", "objective", "collective",
    "effective", "reflective", "selective", "detective",
    "directive", "connective", "corrective", "respective",
  ],

  // ── .me supplement 2 ──────────────────────────────────────────────────────────
  me: [
    "extreme", "supreme", "scheme", "theme", "dream", "team",
    "stream", "cream", "beam", "seam", "steam", "gleam",
    "mainstream", "upstream", "downstream", "bloodstream",
    "daydream", "nightmare", "bedtime",
  ],

  // ── .ne supplement 2 ──────────────────────────────────────────────────────────
  ne: [
    "spine", "shine", "shrine", "twine", "vine", "wine", "dine",
    "divine", "combine", "confine", "define", "decline", "recline",
    "incline", "resign", "assign", "design", "malign", "benign",
    "align", "refine", "undermine", "underline", "discipline",
    "sunshine", "moonshine", "summertime",
    "alone", "phone", "stone", "bone", "tone", "cone", "zone",
    "drone", "clone", "throne", "ozone", "someone", "anyone",
    "backbone", "milestone", "cornerstone", "limestone",
  ],

  // ── .pe supplement 2 ──────────────────────────────────────────────────────────
  pe: [
    // -ope words
    "hope", "cope", "dope", "mope", "pope", "rope", "slope",
    "grope", "elope", "trope", "scope", "envelope", "telescope",
    "microscope", "periscope", "horoscope", "kaleidoscope",
    "antelope", "stethoscope",
    // -ape words
    "tape", "cape", "gape", "grape", "drape", "shape", "scrape",
    "escape", "landscape", "cityscape", "seascape", "cloudscape",
    // -ipe words
    "pipe", "ripe", "wipe", "swipe", "snipe", "gripe", "stripe",
    "overripe",
    // -ype words
    "type", "hype",
    // -upe words
    "dupe", "upe",
  ],

  // ── .is supplement 2 ──────────────────────────────────────────────────────────
  is: [
    "analysis", "thesis", "basis", "crisis", "axis", "oasis",
    "emphasis", "genesis", "nemesis", "paralysis", "catharsis",
    "diagnosis", "synthesis", "hypothesis", "praxis",
    "psychoanalysis", "metamorphosis", "photosynthesis",
    "homeostasis", "osteoporosis", "arteriosclerosis",
    "fibrosis", "necrosis", "sclerosis", "neurosis", "psychosis",
    "hypnosis", "prognosis", "diagnosis",
    "metropolis", "acropolis", "necropolis",
    "elvis", "paris", "travis", "artis", "alexis",
  ],

  // ── .de supplement 3 ──────────────────────────────────────────────────────────
  de: [
    // -ade words
    "arcade", "barricade", "blockade", "cascade", "charade",
    "crusade", "decade", "facade", "grenade", "lemonade",
    "masquerade", "parade", "promenade", "renegade", "serenade",
    "tirade", "accolade", "escapade", "marmalade",
    // -ode words
    "mode", "code", "node", "abode", "explode", "erode",
    "corrode", "episode",
    // -ide words
    "beside", "abide", "confide", "reside", "subside",
    "coincide", "suicide", "homicide", "pesticide", "herbicide",
    "fungicide", "genocide", "inside", "outside", "worldwide",
    "override",
    // -ude words
    "include", "exclude", "conclude", "preclude", "allude",
    "elude", "seclude", "intrude", "extrude", "protrude",
    "attitude", "aptitude", "latitude", "longitude", "magnitude",
    "altitude", "gratitude", "solitude", "fortitude", "plenitude",
    "multitude", "amplitude", "exactitude",
    // -ade extra
    "made", "grade", "trade", "blade", "spade", "shade", "jade",
    "fade", "wade", "brigade", "brocade", "upgrade", "downgrade",
    "handmade", "homemade", "ready-made",
  ],

};
