// Word library expansion — batch 6
// Adds curated word lists for TLDs previously missing coverage
// Each entry: tld_without_dot -> [words that END in those letters]

export const WORD_LIBRARY_EXTRA6: Record<string, string[]> = {

  // ── .af ─ words ending in "af" ──────────────────────────────────────────
  af: ["leaf","deaf","loaf","oaf","chaff","behalf","graf","chaf","scaf"],

  // ── .ax ─ words ending in "ax" ──────────────────────────────────────────
  ax: ["coax","hoax","wax","max","tax","lax","fax","ajax","imax","relax",
       "anthrax","climax","borax","thorax","parallax","earwax","beeswax",
       "rax","sax","pax","flax"],

  // ── .bs ─ words ending in "bs" ──────────────────────────────────────────
  bs: ["abs","cabs","dabs","fibs","jabs","jobs","labs","mobs","ribs","robs",
       "rubs","sobs","tabs","webs","curbs","herbs","limbs","clubs","crabs",
       "cribs","drabs","grabs","knobs","slabs","snobs","stabs","throbs",
       "bulbs","barbs","blobs","combs","globes","grubs","swabs","tombs",
       "thumbs","bombs","clambs","wombs","lambs","combs","jambs"],

  // ── .bt ─ words ending in "bt" ──────────────────────────────────────────
  bt: ["debt","doubt"],

  // ── .by ─ words ending in "by" ──────────────────────────────────────────
  by: ["baby","derby","hobby","lobby","ruby","rugby","hubby","tabby","chubby",
       "grubby","flabby","gabby","shabby","tubby","cubby","snobby","whereby",
       "maybe","cabby","nubby","knobby","scruffy","stubby","webby","booby"],

  // ── .ca ─ words ending in "ca" ──────────────────────────────────────────
  ca: ["alpaca","circa","indica","mecca","orca","replica","wicca","chica",
       "rica","marca","bianca","piazza","panacea","logica","musica","africa",
       "physica","gothica","tropica","botanica","electronica","technica",
       "harmonica","mafia","vodka","polska","fresca","helica","classica"],

  // ── .cy ─ words ending in "cy" ──────────────────────────────────────────
  cy: ["fancy","mercy","legacy","policy","agency","lacy","racy","spicy","icy",
       "juicy","lucy","fluency","urgency","emergency","currency","efficiency",
       "frequency","accuracy","secrecy","privacy","primacy","lunacy","fallacy",
       "literacy","legacy","celracy","vacancy","tenancy","advocacy","diplomacy",
       "democracy","intimacy","pharmacy","supremacy","pregnancy","conspiracy",
       "bankruptcy","bureaucracy","complacency","legitimacy","occupancy",
       "redundancy","relevancy","residency","tendency","urgency","stacy",
       "tracy","nancy","daicy","macy","lacy","racy","grace","clancy","yancy",
       "adequacy","discrepancy","inconsistency","dependency","decency"],

  // ── .um ─ words ending in "um" ──────────────────────────────────────────
  um: ["album","drum","forum","plum","medium","stadium","maximum","minimum",
       "quantum","spectrum","platinum","helium","museum","sodium","opium",
       "podium","calcium","lithium","uranium","aquarium","auditorium","atrium",
       "aquarium","momentum","curriculum","premium","aluminum","fulcrum",
       "decorum","humdrum","cranium","vacuum","barium","chromium","radium",
       "magnesium","potassium","polonium","cerium","chromium","europium",
       "hafnium","iridium","krypton","lanthanum","molybdenum","niobium",
       "osmium","palladium","promethium","rhodium","rubidium","ruthenium",
       "samarium","scandium","selenium","tantalum","technetium","terbium",
       "thallium","thorium","titanium","tungsten","vanadium","ytterbium",
       "yttrium","zirconium","continuum","equilibrium","gymnasium","pendulum",
       "petroleum","referendum","bacterium","compendium","consortium",
       "geranium","harmonium","linoleum","millennium","moratorium","memorandum",
       "opossum","pandemonium","planetarium","solarium","symposium","tedium",
       "titanium","uranium","viaticum","xenonium","strum","swum","scrum",
       "chum","bum","gum","hum","mum","rum","sum","yum","cum","numb","dumb",
       "thumb","plumb","crumb","slum","glum","gum","scum","yum","thrum"],

  // ── .ml ─ words ending in "ml" ──────────────────────────────────────────
  ml: ["html","xml","yaml","toml","sgml","raml","uml","waml","saml"],

  // ── .ao ─ words ending in "ao" ──────────────────────────────────────────
  ao: ["cacao","cao","mao","tao","dao","zhao","gao","yao","hao","bao"],

  // ── .cd ─ words ending in "cd" ──────────────────────────────────────────
  cd: [],

  // ── .ef ─ words ending in "ef" ──────────────────────────────────────────
  ef: ["chef","beef","reef","leaf","brief","grief","thief","relief","belief",
       "chief","deaf","leaf","loaf","ref","fief","lief"],

  // ── .ss ─ words ending in "ss" (expansion) ──────────────────────────────
  ss: ["across","address","press","dress","stress","assess","access","process",
       "less","miss","kiss","class","glass","grass","bass","mass","pass",
       "boss","loss","moss","compass","discuss","dismiss","excess","express",
       "goddess","hardness","illness","impress","kindness","largeness","madness",
       "newness","oddness","oppress","possess","princess","progress","recess",
       "regress","sadness","suppress","success","witness","weakness","fitness",
       "boldness","business","canvas","goodness","happiness","harness","chess",
       "bless","guess","plus","bliss","toss","cross","gloss","floss","truss",
       "fuss","muss","puss","buzz","fizz","jazz","pizzazz","abliss"],

  // ── .ck ─ words ending in "ck" ──────────────────────────────────────────
  ck: ["back","black","block","brick","buck","check","chick","chuck","click",
       "clock","cluck","crack","deck","dock","duck","flick","flock","frock",
       "hack","jack","kick","knock","lack","lick","lock","luck","mock","neck",
       "nick","pack","pick","puck","quick","rack","rock","sock","stack","stick",
       "stock","struck","stuck","suck","thick","tick","track","trick","truck",
       "tuck","wick","wreck","yuck","knack","pluck","slack","slick","smack",
       "snack","speck","spick","stack","stalk","stock","struck","check",
       "attack","aback","ransack","setback","outback","cutback","drawback",
       "feedback","flashback","hardback","kickback","layback","payback",
       "playback","setback","throwback","throwback","pullback","rollback",
       "comeback","feedback","gridlock","hemlock","paddock","shamrock",
       "bedrock","warlock","landlock","deadlock","fetlock","flintlock",
       "padlock","peacock","shamrock","sherlock","unlock","woodcock"],

  // ── .ft ─ words ending in "ft" ──────────────────────────────────────────
  ft: ["craft","draft","drift","gift","graft","grift","heft","loft","left",
       "lift","loft","raft","shaft","shift","soft","swift","theft","tuft",
       "waft","aloft","bereft","cleft","cleft","deft","droft","adrift",
       "aircraft","watercraft","handcraft","minecraft","witchcraft","woodcraft",
       "stagecraft","statecraft","starcraft","warcraft","spellcraft",
       "deckhand","landleft","mast"],

  // ── .lt ─ words ending in "lt" ──────────────────────────────────────────
  lt: ["adult","assault","bolt","built","catapult","cobalt","consult","cult",
       "default","difficult","exult","fault","felt","gilt","guilt","halt",
       "hilt","insult","jolt","jilt","kilt","knelt","malt","melt","molt",
       "molt","occult","result","revolt","salt","silt","smelt","spelt",
       "spilt","stilt","svelte","tilt","tumult","vault","wilt","exalt",
       "asphalt","catapult","gestalt","somersault","cobalt"],

  // ── .mp ─ words ending in "mp" ──────────────────────────────────────────
  mp: ["amp","blimp","bump","camp","champ","chimp","chomp","clamp","clump",
       "comp","crimp","crump","damp","dump","gimp","gramp","grump","hemp",
       "hump","imp","jump","lamp","limp","lump","pimp","plump","pomp","primp",
       "pump","ramp","romp","rump","scamp","slump","stamp","stump","sump",
       "swamp","tamp","tamp","tramp","trump","trump","trump","trump","vamp",
       "whomp","wimp","whomp"],

  // ── .nk ─ words ending in "nk" ──────────────────────────────────────────
  nk: ["bank","blank","blink","brink","bunk","clink","clunk","clank","crank",
       "chunk","dank","drink","drunk","dunk","drank","flank","flunk","frank",
       "funk","hank","honk","hunk","ink","junk","kink","lank","link","monk",
       "pink","plank","plunk","prank","punk","rank","rink","runk","sank",
       "sank","shrink","sink","skunk","slank","slunk","spank","spunk","stank",
       "stink","stunk","sunk","swank","tank","thank","think","think","trunk",
       "trunk","trunk","wink","wrink","yank","blank","prank"],

  // ── .sk ─ words ending in "sk" ──────────────────────────────────────────
  sk: ["ask","brisk","desk","disk","dusk","flask","frisk","husk","kiosk",
       "mask","musk","risk","rusk","task","tusk","whisk","asterisk","basilisk",
       "obelisk","muskie"],

  // ── .nd ─ words ending in "nd" ──────────────────────────────────────────
  nd: ["and","band","bend","bind","bland","blend","blind","bond","bound",
       "brand","command","demand","end","expand","extend","find","fond",
       "found","friend","fund","grand","grind","ground","hand","kind","land",
       "lend","lind","lend","mind","mound","mund","send","sand","sound",
       "stand","strand","trend","und","wand","wind","wound","around","beyond",
       "behind","combined","compound","confound","correspond","diamond","frontend",
       "rebound","refined","remind","respond","second","suspend","understand",
       "weekend","offhand","backhand","shorthand","mainland","island","highland",
       "farmland","homeland","headband","headband","headband","wetland","wasteland","badland"],

  // ── .nt ─ words ending in "nt" ──────────────────────────────────────────
  nt: ["agent","ant","brilliant","cant","client","constant","content","count",
       "current","dent","different","distant","efficient","elegant","event",
       "evident","excellent","extent","faint","frequent","front","giant",
       "government","grant","hint","important","invent","joint","judgment",
       "lament","management","ment","mount","movement","patent","payment",
       "plant","point","prevent","print","relent","represent","rent","runt",
       "saint","sent","silent","silent","slant","smart","spent","sprint",
       "stint","stunt","talent","tenant","torment","tournament","urgent",
       "vibrant","violent","want","warrant","went","print"],

  // ── .pt ─ words ending in "pt" ──────────────────────────────────────────
  pt: ["accept","adapt","adopt","apt","concept","corrupt","crypt","decrypt",
       "disrupt","encrypt","erupt","except","exempt","inept","intercept",
       "opt","prompt","sculpt","swept","wept","adept","kept","slept","crept"],

  // ── .ct ─ words ending in "ct" ──────────────────────────────────────────
  ct: ["act","abstract","artifact","attract","compact","conduct","conflict",
       "connect","construct","contact","contract","correct","defect","deflect",
       "depict","detect","direct","district","distract","effect","exact","extract",
       "fact","impact","indirect","inflict","inject","inspect","instruct","intact",
       "interact","neglect","object","perfect","project","protect","react",
       "redirect","reflect","reject","respect","restrict","select","strict",
       "subject","suspect","tract","transact","abstract"],

  // ── .st ─ words ending in "st" (expansion) ──────────────────────────────
  st: ["artist","assist","blast","boost","broadcast","broadcast","burst",
       "consist","contrast","cost","exist","feast","finest","first","forest",
       "frost","ghost","harvest","honest","host","interest","invest","jest",
       "journalist","just","last","least","list","mist","modest","most",
       "nest","persist","post","quest","resist","rest","robust","rust",
       "suggest","sunset","taste","test","thrust","toast","tourist","trust",
       "twist","vast","worst","worst","wrist","yeast","arrest","protest",
       "contest","manifest","shortest","broadcast","compost","conquest",
       "deposit","exhaust","forecast","harvest","interest","manifest",
       "molest","modest","contest","request","suggest"],

  // ── .ld ─ words ending in "ld" ──────────────────────────────────────────
  ld: ["bold","build","child","cold","field","fold","gold","guild","held",
       "hold","household","mold","old","rebuild","scold","shield","sold",
       "told","world","wield","yield","behold","threshold","scaffold",
       "unfold","uphold","withhold","manifold","stronghold","household",
       "battlefield","oilfield","cornfield","airfield","minefield","battlefield"],

  // ── .rk ─ words ending in "rk" ──────────────────────────────────────────
  rk: ["bark","benchmark","birthmark","bookmark","checkmark","dark","embark",
       "hallmark","landmark","lark","mark","network","park","patchwork","quirk",
       "remark","rework","shark","shirk","skylark","smirk","spark","stork",
       "teamwork","trademark","work","york","framework","clockwork","ironwork",
       "lifework","linework","masterwork","metalwork","overwork","paperwork",
       "woodwork","artwork","bodywork","guesswork","groundwork","homework",
       "legwork","patchwork","stonework","network","handiwork"],

  // ── .rm ─ words ending in "rm" ──────────────────────────────────────────
  rm: ["alarm","arm","charm","confirm","farm","firm","form","germ","harm",
       "inform","norm","platform","reform","storm","swarm","term","transform",
       "uniform","warm","worm","conform","firearm","sidearm","forearm",
       "firestorm","brainstorm","thunderstorm","snowstorm","maelstrom"],

  // ── .rn ─ words ending in "rn" ──────────────────────────────────────────
  rn: ["barn","born","burn","churn","concern","corn","earn","extern","fern",
       "govern","horn","intern","iron","learn","modern","mourn","pattern",
       "return","scorn","sojourn","stern","sworn","torn","turn","warn","worn",
       "acorn","Saturn","western","eastern","northern","southern","saturn",
       "popcorn","unicorn","capricorn","longhorn","bighorn","greenhorn"],

  // ── .rp ─ words ending in "rp" ──────────────────────────────────────────
  rp: ["burp","chirp","corp","harp","sharp","slurp","usurp","warp","tarp",
       "carp","darp","gorp","morp","scarp"],

  // ── .rt ─ words ending in "rt" ──────────────────────────────────────────
  rt: ["apart","art","assert","comfort","concert","concert","convert","court",
       "depart","desert","divert","effort","escort","expert","export","exert",
       "fort","heart","import","insert","inert","invert","overt","part","port",
       "report","resort","revert","short","skirt","smart","sort","sport","squirt",
       "start","subvert","support","thwart","transport","turbulent","wart",
       "airport","alert","assert","comfort","convert","debut","dessert","distort",
       "divert","escort","exert","export","extort","import","insert","invert",
       "purport","reassert","report","resort","retort","revert","subvert","support",
       "transport","alert","alert","alert"],

  // ── .sp ─ words ending in "sp" ──────────────────────────────────────────
  sp: ["crisp","clasp","cusp","gasp","grasp","hasp","lisp","rasp","wasp","wisp"],

  // ── .lf ─ words ending in "lf" ──────────────────────────────────────────
  lf: ["behalf","calf","elf","gulf","half","himself","itself","myself","oneself",
       "ourself","herself","self","shelf","thyself","wolf","yourself","yourself",
       "bookshelf","topshelf"],

  // ── .lm ─ words ending in "lm" ──────────────────────────────────────────
  lm: ["aim","balm","calm","charm","claim","climb","film","film","helm","palm",
       "psalm","qualm","realm","whelm","overwhelm","elm","realm"],

  // ── .lp ─ words ending in "lp" ──────────────────────────────────────────
  lp: ["alp","gulp","help","kelp","pulp","scalp","yelp"],

  // ── .lk ─ words ending in "lk" ──────────────────────────────────────────
  lk: ["bulk","chalk","elk","folk","hulk","milk","silk","skull","stalk","sulk",
       "talk","walk","yolk","balk","caulk","gawk","hawk","squawk"],

  // ── .pt ─ already done above ─────────────────────────────────────────────

  // ── .gn ─ words ending in "gn" ──────────────────────────────────────────
  gn: ["align","assign","benign","campaign","consign","design","deign","feign",
       "foreign","impugn","malign","reign","resign","sign","benign"],

  // ── .gm ─ words ending in "gm" ──────────────────────────────────────────
  gm: ["paradigm","algorithm","diagram","dogma","enigma","pogrom","rhythm","schm","stigma"],

  // ── .gu ─ words ending in "gu" ──────────────────────────────────────────
  gu: ["agu","argu","tigu","shogu","haiku","tofu"],

  // ── .dj ─ words ending in "dj" ──────────────────────────────────────────
  dj: ["hadj","haj","taj","hadj"],

  // ── .gb ─ words ending in "gb" ──────────────────────────────────────────
  gb: ["rgb"],

  // ── Extra coverage for 3-letter TLDs ─────────────────────────────────────

  // ── .bet ─────────────────────────────────────────────────────────────────
  bet: ["abet","gibbet","muppet","cabinet","alphabet","budget","buffet","casket",
        "closet","cornet","cricket","croquet","crochet","droplet","eyelet",
        "facet","gadget","garnet","gibbet","goblet","gullet","hamlet","jacket",
        "junket","locket","magnet","mallet","market","midget","musket","nugget",
        "packet","palette","pamphlet","parquet","pellet","picket","piglet",
        "planet","plucket","pocket","puppet","quet","racket","rivet","rocket",
        "signet","socket","tablet","target","thicket","ticket","triplet",
        "trumpet","turret","velvet","violet","wallet","widget"],

  // ── .bot ─────────────────────────────────────────────────────────────────
  bot: ["robot","abbot","cabot","maggot","fagot","faggot","parrot","carrot",
        "garrot","gavotte","idiot","jackpot","keybot","mascot","patriot",
        "teapot","chariot","hotpot","slipknot","eyespot","inkblot",
        "snapshot","slapshot","gunshot","overshot","buckshot","buckshot"],

  // ── .box ─────────────────────────────────────────────────────────────────
  box: ["mailbox","sandbox","checkbox","dropbox","inbox","toolbox","textbox",
        "jukebox","beatbox","boom","gearbox","icebox","lockbox","lunchbox",
        "mbox","music","outbox","pillbox","squarebox"],

  // ── .bid ─────────────────────────────────────────────────────────────────
  bid: ["forbid","morbid","acid","candid","fluid","insipid","lucid","morbid",
        "placid","putrid","rabid","rapid","rigid","rancid","squalid","stupid",
        "tepid","timid","torrid","turbid","turgid","valid","vivid"],

  // ── .bio ─────────────────────────────────────────────────────────────────
  bio: ["bio","audio","video","studio","stereo","cameo","rodeo","romeo",
        "galileo","igloo","tattoo","voodoo","taboo","bamboo","shampoo",
        "kazoo","yahoo","woo","zoo","nubio","ombio"],

  // ── .buy ─────────────────────────────────────────────────────────────────
  buy: ["guy","buy","guy"],

  // ── .cab ─────────────────────────────────────────────────────────────────
  cab: ["cab"],

  // ── .cal ─────────────────────────────────────────────────────────────────
  cal: ["focal","local","vocal","logical","topical","digital","tropical",
        "musical","medical","radical","typical","magical","physical","ethical",
        "optical","critical","vertical","political","chemical","surgical",
        "classical","identical","technical","clinical","statistical","comical",
        "cynical","lexical","lyrical","nautical","numerical","practical",
        "radical","spherical","theatrical","tropical","whimsical","canonical",
        "chronological","ecological","genealogical","geographical","geological",
        "historical","ideological","illogical","logical","methodological",
        "mythological","neurological","pathological","pharmaceutical",
        "psychological","sociological","symmetrical","technological","theological"],

  // ── .cam ─────────────────────────────────────────────────────────────────
  cam: ["cam","decam","webcam","videocam","bodycam"],

  // ── .amp ─────────────────────────────────────────────────────────────────
  amp: ["amp","clamp","stamp","camp","damp","lamp","ramp","vamp","tramp",
        "revamp","estamp","cramp","champ","champ"],

  // ── .day ─────────────────────────────────────────────────────────────────
  day: ["birthday","everyday","getaway","highway","holiday","mayday","monday",
        "midday","payday","runway","Saturday","someday","subway","sunday",
        "today","weekday","wednesday","wednesday","workday","yesterday","today",
        "display","dismay","array","decay","delay","essay","hooray","relay",
        "repay","replay","splay","spray","stray","survey","today","waylay"],

  // ── .fly ─────────────────────────────────────────────────────────────────
  fly: ["amplify","butterfly","clarify","classify","codify","crucify","dignify",
        "diversify","electrify","falsify","fortify","glorify","gratify","horrify",
        "humidify","identify","intensify","justify","magnify","modify","notify",
        "nullify","ossify","pacify","petrify","qualify","ratify","rectify",
        "satisfy","simplify","solidify","specify","terrify","testify","unify",
        "verify","vilify","quantify","qualify"],

  // ── .pro ─────────────────────────────────────────────────────────────────
  pro: ["pro","repro","retro","nitro","metro","Castro","intro","hydro","euro",
        "electro","macro","micro","micro","micro","gyro","gastro","bistro",
        "astro","crypto"],

  // ── .run ─────────────────────────────────────────────────────────────────
  run: ["run","gun","sun","fun","bun","nun","pun","burn","turn","spurn",
        "churn","learn","pattern","concern","return","govern","modern","saturn",
        "western","eastern"],

  // ── .one ─────────────────────────────────────────────────────────────────
  one: ["alone","backbone","balcony","baritone","bone","capstone","clone",
        "cobblestone","cologne","condone","cornerstone","cyclone","drone",
        "endzone","everyone","flagstone","flintstone","grindstone","groyne",
        "groan","headstone","hormone","hone","keystone","limestone","lone",
        "milestone","monotone","milestone","ozone","phone","prone","saxophone",
        "semitone","silicone","someone","stone","throne","trombone","undertone",
        "zone","atone","bemoan","intone","postpone","postpone","entone"],

  // ── .app ─────────────────────────────────────────────────────────────────
  app: ["app","clapp","dapp","gap","map","nap","rap","sap","tap","yap","zap",
        "scrap","snap","strap","trap","unwrap","recap","overlap","deathtrap",
        "bootstrap","nightcap","hubcap","icecap","kneecap","kneecap","nightcap",
        "taproot","mapcap","snapchat","wraparound"],

  // ── .dot ─────────────────────────────────────────────────────────────────
  dot: ["anecdote","antidote","devote","dilute","dote","idiot","keynote","mascot",
        "patriot","pivot","remote","robot","allot","ballot","cannot","depot",
        "forgot","pivot","plot","promote","remote","revolt","slot","squat",
        "standout","tablot","teapot","topknot","undot"],

  // ── .lab ─────────────────────────────────────────────────────────────────
  lab: ["lab","clab","dab","fab","grab","jab","scab","slab","stab","swap","tab",
        "gab","cab","crab","drab","flab","nab","rehab","vocab","prefab"],

  // ── .map ─────────────────────────────────────────────────────────────────
  map: ["map","clamp","cramp","damp","camp","lamp","ramp","stamp","vamp",
        "tramp","revamp","roadmap","bitmap","heatmap","remap","unmap"],

  // ── .now ─────────────────────────────────────────────────────────────────
  now: ["allow","below","bestow","bow","crow","elbow","flow","follow","glow",
        "grow","know","low","meadow","mellow","overflow","pillow","rainbow",
        "shadow","shallow","show","slow","snow","swallow","tomorrow","throw",
        "widow","willow","window","yellow","anyhow","elbow","furrow","minnow",
        "morrow","narrow","outgrow","overflows","sparrow","sorrow","strow",
        "borrow","burrow","furrow","harrow","marrow","sorrow"],

  // ── .pay ─────────────────────────────────────────────────────────────────
  pay: ["away","birthday","decay","delay","display","Friday","getaway","halfway",
        "highway","holiday","hooray","Monday","overpay","pathway","payday",
        "prepay","relay","repay","runway","Saturday","someday","subway","Sunday",
        "today","underway","waylay","Wednesday","workday","yesterday","array",
        "dismay","essay","halfway","portray","spray","splay","stray","survey"],

  // ── .win ─────────────────────────────────────────────────────────────────
  win: ["win","begin","cabin","captain","coffin","cousin","curtain","darwin",
        "within","herein","latin","margin","martin","muffin","origin","penguin",
        "plain","protein","resin","ruin","sovereign","stallion","stargazin",
        "sunscreen","thin","therein","toxin","train","villain","violin","within",
        "twin","spin","thin","pin","tin","bin","fin","gin","kin","sin","din"],

  // ── .zen ─────────────────────────────────────────────────────────────────
  zen: ["frozen","citizen","dozen","even","given","heaven","haven","kitten",
        "liken","listen","laden","loosen","often","oven","open","proven","riven",
        "risen","seven","taken","tighten","token","waken","widen","wooden",
        "woven","written","citizen","garden","golden","happen","harden","hidden",
        "lengthen","modern","often","pardon","rotten","sudden","sweeten","ten",
        "wren","then","when","yen","den","hen","men","pen"],

  // ── .dev ─────────────────────────────────────────────────────────────────
  dev: [],

  // ── .art ─────────────────────────────────────────────────────────────────
  art: ["apart","art","chart","comfort","concert","convert","court","depart",
        "desert","divert","effort","escort","expert","export","exert","heart",
        "impart","import","insert","inert","overpart","part","smart","start",
        "upstart"],

  // ── .net ─────────────────────────────────────────────────────────────────
  net: ["cabinet","bonnet","bayonet","clarinet","coconut","comet","dragnet",
        "eyelet","fishnet","gourmet","helmet","hornet","internet","jacket",
        "magnet","miniature","nugget","planet","planet","planet","planet",
        "subnet","sonnet","sunset","ernet","annette"],

  // ── .bar ─────────────────────────────────────────────────────────────────
  bar: ["bar","bazaar","guitar","calendar","akbar","similar","circular",
        "familiar","muscular","peculiar","perpendicular","popular","regular",
        "secular","singular","spectacular","stellar","similar","tubular",
        "vascular","vehicular","vascular","spectacular","spectacular"],

  // ── .cat ─────────────────────────────────────────────────────────────────
  cat: ["cat","format","combat","stray","muscat","tomcat","alley","wildcat",
        "acrobat","aristocrat","autocrat","bureaucrat","democrat","diplomat",
        "doormat","habitat","laundromat","photostat","plutocrat","thermostat",
        "technocrat"],

  // ── .fun ─────────────────────────────────────────────────────────────────
  fun: ["fun","gun","sun","bun","nun","pun","run","ton","begun","undone","outgun",
        "outdone","outrun","overrun","rerun","someone","anyone","everyone"],

  // ── Additional 2-letter coverage ──────────────────────────────────────────

  // ── .ow ─ words ending in "ow" ──────────────────────────────────────────
  ow: ["allow","below","bestow","bow","crow","elbow","flow","follow","glow",
       "grow","know","low","meadow","mellow","overflow","pillow","rainbow",
       "shadow","shallow","show","slow","snow","swallow","tomorrow","throw",
       "window","yellow","anyhow","borrow","burrow","elbow","furrow","harrow",
       "marrow","minnow","morrow","narrow","outgrow","sorrow","sparrow",
       "widow","willow","bestow","escrow"],

  // ── .ew ─ words ending in "ew" ──────────────────────────────────────────
  ew: ["blew","brew","chew","clew","crew","dew","drew","few","flew","grew",
       "Hebrew","knew","new","pew","preview","renew","review","screw","shrew",
       "slew","stew","threw","view","withdrew"],

  // ── .aw ─ words ending in "aw" ──────────────────────────────────────────
  aw: ["claw","draw","flaw","gnaw","haw","jaw","law","outlaw","overawe","paw",
       "raw","saw","straw","thaw","withdraw"],

  // ── .oy ─ words ending in "oy" ──────────────────────────────────────────
  oy: ["annoy","boy","convoy","cowboy","coy","decoy","deploy","destroy","employ",
       "enjoy","envoy","joy","loyalty","ploy","Roy","soy","toy","troy","viceroy"],

  // ── .ey ─ words ending in "ey" ──────────────────────────────────────────
  ey: ["abbey","alley","attorney","barley","chimney","donkey","galley","gulley",
       "hockey","honey","journey","jockey","jockey","kidney","key","monkey",
       "money","oakley","parsley","parsley","pulley","survey","turkey","valley",
       "volley","whiskey"],

  // ── .uy ─ words ending in "uy" ──────────────────────────────────────────
  uy: ["buy","guy","ensway"],

  // ── .ix ─ words ending in "ix" ──────────────────────────────────────────
  ix: ["affix","appendix","crucifix","fix","helix","matrix","mix","prefix",
       "radix","six","suffix","unix","vortex","complex","index","perplex",
       "reflex","remix"],

  // ── .ox ─ words ending in "ox" ──────────────────────────────────────────
  ox: ["box","fox","lox","ox","pox","sox","botox","equinox","detox","feedstock",
       "orthodox","paradox","smallpox","unorthodox","chickenpox","heterodox"],

  // ── .ex ─ words ending in "ex" ──────────────────────────────────────────
  ex: ["annex","apex","complex","convex","cortex","duplex","flex","hex","index",
       "latex","perplex","reflex","regex","remix","sex","sex","simplex","vertex",
       "vortex","flex","sex","tex"],

  // ── .ux ─ words ending in "ux" ──────────────────────────────caregiving
  ux: ["crux","flux","influx","linux","lux","lux","ux"],

  // ── .ry ─ words ending in "ry" ──────────────────────────────────────────
  ry: ["bakery","battery","brewery","bribery","burglary","butchery","carpentry",
       "century","chemistry","chivalry","commentary","contrary","country",
       "cutlery","delivery","discovery","directory","documentary","dormitory",
       "boundary","bravery","bravery","bribery","cajolery","calligraphy",
       "carpentry","category","cavalry","celery","century","chemistry","chivalry",
       "circuitry","commentary","company","contrary","country","cutlery",
       "delivery","democracy","dentistry","depravity","diary","dictionary",
       "directory","discovery","documentary","dormitory","drudgery","dupery",
       "elderly","embroidery","emery","enquiry","entry","every","factory",
       "fairly","fairy","fancy","ferry","fiery","flattery","flippery",
       "foundry","fury","gallery","gentry","glory","glossary","grocery",
       "history","hosiery","imagery","infantry","injury","ivory","jewelry",
       "joinery","judiciary","laundry","library","lottery","luxury","memory",
       "mercury","military","ministry","misery","mockery","monastery","mystery",
       "nunnery","oratory","ornatery","pantry","pastry","perjury","pharmacy",
       "pillory","poetry","poultry","pottery","poverty","recovery","revelry",
       "rockery","savoury","scenery","secretary","sentry","silvery","slavery",
       "slippery","sorcery","story","surgery","symmetry","territory","theory",
       "toiletry","treasury","trickery","understory","upholstery","usury",
       "tapestry","veterinary","victory","villainy","weaponry","embroidery",
       "wizardry","wolverinely","winery","woodenly","wordlessly"],

  // ── .ty ─ words ending in "ty" ──────────────────────────────────────────
  ty: ["ability","activity","anxiety","beauty","capacity","charity","city",
       "clarity","community","county","creativity","cruelty","curiosity",
       "deity","density","dignity","diversity","duty","electricity","empty",
       "equality","eternity","facility","faculty","familiarity","fatality",
       "fertility","ferocity","festivity","fidelity","flexibility","fluency",
       "formality","fraternity","generosity","gravity","guilty","humanity",
       "humility","identity","immunity","inability","infinity","insanity",
       "integrity","intensity","intimacy","invisibility","laxity","legality",
       "liberty","longevity","loyalty","majority","maternity","mediocrity",
       "mentality","minority","morality","mortality","municipality","nativity",
       "necessity","neutrality","novelty","obesity","opportunity","party",
       "penalty","personality","plurality","purity","quality","quantity",
       "rapidity","rarity","reality","responsibility","scarcity","security",
       "sensitivity","simplicity","sincerity","society","specialty","spontaneity",
       "stability","tenacity","unity","university","utility","validity","vanity",
       "variety","velocity","vicinity","virility","visibility","vitality",
       "vulnerability","witty","empty","misty","dusty","frosty","hasty",
       "nasty","tasty","trusty","lusty","rusty","crusty","gusty"],

  // ── .vy ─ words ending in "vy" ──────────────────────────────────────────
  vy: ["gravy","navy","davy","envy","heavy","ivy","levy","privy","savvy","wavy"],

  // ── .my ─ words ending in "my" ──────────────────────────────────────────
  my: ["academy","alchemy","anatomy","army","astronomy","balcony","bigamy",
       "botany","calumny","ceremony","company","economy","enemy","harmony",
       "homonymy","infamy","matrimony","monotony","parsimony","polygamy",
       "sanctimony","symphony","taxonomy","testimony","tyranny","villainy",
       "astronomy","botany","astronomy","harmony","symphony","agronomy",
       "ceremony","eulogy","economy","harmony","homogamy","infamy","matrimony"],

  // ── .gy ─ words ending in "gy" ──────────────────────────────────────────
  gy: ["analogy","apology","archaeology","astrology","audiology","biology",
       "cardiology","chronology","climatology","criminology","dermatology",
       "ecology","epidemiology","etymology","genealogy","geology","ideology",
       "immunology","methodology","mineralogy","mythology","neurology",
       "oncology","ophthalmology","ornithology","pathology","pharmacology",
       "physiology","psychology","radiology","sociology","theology","zoology",
       "strategy","energy","allergy","clergy","eulogy","ergy","prodigy",
       "technology","theology","trilogy"],
};
