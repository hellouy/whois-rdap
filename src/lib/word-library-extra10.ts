/**
 * word-library-extra10.ts — Ultra-expansion for long-tail TLDs
 *
 * Targets: new gTLDs (.net .app .dev .link .one .live .site .space .club .today .world),
 * remaining ccTLDs (.tz .kz .mz .zw .zm .zn .nz .hu .cz .lv .bg .mk .ee .lk .la .mn .af .ao),
 * and supplemental boosts for .ly .us .in .am .at .it .io .co .sh .re .de .al .ve .se .ge .pe .er
 */

export const WORD_LIBRARY_EXTRA10: Record<string, string[]> = {

  // ── .net — Network ──────────────────────────────────────────────────────────
  // Words ending in "-net"
  net: [
    "planet", "internet", "bonnet", "sonnet", "coronet", "bayonet",
    "cornet", "garnet", "hornet", "ethernet", "clarinet", "cabinet",
    "magnet", "interplanet",
  ],

  // ── .tz — Tanzania ──────────────────────────────────────────────────────────
  // Words ending in "-tz" (German/Yiddish loanwords)
  tz: [
    "blitz", "fritz", "glitz", "ritz", "spitz", "waltz", "hertz",
    "quartz", "schutz", "schmaltz",
  ],

  // ── .kz — Kazakhstan ─────────────────────────────────────────────────────────
  // Words ending in "-kz": very few; mostly proper names / abbreviations
  kz: [],

  // ── .mz — Mozambique ─────────────────────────────────────────────────────────
  mz: [],

  // ── .zw — Zimbabwe ───────────────────────────────────────────────────────────
  zw: [],

  // ── .zm — Zambia ─────────────────────────────────────────────────────────────
  zm: [],

  // ── .nz — New Zealand ─────────────────────────────────────────────────────────
  // Words ending in "-nz": jazz, razz, pizzazz…
  nz: [
    "jazz", "pizzazz", "pizzazz", "razzmatazz",
  ],

  // ── .hu — Hungary ────────────────────────────────────────────────────────────
  // Words ending in "-hu": tofu, tifu…
  hu: [
    "tofu", "haiku", "pirouhu",
  ],

  // ── .cz — Czech Republic ─────────────────────────────────────────────────────
  cz: [],

  // ── .lv — Latvia ─────────────────────────────────────────────────────────────
  // Words ending in "-lv": solve, revolve…
  lv: [
    "solve", "evolve", "revolve", "involve", "resolve", "absolve",
    "dissolve", "devolve", "twelve",
  ],

  // ── .bg — Bulgaria ───────────────────────────────────────────────────────────
  bg: [],

  // ── .mk — North Macedonia ─────────────────────────────────────────────────────
  mk: [],

  // ── .ee — Estonia ────────────────────────────────────────────────────────────
  // Words ending in "-ee": many common English words!
  ee: [
    "free", "tree", "three", "agree", "degree", "guarantee",
    "employee", "refugee", "committee", "trustee", "trainee",
    "devotee", "escapee", "nominee", "honoree", "inductee",
    "absentee", "detainee", "attendee", "appointee", "interviewee",
    "licensee", "payee", "retiree", "transferee",
    "coffee", "toffee",
    "bee", "fee", "glee", "lee", "pee", "see", "tee", "wee",
    "flee", "knee", "spree",
  ],

  // ── .lk — Sri Lanka ──────────────────────────────────────────────────────────
  // Words ending in "-lk"
  lk: [
    "silk", "milk", "bilk", "ilk", "hulk", "sulk", "bulk", "skulk",
    "folk", "yolk", "stalk", "chalk", "walk", "talk", "balk",
    "squawk",
  ],

  // ── .mn — Mongolia ───────────────────────────────────────────────────────────
  // Words ending in "-mn": column, autumn…
  mn: [
    "autumn", "column", "solemn", "condemn", "hymn",
  ],

  // ── .af — Afghanistan ────────────────────────────────────────────────────────
  // Words ending in "-af"
  af: [
    "leaf", "loaf", "deaf", "behalf", "staff", "half", "calf",
    "graph", "draft",
  ],

  // ── .ao — Angola ─────────────────────────────────────────────────────────────
  // Words ending in "-ao"
  ao: [
    "tao", "mao", "cacao", "ciao",
  ],

  // ── .lao — not a TLD ─────────────────────────────────────────────────────────

  // ── .la — Laos (supplement) ──────────────────────────────────────────────────
  // Already in extra8, add more "-la" words
  la: [
    "cola", "mola", "payola", "viola", "gondola", "angola", "pergola",
    "areola", "aureola", "corolla", "canola", "barola",
    "nebula", "regula", "formula", "spatula", "fibula",
    "tarantula", "campanula", "sabella", "rotunda",
  ],

  // ── .ro — Romania (supplement) ───────────────────────────────────────────────
  // Words ending in "-ro"
  ro: [
    "hero", "zero", "micro", "macro", "intro", "metro", "retro",
    "gyro", "hydro", "nitro", "electro", "bistro", "Castro",
    "bureau", "plateau",
    "euro", "bro", "pro",
    "maestro", "allegro",
  ],

  // ── .bo — Bolivia ────────────────────────────────────────────────────────────
  // Words ending in "-bo"
  bo: [
    "turbo", "combo", "ambo", "limbo", "bimbo", "jumbo", "jambo",
    "gazebo", "placebo", "vibrato", "samba",
    "mambo", "voodoo", "judo",
  ],

  // ── .do — Dominican Republic ──────────────────────────────────────────────────
  // Words ending in "-do"
  do: [
    "avocado", "tornado", "torpedo", "Colorado", "aficionado",
    "desperado", "bravado", "bastinado", "innuendo",
    "libido", "studio", "pseudo",
    "judo", "judo", "aikido",
    "undo", "amado",
  ],

  // ── .fo — Faroe Islands ───────────────────────────────────────────────────────
  // Words ending in "-fo"
  fo: [
    "info", "tofu",
  ],

  // ── .mo — Macau ──────────────────────────────────────────────────────────────
  // Words ending in "-mo"
  mo: [
    "demo", "memo", "primo", "ultimo", "dynamo", "volcano", "casino",
    "camouflage", "bromo", "cosmo", "ammo", "combo",
    "promo",
  ],

  // ── .to (supplement) ─────────────────────────────────────────────────────────
  // Words ending in "-to"
  to: [
    "photo", "auto", "alto", "grotto", "lotto", "motto", "risotto",
    "ghetto", "manifesto", "pesto", "presto", "gusto", "pronto",
    "bento", "memento", "incognito", "vibrato", "staccato",
    "portamento", "potato", "tomato", "torpedo", "libretto",
    "falsetto", "stiletto", "concerto", "allegretto",
    "fortissimo",
  ],

  // ── .go — not a TLD ───────────────────────────────────────────────────────────

  // ── .no — Norway (supplement) ─────────────────────────────────────────────────
  // Words ending in "-no"
  no: [
    "casino", "volcano", "piano", "soprano", "dynamo", "rhino",
    "techno", "latino", "marino",
    "amino", "albino", "bambino", "cappuccino", "concertino",
    "espino", "merino", "neutrino", "domino", "inferno",
    "piano", "Monaco",
  ],

  // ── .io (supplement) ──────────────────────────────────────────────────────────
  // More words ending in "-io"
  io: [
    "presidio", "custodio", "palladio", "camino", "figaro",
    "bravissimo",
  ],

  // ── .oo — not a TLD ───────────────────────────────────────────────────────────

  // ── .eo — not a standard TLD ──────────────────────────────────────────────────

  // ── .de (supplement) ──────────────────────────────────────────────────────────
  // Additional "-de" words
  de: [
    "beside", "abide", "preside", "confide", "reside", "subside",
    "coincide", "suicide", "homicide", "pesticide", "herbicide",
    "fungicide", "genocide", "oxide", "peroxide", "dioxide",
    "encode", "decode", "episode", "explode", "implode", "erode",
    "corrode", "abode",
    "inroad", "reload", "overload", "payload", "download", "upload",
    "unload", "offload", "workload",
    "inside", "outside", "worldwide", "override",
    "homemade", "handmade", "manmade", "readymade",
  ],

  // ── .re (supplement) ──────────────────────────────────────────────────────────
  re: [
    "declare", "prepare", "compare", "beware", "healthcare",
    "software", "hardware", "shareware", "freeware", "middleware",
    "ware", "snare", "stare",
    "require", "desire", "inspire", "acquire", "entire", "admire",
    "expire", "aspire", "retire", "vampires",
    "furthermore", "evermore", "Baltimore", "carnivore", "herbivore",
    "omnivore", "sophomores", "commodore", "sycamore",
  ],

  // ── .sh (supplement) ──────────────────────────────────────────────────────────
  sh: [
    "vanquish", "distinguish", "extinguish", "relinquish",
    "astonish", "demolish", "polish", "relish",
    "splash", "crash", "rash", "hash", "mash",
    "fresh", "flesh", "enmesh",
    "publish", "furnish", "burnish", "tarnish", "varnish",
    "lavish", "ravish",
    "brainwash", "mouthwash", "hogwash",
  ],

  // ── .ve (supplement) ─────────────────────────────────────────────────────────
  ve: [
    "naive", "suave", "brave", "crave", "grave", "save", "cave",
    "rave", "wave", "gave", "shave", "slave", "stave", "knave",
    "concave", "behave", "engrave", "deprave",
    "sleeve", "weave", "heave", "leave", "cleave", "achieve",
    "believe", "conceive", "deceive", "perceive", "receive",
    "reprieve", "retrieve", "relieve",
    "connective", "detective", "directive", "reflective",
    "selective", "collective",
  ],

  // ── .ge (supplement) ──────────────────────────────────────────────────────────
  ge: [
    "age", "cage", "rage", "sage", "wage", "page",
    "huge", "fudge", "judge", "nudge", "smudge", "trudge",
    "budge", "dodge", "lodge", "wedge", "hedge", "edge", "pledge",
    "dredge", "sledge", "ledge", "knowledge", "privilege",
    "acknowledge", "cartilage", "appendage",
    "cabbage", "garbage", "damage", "bandage", "bondage",
    "blockage", "drainage", "footage", "shortage", "dotage",
    "hostage", "postage", "roughage", "sewage", "slippage",
    "stoppage", "wastage", "cleavage",
  ],

  // ── .se (supplement) ──────────────────────────────────────────────────────────
  se: [
    "goose", "moose", "loose", "noose", "choose",
    "bruise", "cruise", "abuse", "amuse", "confuse", "diffuse",
    "misuse", "refuse", "accuse", "cause", "clause",
    "concise", "precise", "suffice", "sacrifice",
    "enterprise", "merchandise", "exercise", "otherwise",
    "paradise", "recognize", "organize", "summarize",
    "advertise", "comprise", "emphasize", "memorize",
  ],

  // ── .pe (supplement) ──────────────────────────────────────────────────────────
  pe: [
    "spectrotype", "genotype", "phenotype",
    "pipe", "ripe", "wipe", "swipe", "snipe", "gripe",
    "hype", "type", "overripe",
    "elope", "grope", "trope", "antelope",
    "stethoscope", "kaleidoscope", "horoscope",
  ],

  // ── .al (supplement) ──────────────────────────────────────────────────────────
  al: [
    "intentional", "conventional", "exceptional", "fundamental",
    "environmental", "governmental", "departmental", "incremental",
    "experimental", "monumental", "ceremonial", "colonial",
    "editorial", "testimonial", "managerial", "territorial",
    "industrial", "electoral", "pastoral",
    "sensational", "rational", "fictional", "directional",
    "additional", "conditional", "traditional", "emotional",
    "optional", "national", "personal", "seasonal",
    "global", "local", "focal", "vocal", "total", "vital",
    "naval", "moral", "coral", "floral", "choral",
    "arrival", "survival", "festival", "carnival",
    "retrieval", "approval", "removal", "renewal",
    "reversal", "rehearsal", "disposal", "proposal",
    "refusal", "arousal", "carousal",
    "digital", "capital", "hospital", "portal",
    "visual", "casual", "sensual", "sexual", "virtual",
    "spiritual", "intellectual", "conceptual", "contextual",
    "eventual", "individual",
  ],

  // ── .me (supplement) ──────────────────────────────────────────────────────────
  me: [
    "handsome", "wholesome", "lonesome", "awesome", "fearsome",
    "tiresome", "irksome", "loathsome", "quarrelsome", "cumbersome",
    "troublesome", "winsome", "meddlesome", "gruesome", "toothsome",
    "nettlesome", "burdensome", "worrisome",
    "overcome", "succumb",
    "anime", "genome", "chromosome", "rhinoceros",
    "nickname", "surname", "firstname",
    "programme", "regime", "meme",
    "resume", "presume", "consume", "assume",
  ],

  // ── .in (supplement) ─────────────────────────────────────────────────────────
  in: [
    "begin", "cabin", "origin", "margin", "protein",
    "heroin", "raisin", "poison", "oxygenin",
    "penguin", "dolphin", "pumpkin", "muffin", "napkin",
    "robin", "cabin", "goblin", "merlin",
    "basin", "raisin", "cousin", "resin",
    "adrenalin", "insulin", "aspirin", "penicillin",
    "acetylsalicylin", "melatonin", "serotonin", "endorphin",
    "melanin", "albumin", "keratin", "globulin",
  ],

  // ── .am (supplement) ─────────────────────="────────────────────────────────────
  am: [
    "salam", "imam", "tram", "slam", "clam", "swam",
    "petroleum", "aquarium", "millennium", "auditorium",
    "compendium", "consortium", "emporium", "gymnasium",
    "planetarium", "solarium", "vivarium",
    "memoriam", "mayhem",
  ],

  // ── .at (supplement) ──────────────────────────────────────────────────────────
  at: [
    "diplomat", "technocrat", "bureaucrat", "autocrat",
    "plutocrat", "democrat", "aristocrat",
    "format", "combat", "acrobat", "habitat", "thermostat",
    "doormat", "muscat", "wildcat", "tomcat", "copycat",
    "bobcat", "meerkat", "thundercat", "thundercat",
    "tipcap", "raincoat", "overcoat", "lifeboat", "tugboat",
    "rowboat", "speedboat", "sailboat",
    "throat", "float", "coat", "goat", "boat", "moat",
  ],

  // ── .it (supplement) ──────────────────────────────────────────────────────────
  it: [
    "banquet", "bouquet", "ballet", "buffet", "budget",
    "circuit", "permit", "omit", "emit", "remit", "transmit",
    "legit", "tidbit", "toolkit", "armpit", "sunlit", "moonlit",
    "starlit", "unlit", "flicklit",
    "verdict", "predict", "restrict", "conflict", "district",
    "instinct", "extinct", "distinct", "succinct",
    "unit", "audit", "visit", "credit", "debit",
    "spirit", "merit", "limit", "vomit", "hermit", "gambit",
    "habit", "rabbit", "bandit", "pundit",
  ],

  // ── .us (supplement) ──────────────────────────────────────────────────────────
  us: [
    "octopus", "platypus", "omnibus", "nimbus", "limbus",
    "cactus", "status", "nexus", "census", "impetus",
    "detritus", "hiatus", "apparatus", "prospectus",
    "conspectus", "nexus", "mucus", "fetus",
    "syllabus", "stimulus", "terminus",
    "minus", "bonus", "sinus", "tonus", "anus",
    "ruckus", "fuss", "pus", "thus", "bus", "plus",
    "campus", "focus", "chorus",
    "Marcus", "Rufus", "Julius", "Brutus",
  ],

  // ── .ly (supplement) ──────────────────────────────────────────────────────────
  ly: [
    "analytically", "systematically", "diplomatically",
    "enthusiastically", "charismatically",
    "parametrically", "algorithmically", "cryptographically",
    "bureaucratically", "democratically", "aristocratically",
    "automatically", "programmatically", "mechanically",
    "electronically", "scientifically", "academically",
    "philosophically", "psychologically", "sociologically",
    "chronologically", "etymologically", "geographically",
    "photographically", "demographically",
    "ally", "rally", "valley", "alley", "galley", "belly",
    "jelly", "smelly", "telly", "bully", "fully", "gully",
    "holly", "molly", "dolly", "golly", "jolly", "folly",
    "trolley", "volley", "truly", "duly", "newly",
    "early", "yearly", "nearly", "clearly", "dearly", "really",
  ],

  // ── .rs (supplement) ──────────────────────────────────────────────────────────
  rs: [
    "hours", "tours", "yours", "ours", "floors", "doors", "doors",
    "outdoors", "indoors", "stores", "shores", "cores", "scores",
    "explores", "restores", "deplores", "ignores",
    "networks", "frameworks", "benchmarks", "trademarks",
    "bookmarks", "checkmarks", "hallmarks",
    "hackers", "coders", "makers", "founders",
    "readers", "writers", "leaders", "sellers", "buyers",
    "learners", "teachers", "helpers", "starters",
    "winners", "runners", "climbers", "swimmers", "fighters",
    "dreamers", "thinkers", "builders", "creators",
  ],

  // ── .er (supplement) ──────────────────────────────────────────────────────────
  er: [
    // tech roles
    "hacker", "coder", "blogger", "streamer", "gamer", "miner",
    "trainer", "mentor", "adviser", "reviewer", "designer",
    "commenter", "subscriber", "publisher", "advertiser",
    "collaborator", "contributor", "administrator",
    // -cter / -ster / -ster
    "monster", "lobster", "gangster", "hipster", "trickster",
    "prankster", "roadster", "speedster", "youngster", "oldster",
    // -nder / -nder
    "founder", "blunder", "wonder", "thunder", "plunder", "wander",
    "meander", "surrender", "gender", "render", "vendor",
    "lender", "tender", "fender", "sender", "spender",
    "defender", "offender", "pretender", "contender",
    "calendar", "cylinder", "lavender",
    // -rder / -rder
    "order", "border", "murder", "recorder", "disorder",
    // -nter / -nter
    "center", "enter", "winter", "printer", "counter", "hunter",
    "hunter", "painter", "pointer", "planter", "encounter",
    // -cter
    "doctor", "sector", "vector", "factor",
    // -ther
    "father", "mother", "brother", "rather", "whether", "weather",
    "feather", "leather", "together", "altogether",
    // other
    "fiber", "cyber", "super", "hyper",
    "amber", "ember", "timber", "chamber", "member",
    "number", "cucumber", "remember",
  ],

  // ── .ne (supplement) ──────────────────────────────────────────────────────────
  ne: [
    "alone", "milestone", "cornerstone", "limestone", "keystone",
    "moonstone", "sandstone", "cobblestone", "cobblestone",
    "backbone", "jawbone", "trombone", "saxophone",
    "phone", "microphone", "earphone", "headphone",
    "megaphone", "gramophone", "saxophone",
    "define", "confine", "refine", "decline", "recline",
    "incline", "combine", "shine", "wine", "vine", "mine",
    "pine", "line", "fine", "nine", "dine",
    "routine", "engine", "machine", "marine",
    "vaccine", "caffeine", "nicotine",
  ],

  // ── .ry — not a TLD ───────────────────────────────────────────────────────────

  // ── .ty — not a TLD ───────────────────────────────────────────────────────────

  // ── .py — Pitcairn? ─────────────────────────────────────────────────────────
  // .py is in ccTLDs list (Paraguay)
  py: [
    "happy", "choppy", "sloppy", "preppy", "yappy", "zippy",
    "hippy", "dippy", "nippy", "tippy", "crispy", "wispy",
    "wispy", "bitty",
  ],

  // ── .ry — not standard ────────────────────────────────────────────────────────

  // ── .ey — not standard ────────────────────────────────────────────────────────

  // ── .gy supplement (see extra9) ───────────────────────────────────────────────

  // ── .oy — not a TLD ───────────────────────────────────────────────────────────

  // ── .uy — Uruguay ─────────────────────────────────────────────────────────────
  uy: [
    "buy", "guy", "fly", "sky", "dry", "try", "cry", "fry", "pry",
    "spy", "shy", "sly",
  ],

  // ── .eu — European Union ─────────────────────────────────────────────────────
  // Words ending in "-eu": not many in English; supplement
  eu: [
    "queue", "milieu", "tableau", "plateau", "chateau",
    "bureau", "adieu",
  ],

  // ── .mu — Mauritius ──────────────────────────────────────────────────────────
  // Words ending in "-mu"
  mu: [
    "emu", "timu", "camus",
  ],

  // ── .ru — Russia (supplement) ─────────────────────────────────────────────────
  // Words ending in "-ru"
  ru: [
    "guru", "menu", "bureau", "haiku",
    "buguru", "kakeru",
  ],

  // ── .su — Soviet Union ────────────────────────────────────────────────────────
  su: [
    "bonus", "tonus", "nexus", "plexus", "flexus", "arcus", "hiatus",
    "thesaurus", "dinosaurus", "apparatus",
  ],

  // ── .lu — Luxembourg ─────────────────────────────────────────────────────────
  lu: [
    "flu", "blu", "tableau", "modulu",
  ],

  // ── .nu (supplement) ─────────────────────────────────────────────────────────
  nu: [
    "menu", "gnu", "venue", "avenue",
  ],

  // ── .by — Belarus ─────────────────────────────────────────────────────────────
  by: [
    "lullaby", "standby", "whereby", "hereby", "thereby",
    "nearby", "flyby",
  ],

  // ── .cy — Cyprus ─────────────────────────────────────────────────────────────
  cy: [
    "democracy", "diplomacy", "accuracy", "adequacy", "advocacy",
    "bureaucracy", "conspiracy", "aristocracy", "autocracy",
    "supremacy", "pharmacy", "legacy", "infancy", "agency",
    "urgency", "currency", "efficiency", "proficiency", "presidency",
    "emergency", "frequency", "dependency", "transparency",
    "redundancy", "occupancy", "vacancy", "literacy",
    "celibacy", "piracy", "privacy", "infancy", "fluency",
    "proficiency",
  ],

  // ── .dy — not a TLD ───────────────────────────────────────────────────────────

  // ── .ny — not a standard ccTLD ───────────────────────────────────────────────

  // ── .fy — not a TLD ───────────────────────────────────────────────────────────

  // ── .gy already covered in extra9 ────────────────────────────────────────────

  // ── .hy — not a TLD ───────────────────────────────────────────────────────────

  // ── .zy — not a TLD ───────────────────────────────────────────────────────────

  // ── .ok — not a TLD ───────────────────────────────────────────────────────────

  // ── .uk — United Kingdom (supplement) ────────────────────────────────────────
  uk: [
    "luck", "duck", "truck", "stuck", "pluck", "cluck", "chuck",
    "fluck", "muck", "puck", "yuck", "tuck", "buck", "fuck",
    "amuck", "awestruck", "dumbstruck", "starstruck",
    "thunderstruck", "panic-struck",
  ],

  // ── .sk (supplement) ──────────────────────────────────────────────────────────
  sk: [
    "dusk", "husk", "musk", "tusk", "cask", "ask",
    "flask", "mask", "task", "desk", "risk", "disk",
    "whisk", "frisk", "brisk", "asterisk", "obelisk",
    "kiosk", "basilisk", "tamarisk",
  ],

  // ── .id (supplement) ──────────────────────────────────────────────────────────
  id: [
    "android", "tabloid", "steroid", "asteroid", "paranoid",
    "humanoid", "cuboid", "typhoid", "crystalloid",
    "invalid", "splendid", "candid", "orchid",
    "pyramid", "druid", "squid", "liquid",
    "morbid", "turbid", "rancid", "fetid", "putrid",
    "forbid", "eyelid",
    "madrid", "david",
  ],

  // ── .th (supplement) ──────────────────────────────────────────────────────────
  th: [
    "mammoth", "sabbath", "behemoth", "leviathan",
    "zenith", "monolith", "megalith", "neolith",
    "goliath", "hyacinth", "labyrinth",
    "warmth", "warmth",
  ],

  // ── .il (supplement) ──────────────────────────────────────────────────────────
  il: [
    "domicile", "crocodile", "infantile", "gentile",
    "exile", "compile", "defile", "profile", "revile",
    "hostile", "missile", "docile", "futile", "sterile",
    "agile", "mobile", "fertile", "volatile",
    "council", "pencil", "tendril", "stencil",
    "fossil", "nostril", "April", "Brazil", "daffodil",
    "email", "until", "evil", "civil", "vigil",
    "peril", "pupil", "anvil", "utensil",
  ],

  // ── .ar (supplement) ──────────────────────────────────────────────────────────
  ar: [
    "handlebars", "crossbars",
    "avatar", "webinar", "toolbar", "sidebar",
    "caviar", "jaguar", "bazaar",
    "guitar", "radar", "sonar", "cedar",
    "peculiar", "familiar", "angular", "cellular",
    "spectacular", "rectangular", "perpendicular",
    "muscular", "vascular", "ocular", "secular",
    "circular", "tubular", "granular", "modular",
    "popular", "regular", "similar",
    "stellar", "cellar", "collar", "pillar", "scholar", "dollar",
    "mortar", "nectar", "altar",
  ],

  // ── .an (supplement) ──────────────────────────────────────────────────────────
  an: [
    "artisan", "partisan", "caravan", "veteran", "pelican",
    "republican", "Olympian", "Victorian", "Shakespearean",
    "suburban", "urban",
    "Himalayan", "Mediterranean", "proletarian",
    "octogenarian", "septuagenarian",
    "egalitarian", "unitarian", "libertarian",
    "Mediterranean", "reptilian",
    "plan", "clan", "span", "ban", "scan", "fan",
    "Japan", "Sudan", "Milan", "Jordan", "Korean",
  ],

  // ── .ke (supplement) ──────────────────────────────────────────────────────────
  ke: [
    "namesake", "snowflake", "handshake", "earthquake",
    "partake", "overtake", "undertake", "forsake",
    "outbreak", "intake", "bespoke", "choke",
    "provoke", "invoke", "evoke", "revoke",
    "antique", "unique", "mystique", "technique",
    "boutique", "critique", "physique",
    "unlike", "dislike", "hitchhike",
    "turnpike",
  ],

  // ── .et (supplement) ──────────────────────────────────────────────────────────
  et: [
    "booklet", "droplet", "piglet", "outlet", "inlet", "eyelet",
    "hamlet", "tablet", "bullet", "wallet", "mallet", "goblet",
    "scarlet", "starlet", "amulet", "pamphlet", "leaflet",
    "platelet", "rivulet",
    "velvet", "helmet", "comet", "poet", "budget", "target",
    "gadget", "widget", "midget",
    "buffet", "bouquet", "ricochet", "cassette", "gazette",
    "roulette", "etiquette", "marionette", "pirouette",
  ],

  // ── .gy (supplement) ──────────────────────────────────────────────────────────
  gy: [
    "immunology", "microbiology", "nanotechnology", "biotechnology",
    "gerontology", "physiotherapy",
    "egyptology", "numerology", "astrology", "pharmacology",
    "cosmetology", "anthropology", "criminology",
    "bibliography", "choreography", "cinematography",
    "cryptography", "demography", "ethnography", "typography",
    "videography", "photography", "lexicography",
    "autobiography", "historiography",
  ],

  // ── .my (supplement) ──────────────────────────────────────────────────────────
  my: [
    "hegemony", "parsimony", "matrimony", "patrimony",
    "alimony", "acrimony", "sanctimony",
    "gastronomy", "autonomy",
    "alchemy",
  ],

  // ── .sy (supplement) ──────────────────────────────────────────────────────────
  sy: [
    "controversy", "idiosyncrasy",
    "apostasy", "ecstasy", "fantasy",
    "heresy", "hypocrisy",
    "embassy", "pharmacy", "tapestry",
  ],

  // ── .cy (supplement) see above ───────────────────────────────────────────────

};
