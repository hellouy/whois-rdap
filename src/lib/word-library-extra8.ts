/**
 * word-library-extra8.ts — High-quality domain hack word expansion
 *
 * Focus: heavily under-represented TLDs with rich English word coverage.
 * Keys are the raw TLD string (no dot). Values are words ending in that string.
 *
 * Additions: .al .re .de .sh .is .io .co .am .at .it .me .ng .la .to .ly .us .in
 */

export const WORD_LIBRARY_EXTRA8: Record<string, string[]> = {

  // ── .al — Albania ─────────────────────────────────────────────────────────
  // Hundreds of English adjectives, nouns and compound words end in "-al"
  al: [
    // tech & digital
    "viral", "digital", "signal", "logical", "optical", "virtual",
    "visual", "social", "local", "vocal", "focal", "global", "total",
    "portal", "modal", "neural", "lateral", "central", "orbital",
    "pivotal", "vectoral", "spectral", "fractional", "functional",
    "rational", "national", "personal", "seasonal", "regional",
    "operational", "educational", "professional", "institutional",
    "organizational", "computational", "informational", "constitutional",
    "recreational", "occupational", "promotional", "instructional",
    "conversational", "motivational", "transformational", "generational",
    // science & medicine
    "natural", "physical", "chemical", "medical", "clinical", "surgical",
    "dental", "herbal", "mineral", "classical", "numerical", "statistical",
    "analytical", "structural", "architectural", "procedural",
    // general
    "special", "general", "formal", "normal", "final", "actual", "typical",
    "cultural", "musical", "ethical", "official", "original", "festival",
    "editorial", "memorial", "material", "tutorial", "editorial",
    "criminal", "minimal", "optimal", "maximal", "terminal", "nominal",
    "cardinal", "diagonal", "tropical", "critical", "vertical", "radical",
    "comical", "magical", "topical", "practical", "graphical", "tactical",
    "poetical", "theatrical", "rhetorical", "canonical", "tyrannical",
    "mechanical", "technical", "historical", "political", "identical",
    "alphabetical", "mathematical", "philosophical", "psychological",
    "geographical", "grammatical", "astronomical", "biological",
    "genealogical", "meteorological", "archaeological", "chronological",
    // branding
    "universal", "liberal", "federal", "neutral", "literal", "plural",
    "casual", "ritual", "annual", "manual", "mutual", "equal", "dual",
    "rural", "moral", "oral", "coral", "floral", "choral", "plural",
  ],

  // ── .re — Réunion ─────────────────────────────────────────────────────────
  // English words ending in "-re" are extremely common
  re: [
    // verbs & abstract
    "score", "store", "core", "more", "before", "shore", "restore",
    "explore", "ignore", "adore", "deplore", "encore", "folklore",
    "snore", "bore", "lore", "wore", "tore", "swore", "gore",
    // -ture family
    "future", "nature", "culture", "structure", "texture", "mixture",
    "capture", "gesture", "venture", "feature", "creature", "treasure",
    "measure", "pressure", "pleasure", "leisure", "closure", "exposure",
    "disclosure", "enclosure", "architecture", "sculpture", "literature",
    "temperature", "signature", "manufacture", "departure", "adventure",
    "furniture", "agriculture", "infrastructure", "expenditure",
    "caricature", "overture", "curvature", "fracture", "rupture",
    "rapture", "puncture", "conjecture", "lecture", "picture",
    // -ure / -are / -ire / -ore
    "secure", "mature", "procure", "brochure", "figure", "configure",
    "compare", "prepare", "declare", "software", "hardware", "nightmare",
    "healthcare", "welfare", "beware", "spare", "share", "stare", "square",
    "scare", "aware", "flare", "glare", "aware", "declare", "prepare",
    "rare", "bare", "dare", "care", "fare", "hare", "pare", "ware",
    "fire", "hire", "wire", "tire", "inspire", "acquire", "require",
    "retire", "entire", "desire", "aspire", "admire", "expire",
    "enquire", "empire", "vampire", "bonfire",
    // compound & specific
    "therefore", "furthermore", "furthermore", "somewhere", "everywhere",
    "anywhere", "nowhere", "elsewhere", "offshore", "onshore", "semaphore",
    "sophomore", "carnivore", "herbivore", "omnivore", "commodore",
    "sycamore", "Baltimore", "singapore", "Baltimore",
  ],

  // ── .de — Germany ─────────────────────────────────────────────────────────
  // English words ending in "-de": massive list
  de: [
    // -ode / -ude / -ade family
    "code", "mode", "guide", "side", "ride", "wide", "hide", "pride",
    "slide", "blade", "shade", "trade", "made", "jade", "fade",
    "arcade", "brigade", "cascade", "decade", "invade", "parade",
    "upgrade", "blockade", "crusade", "evade", "persuade", "barricade",
    "masquerade", "lemonade", "serenade", "promenade", "escapade",
    "grenade", "accolade", "colonnade", "renegade", "tirade",
    "include", "conclude", "preclude", "exclude", "crude", "rude",
    "dude", "nude", "lewd", "shrewd", "brood", "food", "mood",
    "attitude", "gratitude", "latitude", "longitude", "magnitude",
    "altitude", "solitude", "fortitude", "aptitude", "multitude",
    "servitude", "platitude", "pulchritude", "beatitude", "lassitude",
    "vicissitude", "exactitude", "verisimilitude",
    // -ide family
    "provide", "divide", "beside", "abide", "preside", "inside",
    "outside", "worldwide", "override", "coincide", "confide", "reside",
    "subside", "decide", "suicide", "homicide", "pesticide", "herbicide",
    "fungicide", "genocide", "oxide", "peroxide", "dioxide",
    // -ude / general
    "include", "exclude", "allude", "elude", "delude", "exude",
    "intrude", "protrude", "conclude", "preclude",
    // compound -de words
    "encode", "decode", "episode", "explode", "implode", "erode",
    "commode", "abode", "corrode", "inroad",
    // -onde / -ande
    "blonde", "ronde", "fronde",
    // tech
    "upgrade", "download", "upload", "overload", "payload", "reload",
  ],

  // ── .sh — Saint Helena ────────────────────────────────────────────────────
  // English words ending in "-sh": huge category (verbs, adjectives)
  sh: [
    // -ash family
    "flash", "crash", "trash", "dash", "bash", "cash", "hash", "lash",
    "mash", "rash", "wash", "slash", "clash", "gnash", "smash", "stash",
    "splash", "rehash", "backlash", "eyelash", "whiplash",
    // -ush / -ush
    "rush", "bush", "push", "crush", "blush", "brush", "flush", "plush",
    "gush", "hush", "mush", "thrush", "ambush", "onrush",
    // -ish family
    "fish", "dish", "wish", "swish", "squish", "relish", "radish",
    "famish", "finish", "lavish", "ravish", "vanish", "banish",
    "cherish", "perish", "flourish", "nourish", "burnish",
    "demolish", "abolish", "polish", "punish", "replenish",
    "distinguish", "extinguish", "astonish", "admonish",
    "establish", "embellish", "accomplish", "diminish",
    "blemish", "varnish", "tarnish", "refurbish",
    "skirmish", "gibberish", "outlandish", "standoffish",
    // -esh / -esh
    "fresh", "flesh", "mesh", "refresh", "enmesh",
    // -osh / -osh
    "josh", "nosh", "squash", "quash", "galosh", "kibosh",
    // animal words
    "starfish", "jellyfish", "swordfish", "cuttlefish", "blowfish",
    "catfish", "clownfish", "crawfish", "crawdish",
    // misc
    "whitewash", "hogwash", "brainwash", "mouthwash",
  ],

  // ── .is — Iceland ─────────────────────────────────────────────────────────
  // Words ending in "-is": names, places, medical, Greek-root words
  is: [
    // names (perfect for personal sites)
    "alexis", "travis", "elvis", "jarvis", "norris", "morris", "harris",
    "chris", "lewis", "mavis", "davis", "elvis", "iris", "paris",
    "phyllis", "doris", "lois", "otis", "aris", "ferris",
    // Greek/Latin roots
    "basis", "crisis", "oasis", "emphasis", "analysis", "synthesis",
    "diagnosis", "prognosis", "genesis", "thesis", "axis", "nemesis",
    "symbiosis", "metamorphosis", "hypothesis", "antithesis", "parenthesis",
    "osmosis", "psychosis", "neurosis", "fibrosis", "cirrhosis",
    "scoliosis", "spondylosis", "arteriosclerosis",
    // -olis / -polis
    "metropolis", "acropolis", "heliopolisapolis", "necropolis",
    "cosmopolis", "indianapolis", "minneapolis", "annapolis",
    "thermopolis",
    // -is nouns
    "mantis", "anubis", "ibis", "epidermis", "dermis", "pelvis",
    "testis", "clavis", "pelvic",
    // misc
    "this", "his", "vis", "lis", "mis",
  ],

  // ── .io — British Indian Ocean Territory ─────────────────────────────────
  // Words ending in "-io"
  io: [
    "audio", "radio", "studio", "ratio", "patio", "folio", "portfolio",
    "scenario", "mario", "antonio", "impresario", "oratorio", "curio",
    "helio", "trio", "ohio", "regio", "pistachio",
    "presidio", "custodio", "palladio",
  ],

  // ── .co — Colombia ────────────────────────────────────────────────────────
  // Words ending in "-co"
  co: [
    "cisco", "disco", "gecko", "stucco", "tobacco", "poco",
    "taco", "rococo", "fresco", "fiasco", "alfresco", "flamenco",
    "portico", "rustico", "majolico", "antico",
  ],

  // ── .am — Armenia ─────────────────────────────────────────────────────────
  // Words ending in "-am"
  am: [
    "dream", "stream", "cream", "beam", "team", "steam", "scheme",
    "gleam", "scream", "upstream", "downstream", "mainstream",
    "program", "exam", "spam", "scam", "tram", "jam", "ham",
    "slam", "clam", "gram", "cram", "swam", "diagram",
    "webcam", "decagram", "hologram", "ideogram", "cryptogram",
    "anagram", "epigram", "monogram", "kilogram", "milligram",
    "centigram", "microgram", "spectrogram", "cardiogram",
    "mammogram", "sonogram", "histogram",
    "instagram", "telegram", "panoram",
  ],

  // ── .at — Austria ─────────────────────────────────────────────────────────
  // Words ending in "-at"
  at: [
    "chat", "flat", "that", "cat", "bat", "hat", "mat", "pat", "rat",
    "sat", "vat", "brat", "drat", "splat", "combat", "acrobat",
    "format", "caveat", "wombat", "muskrat", "democrat",
    "aristocrat", "bureaucrat", "technocrat", "autocrat", "plutocrat",
    "diplomat", "habitat", "thermostat", "photostat", "haemostat",
    "doormat", "muscat", "wildcat", "tomcat", "copycat", "thundercat",
    "bobcat", "meerkat", "ziggurat",
  ],

  // ── .it — Italy ───────────────────────────────────────────────────────────
  // Words ending in "-it"
  it: [
    "visit", "unit", "edit", "submit", "commit", "permit", "omit",
    "admit", "transmit", "emit", "remit", "audit", "profit", "benefit",
    "credit", "debit", "exhibit", "prohibit", "inhabit", "debut",
    "recruit", "circuit", "explicit", "implicit", "requisite", "exquisite",
    "transit", "spirit", "merit", "limit", "grit", "knit", "spit",
    "bit", "fit", "hit", "kit", "lit", "pit", "sit", "wit",
    "split", "slit", "quit", "kit", "bit", "wit", "nit",
    "summit", "vomit", "hermit", "gambit", "habit", "rabbit",
    "bandit", "pundit", "tidbit", "toolkit", "chatbot",
  ],

  // ── .me — Montenegro ──────────────────────────────────────────────────────
  // Words ending in "-me"
  me: [
    // -ame family
    "game", "name", "fame", "same", "frame", "blame", "flame", "shame",
    "tame", "claim", "exclaim", "acclaim", "reclaim", "disclaim",
    "proclaim", "nickname", "overcome", "welcome", "outcome", "income",
    "became", "inflame", "became", "rename",
    // -ome family
    "home", "some", "come", "dome", "tome", "gnome", "chrome", "syndrome",
    "awesome", "handsome", "wholesome", "welcome", "outcome", "overcome",
    "gruesome", "fearsome", "loathsome", "quarrelsome", "cumbersome",
    "troublesome", "winsome", "tiresome", "meddlesome",
    // -ime / -eme
    "time", "crime", "prime", "rhyme", "lime", "mime", "slime",
    "sublime", "lifetime", "bedtime", "overtime", "pastime", "daytime",
    "theme", "scheme", "extreme", "supreme", "regime",
    // -ame/-ume
    "perfume", "costume", "resume", "consume", "assume", "presume",
    "volume", "outcome",
  ],

  // ── .ng — Nigeria ─────────────────────────────────────────────────────────
  // Words ending in "-ng"
  ng: [
    // -ing
    "coding", "hosting", "streaming", "learning", "designing", "building",
    "shipping", "trading", "working", "marketing", "networking",
    "publishing", "searching", "shopping", "booking", "tracking",
    "funding", "launching", "growing", "scaling", "storing",
    // regular -ng
    "strong", "long", "song", "ring", "sing", "king", "thing", "spring",
    "bring", "swing", "string", "belong", "along", "among", "prolong",
  ],

  // ── .la — Laos ────────────────────────────────────────────────────────────
  // Words ending in "-la"
  la: [
    "koala", "gorilla", "vanilla", "umbrella", "impala", "ayala",
    "manila", "villa", "bella", "stella", "ella", "nella", "hella",
    "favela", "tortilla", "guerrilla", "flotilla", "flotilla",
    "barracuda", "candela", "formula", "spatula", "regula",
    "nebula", "tabula", "fibula", "stipula", "capsule",
    "ola", "gala", "gala", "scala", "fala", "tala",
    "cola", "bola", "mola", "canola", "payola", "viola",
    "gondola", "angola", "pergola", "areola", "aureola",
  ],

  // ── .to — Tonga ───────────────────────────────────────────────────────────
  // Words ending in "-to"
  to: [
    "photo", "auto", "alto", "grotto", "lotto", "motto", "otto",
    "risotto", "ghetto", "canto", "manifesto", "pesto", "presto",
    "gusto", "justo", "fisto", "pronto", "conto", "bento",
    "memento", "momento", "momento", "incognito", "banqueto",
    "vibrato", "staccato", "portamento", "espresso",
    "potato", "tomato", "avocado", "tornado", "torpedo",
    "studio", "libretto", "falsetto", "stiletto",
  ],

  // ── .ly — Libya ───────────────────────────────────────────────────────────
  // Supplement with more adverbs and -ly words
  ly: [
    // tech / startup adverbs
    "smartly", "securely", "quickly", "swiftly", "boldly", "cleanly",
    "clearly", "closely", "coldly", "creatively", "critically",
    "culturally", "curiously", "darkly", "directly", "distinctly",
    "eagerly", "early", "easily", "efficiently", "electronically",
    "emotionally", "emphatically", "endlessly", "entirely",
    "equally", "especially", "essentially", "evenly", "expertly",
    "explicitly", "extremely", "fairly", "faithfully", "famously",
    "firmly", "flexibly", "fluidly", "formally", "frankly",
    "freely", "fully", "genuinely", "globally", "gracefully",
    "gratefully", "greatly", "happily", "honestly", "ideally",
    "immediately", "independently", "individually", "informally",
    "innovatively", "intentionally", "jointly", "justly",
    "kindly", "legally", "locally", "logically", "loyally",
    "mindfully", "notably", "officially", "openly", "optimally",
    "organically", "partially", "peacefully", "powerfully",
    "precisely", "productively", "progressively", "promptly",
    "proportionally", "protectively", "quickly", "radically",
    "rapidly", "reasonably", "reliably", "responsibly", "safely",
    "securely", "sensitively", "sharply", "skillfully", "smoothly",
    "socially", "solidly", "specifically", "strategically",
    "strongly", "successfully", "sustainably", "systematically",
    "tactfully", "technically", "thoughtfully", "transparently",
    "ultimately", "uniformly", "uniquely", "universally",
    "urgently", "usefully", "vigorously", "visually", "voluntarily",
    "warmly", "wisely", "worthily",
  ],

  // ── .us — United States ───────────────────────────────────────────────────
  // Words ending in "-us"
  us: [
    // Latin plurals
    "campus", "status", "focus", "bonus", "nexus", "virus", "forum",
    "cactus", "radius", "circus", "fungus", "genus", "census",
    "callus", "calculus", "stimulus", "syllabus", "terminus",
    "lapsus", "hiatus", "apparatus", "stratus", "prospectus",
    "consensus", "exitus", "nexus", "opus", "corpus",
    // compound
    "blunderbuss", "rhombus", "omnibus", "nimbus", "limbus",
    "trampus", "platypus", "octopus", "exodus", "kudos",
    "animus", "animus", "campus", "impetus", "mucus", "nexus",
    "nexus", "ruckus", "fetus", "detritus", "hiatus",
    // personal
    "rufus", "julius", "marcus", "brutus", "remus", "romulus",
    "linus", "cactus", "darius", "kyus",
  ],

  // ── .in — India ───────────────────────────────────────────────────────────
  // Supplement with more "-in" words
  in: [
    // tech verbs / nouns
    "signin", "checkin", "plugin", "builtin", "buildin",
    "workin", "feedin", "leadin", "speedin",
    // profession / -cian endings
    "comedian", "guardian", "custodian", "musician", "politician",
    "mathematician", "pediatrician", "academician", "rhetorician",
    "statistician", "clinician", "dietitian", "obstetrician",
    "pediatrician", "geriatrician",
    // compound
    "toxin", "trypsin", "melanin", "albumin", "actin", "globulin",
    "myelin", "keratin", "chitin", "fibrin", "collagen", "heparin",
    "melatonin", "dopamine", "serotonin", "endorphin",
    "paladin", "adin", "din", "inn",
  ],

  // ── .gg — Guernsey / Gaming ───────────────────────────────────────────────
  // Words ending in "-gg" (rare; add gaming-adjacent names)
  gg: [
    "egg", "legg", "sugg", "digg", "hogg", "flagg", "gregg",
    "trigg", "bugg", "ogg", "magg", "bragg",
  ],

  // ── .nu — Niue ────────────────────────────────────────────────────────────
  // Words ending in "-nu": very few natural English words
  nu: [
    "menu", "gnu",
    "cornu", "pornu", "vernu",
  ],

  // ── .so — Somalia ─────────────────────────────────────────────────────────
  // Words ending in "-so"
  so: [
    "also", "verso", "torso", "lasso", "basso", "espresso", "picasso",
    "virtuoso", "maestoso", "furioso", "moroso", "grosso",
    "risotto", "concerto",
  ],

  // ── .im — Isle of Man ─────────────────────────────────────────────────────
  // Words ending in "-im"
  im: [
    "slim", "trim", "swim", "him", "dim", "rim", "vim", "whim",
    "skim", "brim", "grim", "prim", "shim",
    "claim", "acclaim", "disclaim", "exclaim", "proclaim", "reclaim",
    "aim", "maim", "interim", "pilgrim", "synonym", "acronym",
    "maximum", "minimum", "premium", "medium", "sodium", "calcium",
    "magnesium", "potassium", "aluminium", "titanium", "helium",
    "lithium", "uranium", "plutonium", "caesium",
  ],

  // ── .rs — Serbia ──────────────────────────────────────────────────────────
  // Words ending in "-rs"
  rs: [
    "cars", "stars", "bars", "jars", "mars", "scars", "wars", "gears",
    "beers", "tears", "fears", "peers", "years", "layers", "players",
    "makers", "users", "servers", "builders", "founders", "partners",
    "creators", "investors", "operators", "contributors", "developers",
    "entrepreneurs", "volunteers", "followers", "subscribers",
    "customers", "consumers", "employers", "managers", "officers",
  ],

  // ── .er — Eritrea ─────────────────────────────────────────────────────────
  // Words ending in "-er"
  er: [
    "maker", "builder", "founder", "leader", "teacher", "player",
    "master", "manager", "partner", "designer", "developer", "engineer",
    "controller", "provider", "publisher", "subscriber", "consumer",
    "employer", "follower", "supporter", "investor", "operator",
    "blogger", "streamer", "creator", "explorer", "advisor",
    "accelerator", "aggregator", "authenticator", "calculator",
    "configurator", "coordinator", "cultivator", "curator",
    "dominator", "educator", "elevator", "facilitator", "generator",
    "incubator", "innovator", "integrator", "moderator", "navigator",
    "optimizer", "orchestrator", "regulator", "simulator", "transformer",
    "validator", "visualizer",
    // common words
    "power", "water", "paper", "order", "offer", "cover", "letter",
    "center", "summer", "winter", "border", "render", "discover",
    "remember", "consider", "deliver", "register", "transfer",
    "computer", "filter", "cluster", "thunder", "wonder", "blunder",
  ],

  // ── .ge — Georgia ─────────────────────────────────────────────────────────
  // Words ending in "-ge"
  ge: [
    "page", "stage", "image", "age", "cage", "rage", "sage", "wage",
    "manage", "engage", "language", "message", "package", "coverage",
    "storage", "leverage", "passage", "percentage", "encourage",
    "average", "village", "vintage", "advantage", "knowledge",
    "challenge", "exchange", "acknowledge", "intelligence",
    "privilege", "courage", "beverage", "heritage", "mortgage",
    "shortage", "dosage", "luggage", "garbage", "damage",
    "sabotage", "espionage", "camouflage", "homage", "mirage",
    "barrage", "fuselage", "assemblage", "arbitrage",
  ],

  // ── .ve — Venezuela ───────────────────────────────────────────────────────
  // Words ending in "-ve"
  ve: [
    "love", "live", "give", "drive", "move", "prove", "save", "have",
    "solve", "evolve", "involve", "resolve", "revolve", "dissolve",
    "groove", "improve", "remove", "approve", "archive",
    "creative", "massive", "passive", "active", "native", "relative",
    "positive", "negative", "sensitive", "collective", "objective",
    "perspective", "innovative", "alternative", "comprehensive",
    "aggressive", "excessive", "progressive", "impressive",
    "expressive", "possessive", "obsessive", "successive",
    "effective", "attractive", "productive", "constructive",
    "destructive", "protective", "reflective", "selective",
    "detective", "directive", "defensive", "offensive", "extensive",
    "intensive", "executive", "incentive", "initiative",
    "collaborative", "communicative", "comparative", "conservative",
    "cooperative", "decorative", "demonstrative", "figurative",
    "imaginative", "informative", "innovative", "interpretive",
    "legislative", "narrative", "normative", "persuasive",
    "preventive", "qualitative", "quantitative", "representative",
    "speculative", "supportive",
  ],

  // ── .se — Sweden ──────────────────────────────────────────────────────────
  // Words ending in "-se"
  se: [
    "base", "case", "phrase", "chase", "phase", "erase", "embrace",
    "database", "showcase", "staircase", "briefcase", "suitcase",
    "uppercase", "lowercase", "purchase", "release", "increase",
    "decrease", "disease", "please", "lease", "tease", "cheese",
    "freeze", "breeze", "sneeze", "squeeze", "grease",
    "house", "mouse", "blouse", "grouse", "browse", "goose", "moose",
    "loose", "noose", "choose", "close", "dose", "nose", "pose",
    "compose", "disclose", "dispose", "expose", "impose", "propose",
    "suppose", "transpose", "decompose",
    "because", "excuse", "refuse", "abuse", "cause", "clause",
    "fuse", "muse", "amuse", "confuse", "diffuse", "misuse", "accuse",
  ],

  // ── .pe — Peru ────────────────────────────────────────────────────────────
  // Words ending in "-pe"
  pe: [
    "type", "hope", "scope", "rope", "cope", "pope", "mope",
    "slope", "trope", "envelope", "telescope", "microscope",
    "horoscope", "periscope", "stethoscope", "kaleidoscope",
    "stereotype", "archetype", "prototype", "phenotype", "genotype",
    "shape", "tape", "cape", "grape", "drape", "escape", "landscape",
    "scrape", "reshape",
    "hype", "pipe", "ripe", "wipe", "swipe", "snipe",
    "stripe", "overripe",
  ],

};
