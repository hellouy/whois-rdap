/**
 * word-library-extra9.ts — Massive expansion for ZERO-coverage TLDs
 *
 * Targets: .et .ke .ar .an .th .id .sk .ky .ph .gy .my .sy .ag .ug .ad .bi .gi .ni .li .fi
 * Every key is the raw TLD (no dot). Values are words ending with that string.
 */

export const WORD_LIBRARY_EXTRA9: Record<string, string[]> = {

  // ── .et — Ethiopia ──────────────────────────────────────────────────────────
  // HUGE: almost every "-et" ending English word becomes a .et domain hack
  et: [
    // -ket (ticket, basket…)
    "market", "rocket", "ticket", "basket", "cricket", "blanket", "bracket",
    "jacket", "packet", "racket", "socket", "wicket", "bucket", "locket",
    "pocket", "docket", "thicket", "trinket",
    // -get / -dget / -bget
    "gadget", "budget", "midget", "widget", "nugget", "target",
    // -net / -gnet
    "planet", "magnet", "internet", "cabinet", "bonnet", "sonnet", "coronet",
    "bayonet", "cornet", "garnet", "hornet", "ethernet", "clarinet",
    // -let / -glet
    "tablet", "droplet", "piglet", "booklet", "outlet", "inlet", "eyelet",
    "hamlet", "mallet", "wallet", "bullet", "pullet", "gullet", "mullet",
    "fillet", "millet", "goblet", "amulet", "pamphlet", "scarlet",
    "starlet", "brooklet", "platelet", "rivulet", "streamlet", "leaflet",
    // -set / -eset
    "secret", "regret", "closet", "reset", "offset", "preset", "onset",
    "inset", "mindset", "dataset", "toolset", "skillset", "headset",
    // -vel / -vel (not -et)…
    "velvet", "helmet", "comet", "poet",
    // -ret / -rest
    "beret", "parrot",
    // -est (already in .st) overlapping
    // misc quality entries
    "buffet", "bouquet", "ricochet", "vignette", "silhouette", "cassette",
    "rosette", "roulette", "gazette", "coquette", "cigarette", "pirouette",
    "etiquette", "marionette",
  ],

  // ── .ke — Kenya ─────────────────────────────────────────────────────────────
  // English words ending in "-ke": verbs, nouns, adjectives
  ke: [
    // -ake family
    "make", "take", "lake", "cake", "fake", "sake", "bake", "wake",
    "shake", "brake", "snake", "stake", "mistake", "cupcake", "namesake",
    "snowflake", "handshake", "earthquake", "cornflake", "partake",
    "overtake", "undertake", "forsake", "headache", "heartache",
    "outbreak", "daybreak", "intake", "opaque",
    // -ike family
    "bike", "like", "hike", "spike", "strike", "unlike", "dislike",
    "turnpike", "hitchhike", "workforce",
    // -oke family
    "joke", "poke", "smoke", "spoke", "broke", "stroke", "yoke",
    "bespoke", "choke", "cloak", "provoke", "invoke", "evoke", "revoke",
    "artichoke", "sunstroke", "heatstroke",
    // -uke family
    "duke", "fluke", "rebuke", "nuke",
    // -eke / -ique
    "geek", "freak", "sneak", "streak", "squeak", "antique", "unique",
    "mystique", "technique", "boutique", "critique", "physique", "clique",
    // misc
    "spike", "alike", "Godlike", "lifelike", "namesake",
  ],

  // ── .ar — Argentina ─────────────────────────────────────────────────────────
  // Words ending in "-ar": possibly the richest 2-letter hack TLD
  ar: [
    // short -ar
    "star", "bar", "car", "far", "jar", "tar", "war", "czar", "scar",
    "char", "cigar", "radar", "sonar", "bazaar", "avatar",
    // -olar / -ular family (MASSIVE)
    "solar", "polar", "lunar", "molar", "scalar", "jocular",
    "popular", "regular", "secular", "similar", "familiar", "peculiar",
    "cellular", "modular", "tubular", "globular", "circular", "vascular",
    "muscular", "molecular", "nuclear", "ocular", "angular", "singular",
    "granular", "tabular", "titular", "secular", "vulgar", "linear",
    "perpendicular", "rectangular", "triangular", "spectacular",
    "particular", "vehicular", "vernacular", "muscular", "tentacular",
    "multimolecular", "extracurricular", "intramuscular", "intravascular",
    "bipolar", "unipolar", "multipolar",
    // -llar / -ilar
    "dollar", "collar", "pillar", "stellar", "cellar", "scholar",
    "similar", "popular", "secular",
    // -tar / -nar
    "altar", "mortar", "nectar", "guitar", "jaguar",
    "calendar", "seminar", "vinegar", "sugar", "cedar",
    // -ular professions / science
    "modular", "granular", "capsular", "valvular", "globular",
    // brand
    "avatar", "webinar", "sidebar", "toolbar", "navbar",
    // compound
    "crowbar", "racecar", "sidecar", "railcar", "motorcar",
    "handlebar", "crossbar", "sidebar", "freeware",
  ],

  // ── .an — Netherlands Antilles (ccTLD) ──────────────────────────────────────
  // Words ending in "-an": very common English ending
  an: [
    // short
    "plan", "scan", "span", "fan", "man", "ban", "can", "tan", "van",
    "clan", "bran", "gran", "than", "pan", "ran",
    // -man
    "human", "woman", "urban", "orphan", "sedan",
    // -ian
    "ocean", "median", "Indian", "African", "Cuban", "Japanese"[0],
    "guardian", "barbarian", "Christian", "historian",
    "musician", "technician", "physician", "politician", "librarian",
    "humanitarian", "vegetarian", "authoritarian", "totalitarian",
    "pedestrian", "equestrian", "electrician",
    "mathematician", "statistician", "optician",
    // -an nouns / adjectives
    "artisan", "partisan", "caravan", "veteran", "pelican",
    "organ", "Japan", "Sudan", "Bhutan", "Milan",
    // compound / tech
    "ogan", "cyan", "yuan", "rattan", "marzipan",
    "antiviran", "catamaran", "trimaran",
    // common words
    "than", "span", "plan", "scan", "clan",
    "began", "began", "ocean", "Jordan", "Korean",
    "European", "Canadian", "Australian", "Victorian", "Edwardian",
    "Elizabethan", "Shakespearean", "Olympian",
  ],

  // ── .th — Thailand ──────────────────────────────────────────────────────────
  // Words ending in "-th": all the fundamental abstract nouns
  th: [
    // -alth / -ealth
    "health", "wealth", "stealth", "commonwealth",
    // -ength / -ength
    "strength", "length",
    // -owth / -rowth
    "growth", "regrowth", "overgrowth",
    // -idth / -adth
    "width", "breadth", "depth",
    // -arth / -earth
    "earth", "worth", "birth", "north", "south", "forth",
    "fourth", "seventh", "eighth", "ninth", "tenth",
    // -ruth / -uth
    "truth", "youth", "sleuth", "booth", "tooth", "smooth",
    // -ath / -ath
    "path", "math", "bath", "wrath", "faith", "death", "breath",
    "warmth", "beneath",
    // -nth / -nth
    "month", "growth", "garth",
    // -imath / -math
    "aftermath",
    // abstract / science
    "zenith", "mammoth", "sabbath", "behemoth",
    // -moth
    // ordinals
    "millionth", "hundredth", "thousandth",
  ],

  // ── .id — Indonesia ─────────────────────────────────────────────────────────
  // Words ending in "-id": adjectives, tech terms, proper names
  id: [
    // -pid / -vid
    "rapid", "vapid", "tepid", "vivid", "livid", "avid",
    // -id adjectives
    "valid", "solid", "fluid", "lucid", "rigid", "timid", "humid",
    "morbid", "sordid", "placid", "stupid", "turbid", "languid",
    "putrid", "rancid", "torrid", "acrid", "fetid", "turgid", "candid",
    "insipid", "splendid", "invalid", "orchid",
    // -oid
    "android", "tabloid", "steroid", "asteroid", "paranoid",
    "humanoid", "ovoid", "typhoid", "cuboid", "lymphoid",
    "deltoid", "factoid", "crystalloid",
    // -rid
    "hybrid", "madrid",
    // -mid / -amid
    "pyramid", "amid", "nomadic",
    // -id nouns
    "david", "druid", "squid", "liquid",
    // -bid / -kid / -lid
    "forbid", "eyelid", "overkid",
    // programming / tech
    "userid", "appid", "nodeid",
  ],

  // ── .sk — Slovakia ──────────────────────────────────────────────────────────
  // Words ending in "-sk": short, punchy domain hacks
  sk: [
    "disk", "risk", "desk", "task", "mask", "flask", "whisk", "frisk",
    "brisk", "dusk", "musk", "tusk", "husk", "bask", "cask", "ask",
    "kiosk", "obelisk", "asterisk", "basilisk", "tamarisk",
    "odisk", "spidisk",
  ],

  // ── .ky — Cayman Islands ─────────────────────────────────────────────────────
  // Words ending in "-ky": adjectives (and a few nouns)
  ky: [
    // -ucky / -ucky
    "lucky", "plucky", "ducky", "clucky", "mucky", "yucky",
    // -icky / -ricky
    "tricky", "sticky", "picky", "slicky", "brickey", "prickly",
    // -isky / -eky
    "risky", "frisky",
    // -eaky / -eeky
    "cheeky", "freaky", "sneaky", "squeaky", "geeky",
    // -unky / -unky
    "funky", "chunky", "spunky", "clunky", "junky", "monkey",
    // -acky / -wacky
    "wacky", "tacky", "knacky", "quacky", "stacky",
    // -ooky / -ooky
    "spooky", "kooky", "booky", "hooky", "rooky",
    // -ocky / -locky
    "rocky", "blocky", "cocky", "stocky", "flocky", "knocky",
    // -anky / -inky
    "lanky", "cranky", "swanky", "hanky", "spanky", "kinky", "slinky",
    "dinky", "pinky", "winky",
    // -urky / -erky
    "murky", "quirky", "perky", "jerky", "turkey",
    // -iky / -ike-y
    "spiky", "bikey",
    // misc
    "hockey", "jockey", "lackey", "monkey", "donkey", "whimkey",
    "whiskey", "junky", "porky", "corky",
  ],

  // ── .ph — Philippines ───────────────────────────────────────────────────────
  // Words ending in "-ph": graph-family words — perfect domain hacks
  ph: [
    "graph", "paragraph", "photograph", "telegraph", "autograph",
    "monograph", "lithograph", "topograph", "polygraph", "seismograph",
    "typograph", "stenograph", "micrograph", "sonograph", "radiograph",
    "cardiograph", "electrograph", "mammograph", "thermograph",
    "chronograph", "holograph", "spectrograph", "oscillograph",
    "isograph", "digraph", "trigraph", "epigraph", "homograph",
    "pictograph", "ideograph", "logograph", "orthograph",
    "calligraphy",
  ],

  // ── .gy — Guyana ────────────────────────────────────────────────────────────
  // Words ending in "-gy": -logy, -ogy, -ergy, -urgy, -rgy families — MASSIVE
  gy: [
    // -ology / -ology (core academic disciplines)
    "technology", "biology", "ecology", "geology", "psychology",
    "sociology", "ideology", "theology", "mythology", "philology",
    "zoology", "cosmology", "phonology", "morphology", "seismology",
    "climatology", "hydrology", "glaciology", "volcanology",
    "mineralogy", "oceanography",
    // -cardiology / medical -ology
    "cardiology", "neurology", "dermatology", "oncology", "ophthalmology",
    "radiology", "pathology", "audiology", "immunology", "pharmacology",
    "endocrinology", "epidemiology", "rheumatology", "hematology",
    "gastroenterology", "geriatology", "neonatology", "urology",
    "nephrology", "hepatology", "pulmonology", "gynecology",
    // -ology humanities
    "archaeology", "anthropology", "criminology", "penology",
    "politology", "ethnology", "paleontology", "primatology",
    "entomology", "ornithology", "ichthyology", "herpetology",
    "malacology", "taxonomy", "typology", "genealogy",
    // -logy (no 'o')
    "analogy", "apology", "anthology", "trilogy", "doxology",
    "eulogy", "effigy",
    // -ergy / -urgy
    "energy", "synergy", "allergy", "clergy", "liturgy",
    "surgery", "metallurgy", "dramaturgy", "theurgy", "demiurgy",
    // -egy / -ogy (short)
    "strategy", "orgy", "elegy",
    // -gy misc
    "lethargy", "apathy",
  ],

  // ── .my — Malaysia ──────────────────────────────────────────────────────────
  // Words ending in "-my": -omy, -amy, -emy, -imy families
  my: [
    // -onomy
    "astronomy", "economy", "autonomy", "gastronomy", "taxonomy",
    "agronomy", "metronomy", "deuteronomy",
    // -atomy / -omy
    "anatomy", "dichotomy", "lobotomy", "tonsillectomy", "vasectomy",
    "colostomy", "tracheotomy", "appendectomy", "craniectomy",
    // -emony / -imony
    "harmony", "ceremony", "testimony", "matrimony", "parsimony",
    "hegemony", "antimony", "patrimony", "alimony", "sanctimony",
    "acrimony", "patrimony",
    // -emy
    "enemy", "academy", "infamy",
    // -amy
    "bigamy", "monogamy", "polygamy", "trigamy",
    // -army / -army
    "army",
    // -emy
    "alchemy",
    // -ymph / -omy (misc)
    "pharmacy", "company", "democracy", "diplomacy",
    "intimacy", "privacy", "legacy", "advocacy", "bureaucracy",
    "aristocracy", "plutocracy", "theocracy", "autocracy",
    "technocracy", "democracy", "meritocracy", "gerontocracy",
  ],

  // ── .sy — Syria ─────────────────────────────────────────────────────────────
  // Words ending in "-sy"
  sy: [
    // -asy family
    "easy", "daisy", "mazy", "hazy", "crazy", "lazy",
    "fantasy", "apostasy", "ecstasy", "idiosyncrasy",
    "hypocrisy", "democracy",
    // -ssy / -ossy / -ussy
    "bossy", "mossy", "glossy", "flossy", "classy", "brassy", "grassy",
    "glassy", "sassy", "fussy", "mussy", "messy", "dressy", "sissy",
    "prissy", "missy", "bitsy", "tipsy",
    // -rsy / -arsy
    "heresy", "controvery",
    // -isy / -oisy
    "noisy", "rosy", "posy", "cosy",
    // -usy / -usy
    "busy", "daisy",
    // short
    "pansy", "antsy", "gutsy", "cutsy",
    // compound
    "embassy", "tapestry", "controversy", "hypocrisy", "pharmacy",
  ],

  // ── .ag — Antigua and Barbuda ────────────────────────────────────────────────
  // Words ending in "-ag"
  ag: [
    "bag", "tag", "drag", "flag", "slag", "stag", "brag", "crag",
    "mag", "nag", "rag", "wag", "gag", "hag", "lag", "zag",
    "shag", "snag", "swag", "jag",
    "zigzag", "handbag", "sandbag", "beanbag", "airbag",
    "teabag", "mailbag", "windbag", "ragtag",
  ],

  // ── .ug — Uganda ─────────────────────────────────────────────────────────────
  // Words ending in "-ug"
  ug: [
    "bug", "drug", "hug", "mug", "plug", "slug", "snug", "thug",
    "shrug", "chug", "jug", "lug", "pug", "rug", "tug",
    "debug", "unplug", "earplugs",
    "bedbug", "ladybug", "humbug", "firebug",
  ],

  // ── .bi — Burundi ────────────────────────────────────────────────────────────
  // Words ending in "-bi"
  bi: [
    "alibi", "rabbi", "kohlrabi", "banzai",
    "bambi", "dubai", "kabuki", "wasabi",
    "sushi", "teriyaki",
  ],

  // ── .gi — Gibraltar ──────────────────────────────────────────────────────────
  // Words ending in "-gi"
  gi: [
    "yogi", "fungi", "corgi", "khaki", "safari",
    "origami", "tsunami", "salami", "paparazzi",
  ],

  // ── .ni — Nicaragua ──────────────────────────────────────────────────────────
  // Words ending in "-ni"
  ni: [
    "alumni", "bikini", "macaroni", "pepperoni", "martini", "gemini",
    "zucchini", "linguini", "fettuccini", "mozzarelloni",
    "tahini", "humuni", "sashimi",
    "yakitori", "origami",
  ],

  // ── .li — Liechtenstein ───────────────────────────────────────────────────────
  // Words ending in "-li"
  li: [
    "broccoli", "chili", "bali", "mali", "napoli",
    "cannoli", "ravioli", "tortellini",
    "salami", "paparazzi",
    "spaghetti", "confetti", "graffiti",
  ],

  // ── .fi — Finland ─────────────────────────────────────────────────────────────
  // Words ending in "-fi"
  fi: [
    "wifi", "sci-fi", "hifi",
    "kofi", "graffiti",
    "selfie", "smoothie",
  ],

  // ── .ad — Andorra ─────────────────────────────────────────────────────────────
  // Words ending in "-ad"
  ad: [
    "nomad", "triad", "salad", "ballad", "squad", "grad", "glad",
    "brad", "clad", "plaid",
    "baghdad", "olympiad", "myriad",
    "download", "upload", "payload",
    "comrad", "comrade",
    "dyad", "monad", "hexad", "pentad",
  ],

  // ── .bd — Bangladesh ─────────────────────────────────────────────────────────
  // Words ending in "-bd" — very few; skip mostly
  bd: [],

  // ── .rd — not a TLD; skip ─────────────────────────────────────────────────────

  // ── .nd — not a TLD ───────────────────────────────────────────────────────────

  // ── .il — Israel ──────────────────────────────────────────────────────────────
  // Words ending in "-il"
  il: [
    "email", "until", "civil", "evil", "fossil", "pencil", "anvil",
    "vigil", "peril", "pupil", "council", "utensil", "daffodil",
    "brazil", "april", "stencil", "tendril",
    "mobile", "agile", "futile", "hostile", "fertile", "sterile",
    "volatile", "docile", "juvenile", "versatile", "reconcile",
    "imbecile", "facile", "senile", "missile",
    "profile", "domicile", "crocodile", "infantile",
  ],

  // ── .ch — Switzerland (supplement) ───────────────────────────────────────────
  // Words ending in "-ch": supplement existing 72 entries
  ch: [
    // -ach / -each / -each
    "beach", "reach", "teach", "preach", "breach", "bleach", "peach",
    "speech", "research", "approach", "encroach", "outreach",
    // -arch
    "march", "search", "monarch", "patriarch", "matriarch", "oligarch",
    "stomach", "spinach", "eunuch", "almanac",
    // -itch / -atch / -otch
    "switch", "witch", "ditch", "pitch", "rich", "which",
    "catch", "match", "patch", "batch", "hatch", "latch", "watch",
    "snatch", "scratch", "dispatch", "attach", "detach",
    "sketch", "fetch", "stretch", "wretch", "retch",
    "notch", "botch", "scotch", "blotch", "crotch",
    "touch", "pouch", "slouch", "couch", "grouch", "crouch", "ouch",
    // -unch / -ench / -anch
    "punch", "bunch", "lunch", "hunch", "crunch", "scrunch", "brunch",
    "wrench", "trench", "bench", "French", "quench", "drench",
    "branch", "ranch", "launch", "haunch", "staunch", "paunch",
    // -uch / -uch
    "much", "such", "hutch", "butch", "clutch", "dutch", "crutch",
    "epoch", "debauch",
  ],

  // ── .sk supplement ────────────────────────────────────────────────────────────
  // (already have sk above, but add more)

  // ── .th supplement ────────────────────────────────────────────────────────────
  // (already have th above)

  // ── .ne — Niger (supplement) ──────────────────────────────────────────────────
  // Words ending in "-ne": very large category
  ne: [
    // -one family
    "phone", "stone", "bone", "tone", "cone", "zone", "done", "gone",
    "drone", "lone", "prone", "clone", "throne", "ozone", "alone",
    "someone", "anyone", "backbone", "milestone", "cornerstone",
    "limestone", "keystone", "sandstone", "moonstone",
    // -ine family
    "online", "airline", "offline", "sunshine", "moonshine", "skyline",
    "mainline", "deadline", "guideline", "baseline", "coastline",
    "pipeline", "timeline", "landline", "storyline", "streamline",
    "headline", "lifeline", "sideline", "hairline", "waistline",
    "beeline", "hotline", "powerline", "underline", "borderline",
    // -ane / -ine
    "engine", "routine", "marine", "vaccine", "define", "machine",
    "canteen", "protein", "nicotine", "caffeine",
    // -une
    "fortune", "tribune", "commune", "immune", "dune", "tune",
    "prune", "June", "Neptune",
  ],

  // ── .st supplement ────────────────────────────────────────────────────────────
  // Words ending in "-st": supplement to boost the existing 239
  st: [
    // -ist professions (great for personal/professional domains)
    "artist", "activist", "analyst", "tourist", "cyclist", "stylist",
    "chemist", "lobbyist", "archivist", "communist", "economist",
    "scientist", "journalist", "specialist", "therapist", "pharmacist",
    "biologist", "zoologist", "geologist", "botanist", "physicist",
    "linguist", "dentist", "optometrist", "chiropodist", "nutritionist",
    "environmentalist", "conservationist", "philanthropist", "capitalist",
    "nationalist", "idealist", "realist", "minimalist", "maximalist",
    "rationalist", "fundamentalist", "pacifist", "humanist",
    "feminist", "socialist", "communist", "anarchist", "columnist",
    "strategist", "organist", "pianist", "guitarist", "bassist",
    "cellist", "violinist", "vocalist", "instrumentalist",
    // -est adjectives / nouns
    "interest", "protest", "harvest", "forecast", "contrast",
    "manifest", "conquest", "request", "suggest", "exhaust",
    "combust", "adjust", "invest", "divest", "protest",
    "arrest", "contest", "digest", "modest", "honest",
    "forest", "tempest", "molest", "infest", "attest",
    "detest", "quest", "jest",
  ],

  // ── .gy supplement ───────────────────────────────────────────────────────────
  // (already covered above)

};
