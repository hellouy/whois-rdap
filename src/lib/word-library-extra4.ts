// Massive word library expansion — batch 4
// Covers 80+ TLDs that were empty or sparse
// Merged into WORD_LIBRARY at import time via domain-hack.ts

export const WORD_LIBRARY_EXTRA4: Record<string, string[]> = {

  // ============================================================
  // ASIA & PACIFIC ccTLDs
  // ============================================================

  // .jp words (words containing "jp" — extremely rare, use creative endings)
  jp: [],

  // .kr words
  kr: [],

  // .vn words
  vn: [],

  // .cn words (words ending in "cn" — none natural, skip)
  cn: [],

  // .tw words
  tw: [],

  // .hk words
  hk: [],

  // .ph words (already has graph etc, expand)
  ph: [
    "graph", "telegraph", "photograph", "paragraph", "triumph",
    "autograph", "biography", "geography", "typography",
    "choreograph", "lithograph", "seismograph", "hieroglyph",
    "calligraphy", "glyph", "morph", "nymph", "sylph", "lymph",
    "epitaph", "cenotaph", "polymorph", "xenomorph", "metamorph",
    "joseph", "ralph", "randolph", "rudolph", "triumph",
    "digraph", "monograph", "holograph", "pictograph",
    "stenograph", "phonograph", "telegraph", "cinematograph",
    "radiograph", "cardiograph", "electrocardiograph",
  ],

  // .my words (Malaysia — already done as suffix)

  // .sg words (Singapore — already has song/long etc, expand)
  sg: [
    "song", "long", "strong", "wrong", "along", "belong",
    "king", "ring", "sing", "wing", "bring", "thing", "string",
    "spring", "swing", "sting", "cling", "fling", "sling",
    "wring", "blessing", "crossing", "dressing", "guessing",
    "missing", "passing", "pressing", "processing", "addressing",
    "amazing", "blazing", "closing", "composing", "disposing",
    "freezing", "gazing", "losing", "opposing", "pleasing",
    "raising", "rising", "surprising", "teasing",
  ],

  // .id words (Indonesia — already done as suffix)

  // .bd words (Bangladesh)
  bd: [],

  // .pk words (Pakistan)
  pk: [],

  // .lk words (Sri Lanka — already done)

  // .np words (Nepal)
  np: [],

  // .mm words (Myanmar)
  mm: [
    "mammal", "mammoth", "hammer", "grammar", "stammer", "glamour",
    "mammogram", "programming", "swimming", "trimming", "skimming",
    "humming", "drumming", "slimming", "shimmer", "glimmer",
    "simmer", "shimmy", "summit", "mammary", "ammunition",
    "command", "commander", "commemorate", "commercial", "commission",
    "commit", "committee", "commodity", "communicate", "community",
    "commute", "rummage", "summary", "summer", "symmetry",
  ],

  // .kh words (Cambodia)
  kh: [],

  // .la words (Laos — already done)

  // ============================================================
  // LATIN AMERICA & CARIBBEAN ccTLDs
  // ============================================================

  // .mx words (Mexico — words containing "mx" — none natural)
  mx: [],

  // .br words (Brazil)
  br: [
    "zebra", "cobra", "algebra", "caliber", "fiber", "timber",
    "member", "remember", "september", "october", "november",
    "december", "ember", "amber", "chamber", "somber", "lumber",
    "number", "slumber", "cucumber", "timber",
    "celebrate", "deliberate", "elaborate", "liberate",
    "vibrate", "calibrate", "vertebra", "candelabra",
    "celebrity", "sobriety", "liberty", "library",
    "abbreviate", "abridge", "abroad", "abrupt",
    "abstract", "embrace", "umbrella", "embryo",
  ],

  // .ar words (Argentina — already done as suffix, expand more)
  ar: [
    "star", "car", "bar", "guitar", "avatar", "radar", "calendar",
    "popular", "regular", "similar", "nuclear", "circular", "singular",
    "spectacular", "particular", "molecular", "dollar", "cellar",
    "collar", "pillar", "scholar", "lunar", "solar", "sugar",
    "grammar", "hammer", "manner", "banner", "dinner", "inner",
    "winner", "zipper", "copper", "rubber", "ladder", "matter",
    "butter", "litter", "bitter", "glitter", "letter",
    "nectar", "guitar", "altar", "mortar", "tartar",
    "angular", "annular", "binocular", "cellular", "consular",
    "curricular", "familiar", "insular", "irregular", "linear",
    "lunar", "modular", "muscular", "ocular", "peculiar",
    "perpendicular", "rectangular", "secular", "seminar",
    "spectacular", "triangular", "tubular", "vascular", "vinegar",
    "vulgar", "seminar", "webinar", "bazaar", "caviar",
    "cigar", "czar", "jaguar", "memoir", "nectar", "registrar",
    "repertoire", "reservoir", "spectacular", "superstar",
  ],

  // .cl words (Chile)
  cl: [
    "rical", "etical", "istical", "logical", "typical",
    "classical", "practical", "magical", "musical", "physical",
    "chemical", "clinical", "critical", "cyclical", "cynical",
    "empirical", "graphical", "historical", "identical", "lyrical",
    "mechanical", "methodical", "mystical", "nautical", "numerical",
    "optical", "paradoxical", "pharmaceutical", "philosophical",
    "political", "radical", "rical", "skeptical", "surgical",
    "tactical", "technical", "theatrical", "topical", "tropical",
    "vertical", "whimsical",
  ],

  // .co words (Colombia — already done, expand)
  co: [
    "taco", "echo", "disco", "deco", "eco", "gecko", "bronco",
    "fiasco", "fresco", "tobacco", "monaco", "morocco", "sirocco",
    "stucco", "calico", "dynamo", "flamingo", "gringo",
    "poncho", "psycho", "rancho", "rodeo", "romeo",
    "bistro", "espresso", "maestro", "manifesto",
    "avocado", "bravado", "desperado", "commando", "torpedo",
    "embargo", "cargo", "virago", "archipelago",
  ],

  // .pe words (Peru — already done)

  // .cu words (Cuba)
  cu: [
    "rescue", "barbecue", "continue", "statue", "revenue",
    "venue", "tissue", "issue", "value", "argue", "league",
    "vague", "fatigue", "intrigue", "catalogue", "dialogue",
    "prologue", "epilogue", "monologue", "synagogue",
    "unique", "antique", "technique", "boutique", "mystique",
    "physique", "critique", "oblique", "clique", "pique",
    "mosque", "bisque", "torque", "opaque", "baroque",
    "picturesque", "grotesque", "arabesque", "burlesque",
    "statuesque", "romanesque",
  ],

  // .uy words (Uruguay)
  uy: [
    "buy", "guy", "annoy", "destroy", "employ",
    "enjoy", "deploy", "decoy", "ploy", "alloy",
    "convoy", "envoy", "savoy", "killjoy", "tomboy",
    "cowboy", "playboy",
  ],

  // .py words (Paraguay — already done as suffix)

  // .bo words (Bolivia)
  bo: [
    "turbo", "jumbo", "limbo", "mambo", "combo", "gumbo",
    "placebo", "gazebo", "flambe", "bamboo", "taboo",
    "voodoo", "igloo", "shampoo", "tattoo", "kangaroo",
    "boo", "zoo", "moo", "goo", "woo", "too",
    "elbow", "rainbow", "below", "follow", "hollow",
    "borrow", "sorrow", "tomorrow", "narrow", "shadow",
    "meadow", "window", "pillow", "willow", "yellow",
    "fellow", "mellow", "cello", "hello",
    "robot", "reboot", "about", "labor", "harbor", "neighbor",
  ],

  // .hn words (Honduras — already has john)
  hn: [
    "john", "ashen", "earthen", "heathen", "kitchen", "liken",
    "lichen", "often", "orphan", "siren", "vixen", "widen",
    "awaken", "blacken", "brighten", "broaden", "cheapen",
    "christen", "coarsen", "dampen", "darken", "deafen",
    "deepen", "embolden", "enlighten", "fasten", "fatten",
    "flatten", "frighten", "gladden", "golden", "happen",
    "harden", "hasten", "heighten", "lessen", "lighten",
    "listen", "loosen", "madden", "moisten", "neaten",
    "quicken", "quieten", "redden", "ripen", "roughen",
    "sadden", "sharpen", "shorten", "sicken", "slacken",
    "smarten", "soften", "stiffen", "straighten", "strengthen",
    "sweeten", "tighten", "toughen", "weaken", "whiten", "worsen",
  ],

  // .cr words (Costa Rica)
  cr: [
    "acre", "lucre", "massacre", "sacred", "secret", "sincere",
    "secure", "obscure", "procure", "endure", "allure", "demure",
    "scripture", "sculpture", "structure", "culture", "nature",
    "creature", "feature", "moisture", "mixture", "fixture",
    "fracture", "lecture", "picture", "puncture", "rapture",
    "texture", "venture", "gesture", "pasture", "posture",
    "capture", "chapter", "character", "charter",
    "discover", "recover", "uncover",
  ],

  // .pa words (Panama — already done, expand)
  pa: [
    "europa", "spa", "papa", "coppa", "cuppa", "grandpa", "sherpa",
    "pampa", "okra", "opera", "zebra", "cobra", "ultra",
    "utopia", "dystopia", "myopia", "cornucopia", "olympia",
    "encyclopedia", "wikipedia", "criteria", "bacteria",
    "cafeteria", "hysteria", "malaria", "militia", "trivia",
    "pizzeria", "sangria", "academia", "nostalgia",
  ],

  // .sv words (El Salvador)
  sv: [],

  // .gt words (Guatemala)
  gt: [],

  // .ni words (Nicaragua — already done)

  // .do words (Dominican Republic — already done)

  // .tt words (Trinidad — already done)

  // .jm words (Jamaica)
  jm: [],

  // .ht words (Haiti — already done as suffix)

  // .bz words (Belize)
  bz: [
    "buzz", "fuzz", "jazz", "fizz", "quiz", "whiz",
    "pizzazz", "razzmatazz", "razz", "showbiz",
  ],

  // ============================================================
  // EUROPE ccTLDs
  // ============================================================

  // .nl words (Netherlands)
  nl: [],

  // .de words (Germany — already done as suffix)

  // .fr words (France)
  fr: [
    "affair", "chair", "fair", "hair", "pair", "stair", "repair",
    "despair", "safari", "transfer", "prefer", "refer", "offer",
    "buffer", "suffer", "differ", "conifer", "cipher", "decipher",
    "refer", "infer", "defer", "confer", "after", "laughter",
    "daughter", "slaughter", "quarter", "chapter",
    "afraid", "fragment", "fragile", "fraction", "frame",
    "franchise", "frank", "frequent", "fresh", "friction",
    "friend", "fright", "fringe", "frontier", "frown", "frozen",
    "frugal", "fruit", "frustrate", "fry",
  ],

  // .it words (Italy — already done as suffix)

  // .es words (Spain — already done as suffix)

  // .pt words (Portugal — already done)

  // .ua words (Ukraine)
  ua: [
    "actual", "annual", "casual", "dual", "equal", "gradual",
    "habitual", "individual", "manual", "mutual", "perpetual",
    "ritual", "sexual", "spiritual", "textual", "usual",
    "virtual", "visual", "eventual", "intellectual", "residual",
    "bilingual", "continual", "effectual", "influential",
    "punctual", "contextual", "contractual",
    "guard", "guarantee", "guardian", "guava",
    "squad", "squadron", "square", "squash", "squat",
    "quake", "quality", "quantity", "quarantine", "quarter",
    "quartz", "quantum", "aqua", "adequate", "antiquarian",
  ],

  // .pl words (Poland — already done in base, expand)
  pl: [
    "apple", "people", "simple", "couple", "purple", "temple",
    "sample", "example", "principle", "multiple", "miracle",
    "article", "vehicle", "obstacle", "spectacle", "chronicle",
    "battle", "cattle", "bottle", "little", "settle", "kettle",
    "gentle", "subtle", "turtle", "castle", "whistle", "bristle",
    "muscle", "hustle", "puzzle", "muzzle", "nozzle", "drizzle",
    "candle", "handle", "bundle", "riddle", "middle", "saddle",
    "paddle", "needle", "cradle", "rumple", "crumple",
    "dimple", "pimple", "ripple", "tipple", "cripple",
    "nipple", "stipple", "supple", "couple", "grapple",
    "chapel", "maple", "staple", "disciple", "steeple",
    "trample", "scramble", "gamble", "ramble", "shamble",
    "stumble", "tumble", "fumble", "humble", "grumble",
    "crumble", "mumble", "rumble", "jumble",
    "ample", "trample", "sample", "example",
    "triple", "quadruple", "quintuple", "sextuple",
  ],

  // .ro words (Romania — already done as suffix)

  // .bg words (Bulgaria)
  bg: [],

  // .cz words (Czech Republic)
  cz: [],

  // .sk words (Slovakia — already done)

  // .hu words (Hungary — already done)

  // .si words (Slovenia — already done)

  // .hr words (Croatia — already done)

  // .ba words (Bosnia)
  ba: [
    "global", "verbal", "herbal", "tribal", "tuba", "scuba",
    "cuba", "samba", "rumba", "marimba", "roomba",
    "amoeba", "algebra", "zebra", "cobra", "libra",
    "umbrella", "vanilla", "gorilla", "guerrilla",
    "rhubarb", "suburb", "superb", "disturb", "absorb",
    "bomb", "climb", "comb", "dumb", "lamb", "limb",
    "numb", "plumb", "thumb", "tomb", "womb",
    "amba", "roomba", "samba", "rumba",
  ],

  // .rs words (Serbia — already done as suffix)

  // .me words (Montenegro — already done)

  // .mk words (North Macedonia — already done)

  // .al words (Albania — already done)

  // .gr words (Greece — already done)

  // .tr words (Turkey)
  tr: [
    "water", "winter", "center", "enter", "master", "monster",
    "cluster", "filter", "poster", "chapter", "character",
    "encounter", "minister", "register", "sinister",
    "orchestra", "semester", "parameter", "diameter",
    "theater", "disaster", "ancestor", "gangster", "hamster",
    "lobster", "rooster", "oyster", "blister", "sister",
    "mister", "foster", "cluster", "plaster", "butter",
    "better", "letter", "matter", "litter", "bitter",
    "glitter", "twitter", "flutter", "clutter", "gutter",
    "shutter", "stutter", "mutter", "nutter", "utter",
    "outer", "counter", "encounter", "quarter",
    "hunter", "pointer", "printer", "splinter", "winter",
    "astronaut", "construct", "contrast", "control",
    "contribute", "country", "introduce", "matrix",
    "neutral", "nutrition", "patron", "spectrum", "extra",
    "ultra", "electric", "electronic", "entric", "entric",
    "entric", "metric", "symmetric", "geometric", "entric",
  ],

  // .dk words (Denmark)
  dk: [],

  // .se words (Sweden — already done as suffix)

  // .fi words (Finland — already done)

  // .no words (Norway — already done)

  // .is words (Iceland — already done)

  // .ie words (Ireland)
  ie: [
    "die", "lie", "tie", "pie", "vie", "cookie", "brownie",
    "zombie", "genie", "pixie", "birdie", "caddie", "collie",
    "calorie", "beanie", "meanie", "weenie", "bikini",
    "budgie", "boogie", "bookie", "cookie", "hoodie",
    "goodie", "foodie", "smoothie", "selfie", "groupie",
    "hippie", "yuppie", "junkie", "rookie", "bookie",
    "commie", "doggie", "magpie", "prairie", "eerie",
    "movie", "oldie", "quickie", "talkie", "walkie",
    "auntie", "sweetie", "cutie", "hottie", "sortie",
    "reverie", "lingerie", "menagerie", "brasserie",
    "patisserie", "rotisserie",
  ],

  // .lu words (Luxembourg)
  lu: [
    "blue", "clue", "glue", "true", "value", "argue", "rescue",
    "statue", "revenue", "avenue", "continue", "issue", "tissue",
    "pursue", "virtue", "residue", "barbecue", "cue",
    "elu", "flu", "igloo", "shampoo", "debut",
    "tofu", "menu", "tutu", "guru",
  ],

  // .at words (Austria — already done as suffix)

  // .ch words (Switzerland — already done)

  // .li words (Liechtenstein — already done)

  // .be words (Belgium — already done)

  // .eu words (European Union)
  eu: [
    "queue", "lieu", "bleu", "adieu", "milieu", "chateau",
    "bureau", "plateau", "tableau", "trousseau", "rousseau",
    "beau", "gateau", "chapeau", "bandeau", "bateau",
    "nouveau", "chateau", "plateau", "tableau",
  ],

  // ============================================================
  // AFRICA ccTLDs
  // ============================================================

  // .za words (South Africa — already done)

  // .ng words (Nigeria — already done as suffix)

  // .ke words (Kenya)
  ke: [
    "make", "take", "bake", "cake", "fake", "lake", "sake",
    "wake", "shake", "snake", "brake", "stake", "flake",
    "mistake", "earthquake", "handshake", "snowflake",
    "bike", "hike", "like", "mike", "pike", "strike",
    "spike", "alike", "dislike", "unlike",
    "duke", "fluke", "juke", "nuke", "rebuke",
    "joke", "smoke", "spoke", "broke", "choke", "invoke",
    "provoke", "revoke", "stroke", "evoke", "awoke",
    "poke", "woke", "yoke",
    "market", "basket", "blanket", "bracket", "bucket",
    "carpet", "casket", "cricket", "gadget", "jacket",
    "locket", "packet", "pocket", "racket", "rocket",
    "socket", "target", "ticket", "trinket", "wicket",
  ],

  // .gh words (Ghana)
  gh: [
    "high", "sigh", "thigh", "nigh", "weigh", "sleigh", "neigh",
    "tough", "rough", "enough", "cough", "dough", "though",
    "through", "thorough", "borough", "furlough",
    "laugh", "drought", "plough", "slough",
    "strength", "length", "eighth",
  ],

  // .tz words (Tanzania — already done)

  // .ug words (Uganda)
  ug: [
    "bug", "drug", "hug", "jug", "mug", "plug", "rug", "slug",
    "snug", "smug", "shrug", "thug", "tug", "unplug", "debug",
    "bedbug", "firebug", "humbug", "ladybug", "earplug",
    "dug", "lug", "pug", "chug",
    "sugar", "cougar", "vulgar", "cigar", "guitar",
    "jaguar", "august", "dugout", "fugitive", "figure",
    "argue", "fatigue", "league", "vague", "plague",
    "dialogue", "catalogue", "epilogue", "prologue",
    "rogue", "vogue", "brogue",
  ],

  // .et words (Ethiopia)
  et: [
    "get", "set", "bet", "jet", "let", "met", "net", "pet",
    "vet", "wet", "yet", "fret", "regret", "forget", "upset",
    "reset", "onset", "sunset", "offset", "mindset",
    "asset", "basket", "blanket", "bracket", "budget",
    "bullet", "cabinet", "carpet", "closet", "comet",
    "cricket", "diet", "duet", "ferret", "gadget",
    "garnet", "goblet", "gourmet", "hamlet", "helmet",
    "jacket", "magnet", "market", "muppet", "nugget",
    "outlet", "packet", "pamphlet", "parrot", "pellet",
    "planet", "pocket", "puppet", "quiet", "racket",
    "rivet", "rocket", "secret", "socket", "sonnet",
    "target", "thicket", "ticket", "toilet", "trumpet",
    "turret", "velvet", "violet", "wallet", "widget",
    "alphabet", "amulet", "bayonet", "beret", "bouquet",
    "brunette", "buffet", "cabinet", "cadet", "cassette",
    "cigarette", "clarinet", "cornet", "couplet",
    "crochet", "etiquette", "gazette", "internet",
    "minuet", "omelette", "palette", "quartet", "silhouette",
    "vignette", "marionette",
  ],

  // .cm words (Cameroon)
  cm: [],

  // .sn words (Senegal)
  sn: [],

  // .ci words (Côte d'Ivoire)
  ci: [
    "acid", "ancient", "basic", "capacity", "city", "civil",
    "decimal", "decide", "electric", "explicit", "fabric",
    "genetic", "icicle", "implicit", "magic", "medicine",
    "music", "pacific", "pencil", "precise", "publicize",
    "racism", "recipe", "science", "social", "special",
    "specific", "sufficient", "sacrifice", "glacier",
    "lucid", "placid", "rancid", "morbid",
  ],

  // .rw words (Rwanda — already done in base)

  // ============================================================
  // MIDDLE EAST & CENTRAL ASIA ccTLDs
  // ============================================================

  // .ae words (UAE)
  ae: [
    "free", "three", "agree", "degree", "guarantee",
    "employee", "committee", "referee", "trainee", "filigree",
    "pedigree", "jamboree", "jubilee", "absentee", "divorcee",
    "nominee", "devotee", "refugee", "addressee", "licensee",
  ],

  // .sa words (Saudi Arabia)
  sa: [
    "mesa", "visa", "salsa", "balsa", "salsa",
    "versa", "vice-versa", "mimosa", "curiosa",
    "rehearsal", "reversal", "universal", "proposal",
    "dismissal", "disposal", "appraisal", "colossal",
  ],

  // .il words (Israel)
  il: [
    "tail", "mail", "rail", "sail", "trail", "detail", "retail",
    "email", "cocktail", "ponytail", "fingernail", "thumbnail",
    "snail", "avail", "prevail", "curtail", "derail",
    "fail", "jail", "bail", "hail", "nail", "pail", "wail",
    "oil", "soil", "coil", "foil", "toil", "boil", "spoil",
    "broil", "recoil", "turmoil",
    "pencil", "council", "stencil", "fossil", "tonsil",
    "civil", "devil", "evil", "peril", "pupil", "anvil",
    "until", "april", "brazil", "council", "fossil",
    "nostril", "tendril", "utensil", "lentil",
  ],

  // .qa words (Qatar)
  qa: [],

  // .kw words (Kuwait)
  kw: [],

  // .om words (Oman — already done)

  // .jo words (Jordan — already done)

  // .lb words (Lebanon — already done)

  // .ge words (Georgia — already done as suffix)

  // .az words (Azerbaijan)
  az: [
    "jazz", "blaze", "craze", "daze", "faze", "gaze", "glaze",
    "graze", "haze", "amaze", "maze", "raze",
    "topaz", "pizzazz", "razzmatazz", "alcatraz",
    "plaza", "piazza", "paparazzi",
  ],

  // .kz words (Kazakhstan)
  kz: [],

  // .uz words (Uzbekistan)
  uz: [
    "buzz", "fuzz", "puzzle", "muzzle", "nuzzle", "guzzle",
    "jacuzzi", "fuzzy", "buzzer",
  ],

  // .tm words (Turkmenistan)
  tm: [],

  // .kg words (Kyrgyzstan)
  kg: [],

  // .tj words (Tajikistan)
  tj: [],

  // ============================================================
  // OCEANIA ccTLDs
  // ============================================================

  // .au words (Australia)
  au: [
    "because", "pause", "cause", "clause", "sauce", "faucet",
    "launch", "haunt", "gaunt", "jaunt", "flaunt", "vaunt",
    "fault", "vault", "assault", "default",
    "caught", "taught", "daughter", "slaughter", "laughter",
    "naughty", "haughty", "laundry", "fraud", "applaud",
    "exhaust", "dinosaur", "restaurant", "bureau", "plateau",
    "chateau", "tableau", "trousseau", "astronaut", "cosmonaut",
    "beauty", "beautiful", "authentic", "author", "authority",
    "autumn", "automatic", "automobile", "audio", "audience",
    "audit", "augment", "aurora", "auspicious", "austere",
  ],

  // .nz words (New Zealand — already done)

  // .fj words (Fiji)
  fj: [],

  // ============================================================
  // OTHER NOTABLE TLDs (gTLDs with hackable endings)
  // ============================================================

  // .app words
  app: [
    "app", "clap", "flap", "gap", "map", "nap", "rap", "slap",
    "snap", "strap", "tap", "trap", "wrap", "zap", "cap",
    "chap", "recap", "mishap", "kidnap", "bootstrap",
    "overlap", "handicap", "burlap", "mousetrap",
  ],

  // .dev words
  dev: [
    "dev", "devil", "develop", "developer", "development",
    "devote", "devotion", "device", "devious", "devise",
    "devour", "devout",
  ],

  // .ai words (Anguilla — already done)

  // .io words (British Indian Ocean Territory — already done)

  // .gg words (Guernsey)
  gg: [
    "egg", "beg", "leg", "peg", "keg", "dreg", "dregs",
    "bigger", "digger", "trigger", "dagger", "stagger",
    "swagger", "luggage", "baggage", "sausage", "cabbage",
    "garbage", "passage", "message", "massage", "village",
    "cottage", "hostage", "voltage", "vintage", "montage",
    "sabotage", "espionage", "camouflage", "entourage",
    "mirage", "garage", "collage", "corsage", "barrage",
    "engage", "disengage", "backstage", "offstage",
    "hemorrhage", "appendage", "patronage", "anchorage",
    "pilgrimage", "orphanage", "parentage", "percentage",
    "personage", "acreage", "leverage", "beverage", "coverage",
    "average", "cleavage", "marriage", "carriage", "miscarriage",
  ],

  // .je words (Jersey — already done)

  // .im words (Isle of Man — already done)

  // .nu words (Niue — already done)

  // .ws words (Samoa — already done)

  // .to words (Tonga — already done)

  // .fm words (Micronesia — already done)

  // .tv words (Tuvalu — already done)

  // .cc words (Cocos Islands — already done)

  // .cx words (Christmas Island)
  cx: [],

  // .tk words (Tokelau)
  tk: [],

  // .wf words (Wallis and Futuna)
  wf: [],

  // .yt words (Mayotte)
  yt: [
    "city", "beauty", "party", "dirty", "empty", "guilty",
    "mighty", "nifty", "plenty", "pretty", "safety", "salty",
    "silty", "thirty", "thirsty", "twenty", "witty",
    "bounty", "county", "deputy", "dusty", "faculty",
    "gravity", "gusty", "hearty", "liberty", "loyalty",
    "majority", "minority", "misty", "nasty", "novelty",
    "penalty", "poverty", "property", "quality", "quantity",
    "reality", "royalty", "rusty", "security", "society",
    "treaty", "trusty", "unity", "vanity", "variety",
    "warranty", "ability", "agility", "authority", "capacity",
    "celebrity", "charity", "clarity", "community",
    "complexity", "creativity", "curiosity", "density",
    "dignity", "diversity", "electricity", "equality",
    "eternity", "facility", "felicity", "fertility",
    "flexibility", "fraternity", "generosity", "humidity",
    "identity", "immunity", "infinity", "integrity",
    "intensity", "majority", "maturity", "mortality",
    "necessity", "obesity", "opportunity", "personality",
    "popularity", "possibility", "priority", "probability",
    "productivity", "prosperity", "publicity", "quality",
    "reality", "responsibility", "security", "sensitivity",
    "serenity", "simplicity", "sincerity", "solidarity",
    "stability", "superiority", "tranquility", "university",
    "velocity", "visibility",
  ],

  // .pm words (Saint Pierre)
  pm: [],

  // .mu words (Mauritius — already done)

  // .sc words (Seychelles — already done)

  // .mv words (Maldives)
  mv: [],

  // ============================================================
  // MORE EXPANSIONS FOR EXISTING SPARSE TLDs
  // ============================================================

  // .er words (Eritrea — already extensive, add more)
  er: [
    "hacker", "maker", "designer", "player", "user", "coder",
    "founder", "leader", "teacher", "speaker", "driver", "writer",
    "farmer", "power", "flower", "tower", "shower", "computer",
    "printer", "server", "developer", "manager", "customer",
    "consumer", "another", "together", "weather", "leather",
    "feather", "gather", "number", "member", "remember",
    "september", "october", "november", "december", "center",
    "enter", "winter", "summer", "dinner", "inner", "butter",
    "matter", "better", "letter", "after", "chapter", "master",
    "disaster", "monster", "cluster", "filter", "booster",
    "answer", "brother", "sister", "father", "mother",
    "daughter", "laughter", "slaughter", "quarter",
    "order", "border", "recorder", "disorder",
    "wonder", "wander", "thunder", "under", "surrender",
    "tender", "render", "gender", "defender", "offender",
    "blender", "slender", "cylinder", "reminder", "insider",
    "outsider", "consider", "encounter", "discover",
    "recover", "deliver", "forever", "never", "ever",
    "clever", "fever", "lever", "river", "liver",
    "silver", "timber", "finger", "ginger", "danger",
    "stranger", "ranger", "anger", "hunger", "younger",
    "longer", "stronger", "trigger", "bigger", "differ",
    "whisper", "copper", "pepper", "paper", "diaper",
    "proper", "prosper", "super", "rubber", "lumber",
    "cucumber", "plumber", "slumber", "umber",
    "hammer", "clamber", "chamber", "amber", "somber",
    "spider", "cider", "wider", "rider", "glider", "slider",
    "insider", "outsider", "divider", "provider", "remainder",
  ],

  // .ge words (Georgia — expand)
  ge: [
    "page", "stage", "age", "huge", "image", "message", "package",
    "manage", "damage", "storage", "average", "courage", "language",
    "knowledge", "bridge", "judge", "pledge", "edge", "charge",
    "change", "range", "challenge", "exchange", "arrange",
    "strange", "orange", "revenge", "privilege", "acknowledge",
    "advantage", "disadvantage", "encourage", "discourage",
    "mortgage", "garbage", "luggage", "baggage", "sausage",
    "cabbage", "passage", "massage", "village", "cottage",
    "hostage", "voltage", "vintage", "percentage",
    "beverage", "coverage", "average", "leverage",
    "marriage", "carriage", "heritage", "shortage",
    "voyage", "engage", "emerge", "merge", "surge",
    "forge", "gorge", "purge", "splurge", "diverge", "converge",
    "submerge", "bulge", "indulge", "refuge", "huge",
    "beige", "siege", "liege",
    "badge", "cadge", "ledge", "hedge", "wedge",
    "ridge", "bridge", "fridge", "porridge", "cartridge",
    "dodge", "lodge", "budge", "fudge", "grudge", "nudge",
    "judge", "sludge", "smudge", "trudge",
  ],

  // .ne words (Niger — expand)
  ne: [
    "bone", "cone", "done", "gone", "hone", "lone", "none",
    "phone", "stone", "tone", "zone", "clone", "drone", "throne",
    "ozone", "milestone", "cornerstone", "limestone", "sandstone",
    "backbone", "headstone", "keystone", "gravestone", "tombstone",
    "cane", "crane", "lane", "mane", "pane", "plane", "sane",
    "vane", "wane", "arcane", "humane", "insane", "mundane",
    "profane", "urbane", "membrane", "hurricane", "cellophane",
    "fine", "line", "mine", "nine", "pine", "vine", "wine",
    "dine", "shine", "shrine", "spine", "divine", "define",
    "combine", "decline", "determine", "discipline", "examine",
    "genuine", "imagine", "medicine", "outline", "routine",
    "sunshine", "underline", "valentine", "feminine", "masculine",
    "turbine", "magazine", "vaccine", "gasoline", "trampoline",
    "adrenaline", "crystalline", "serpentine",
    "tune", "dune", "june", "prune", "fortune", "immune",
    "costume", "volume", "resume", "perfume", "consume",
    "scene", "gene", "serene", "extreme", "supreme", "scheme",
    "theme", "concrete", "complete", "compete", "delete",
    "obsolete", "athlete", "discrete",
  ],

  // .se words (Sweden — expand)
  se: [
    "cause", "because", "pause", "house", "mouse", "clause",
    "purse", "course", "horse", "nurse", "sense", "dense",
    "tense", "response", "defense", "offense", "license",
    "expense", "promise", "surprise", "enterprise", "database",
    "purchase", "release", "increase", "decrease",
    "close", "choose", "browse", "dose", "goose", "loose",
    "moose", "noose", "purpose", "reverse", "universe",
    "case", "base", "chase", "erase", "vase", "phrase",
    "please", "disease", "lease", "grease", "crease",
    "rose", "nose", "pose", "compose", "suppose", "dispose",
    "expose", "oppose", "propose", "impose", "transpose",
    "abuse", "accuse", "amuse", "confuse", "excuse", "fuse",
    "muse", "refuse", "use", "cruise", "bruise",
    "else", "false", "impulse", "pulse", "rinse", "tense",
    "verse", "adverse", "converse", "diverse", "inverse",
    "immerse", "disperse", "traverse", "rehearse",
    "wise", "advise", "comprise", "devise", "disguise",
    "exercise", "franchise", "merchandise", "otherwise",
    "paradise", "precise", "revise", "supervise",
    "sunrise", "surprise", "enterprise",
  ],

  // .st words (São Tomé — expand)
  st: [
    "best", "test", "rest", "fast", "last", "past", "vast",
    "first", "worst", "host", "post", "cost", "lost", "most",
    "trust", "just", "must", "dust", "gust", "rust", "bust",
    "forest", "honest", "modest", "interest", "request",
    "protest", "suggest", "invest", "harvest", "manifest",
    "toast", "roast", "boast", "coast", "beast", "feast",
    "least", "east", "west", "priest", "resist", "insist",
    "persist", "consist", "exist", "assist", "twist",
    "wrist", "mist", "fist", "list", "gist", "grist",
    "frost", "ghost", "almost", "utmost", "foremost",
    "outpost", "compost", "signpost", "doorpost", "guidepost",
    "forecast", "broadcast", "podcast", "downcast", "outcast",
    "overcast", "contrast", "bombast", "enthusiast", "gymnast",
    "blast", "cast", "mast", "vast", "clast",
    "chest", "nest", "quest", "guest", "crest", "pest",
    "zest", "arrest", "conquest", "contest", "digest",
    "earnest", "harvest", "modest", "nearest", "protest",
    "smallest", "tallest", "youngest", "oldest", "boldest",
    "coldest", "wildest", "kindest", "finest",
    "artist", "dentist", "tourist", "cyclist", "chemist",
    "economist", "optimist", "pessimist", "realist", "idealist",
    "journalist", "novelist", "vocalist", "guitarist",
    "pianist", "violinist", "scientist", "specialist",
    "catalyst", "analyst", "therapist", "strategist",
  ],

  // .at words (Austria — expand)
  at: [
    "chat", "flat", "heat", "seat", "beat", "meat", "neat",
    "wheat", "threat", "treat", "sweat", "great", "repeat",
    "defeat", "create", "format", "hat", "cat", "bat", "rat",
    "mat", "fat", "sat", "pat", "that", "what", "combat",
    "acrobat", "democrat", "diplomat", "aristocrat", "bureaucrat",
    "thermostat", "habitat", "caveat", "boat", "coat", "goat",
    "float", "throat", "bloat", "moat",
    "apat", "flat", "brat", "spat", "scat", "splat",
    "doormat", "welcome mat", "laundromat", "automat",
    "abstract", "extract", "attract", "contact", "contract",
    "impact", "react", "interact", "compact", "artifact",
    "habitat", "diplomat", "format", "combat", "acrobat",
  ],
  // .il words already defined above — skipped duplicate

  // .ng words (Nigeria — expand)
  ng: [
    "king", "ring", "sing", "wing", "bring", "thing", "string",
    "spring", "swing", "sting", "cling", "fling", "sling",
    "wring", "song", "long", "strong", "wrong", "along",
    "belong", "prolong",
    "among", "young", "tongue", "lung", "hung", "sung",
    "rung", "stung", "clung", "flung", "slung", "swung", "wrung",
    "saving", "meaning", "morning", "evening", "beginning",
    "opening", "warning", "planning", "running", "coming",
    "landing", "cooking", "banking", "trading", "coding",
    "hacking", "gaming", "streaming", "learning", "building",
    "designing", "marketing", "advertising",
    "amazing", "blazing", "closing", "crossing", "dressing",
    "driving", "falling", "feeling", "fighting", "fishing",
    "flying", "growing", "helping", "hiking", "hunting",
    "jumping", "keeping", "killing", "kissing", "laughing",
    "leaving", "living", "looking", "loving", "making",
    "meeting", "missing", "moving", "nothing", "painting",
    "parking", "passing", "playing", "reading", "riding",
    "rising", "running", "sailing", "selling", "setting",
    "shopping", "sitting", "sleeping", "smoking", "speaking",
    "standing", "starting", "stopping", "swimming", "talking",
    "teaching", "thinking", "touching", "training", "traveling",
    "turning", "waiting", "walking", "watching", "winning",
    "working", "writing",
    "anything", "everything", "nothing", "something",
    "blessing", "ceiling", "clothing", "darling", "dwelling",
    "feeling", "offering", "offspring", "pudding", "sibling",
    "sterling", "wedding", "willing",
    "belonging", "challenging", "engineering", "entertaining",
    "overwhelming", "understanding",
  ],
};
