// TLD category classifications for tag cloud filtering

// By continent/region
export const TLD_CATEGORIES: Record<string, { label: string; emoji: string; tlds: string[] }> = {
  all: {
    label: "全部",
    emoji: "🌍",
    tlds: [], // special: means no filter
  },
  asia: {
    label: "亚洲",
    emoji: "🌏",
    tlds: [
      ".cn", ".jp", ".kr", ".in", ".id", ".my", ".sg", ".th", ".vn", ".ph",
      ".pk", ".bd", ".lk", ".np", ".mm", ".kh", ".la", ".hk", ".tw", ".mo",
      ".mn", ".kz", ".uz", ".tm", ".kg", ".tj", ".az", ".ge", ".am",
      ".af", ".iq", ".ir", ".il", ".jo", ".kw", ".lb", ".om", ".qa",
      ".sa", ".ae", ".ye", ".sy", ".ps", ".bh", ".bn", ".bt", ".fj",
      ".ki", ".mh", ".mv", ".nu", ".nz", ".au", ".sb", ".to", ".tv",
      ".vu", ".ws", ".cc", ".cx", ".tk", ".fm", ".pw", ".as",
    ],
  },
  europe: {
    label: "欧洲",
    emoji: "🇪🇺",
    tlds: [
      ".eu", ".de", ".fr", ".it", ".es", ".pt", ".nl", ".be", ".lu",
      ".at", ".ch", ".li", ".uk", ".ie", ".is", ".no", ".se", ".fi",
      ".dk", ".pl", ".cz", ".sk", ".hu", ".ro", ".bg", ".hr", ".si",
      ".ba", ".rs", ".me", ".mk", ".al", ".gr", ".tr", ".cy", ".mt",
      ".ee", ".lv", ".lt", ".ua", ".by", ".md", ".ru", ".su",
      ".gg", ".je", ".im", ".gi", ".fo", ".ax", ".sj",
      ".mc", ".sm", ".va",
    ],
  },
  americas: {
    label: "美洲",
    emoji: "🌎",
    tlds: [
      ".us", ".ca", ".mx", ".br", ".ar", ".cl", ".co", ".pe", ".ve",
      ".ec", ".bo", ".py", ".uy", ".gy", ".sr", ".gf",
      ".cu", ".do", ".ht", ".jm", ".tt", ".bb", ".bs", ".bz",
      ".cr", ".gt", ".hn", ".ni", ".pa", ".sv",
      ".ag", ".dm", ".gd", ".kn", ".lc", ".vc",
      ".pr", ".vi", ".aw", ".bq", ".cw", ".sx",
      ".ai", ".bm", ".ky", ".ms", ".tc", ".vg",
      ".pm", ".bl", ".mf", ".gp", ".mq",
      ".fk", ".gs",
    ],
  },
  africa: {
    label: "非洲",
    emoji: "🌍",
    tlds: [
      ".za", ".ng", ".ke", ".et", ".gh", ".tz", ".ug", ".rw",
      ".cm", ".ci", ".sn", ".ml", ".bf", ".ne", ".tg", ".bj",
      ".ga", ".cg", ".cd", ".gq", ".cf", ".td", ".ao", ".mz",
      ".mg", ".mu", ".sc", ".re", ".yt", ".km", ".dj", ".er",
      ".so", ".sd", ".ss", ".eg", ".ly", ".tn", ".dz", ".ma",
      ".eh", ".mr", ".gm", ".gw", ".sl", ".lr", ".cv",
      ".st", ".bi", ".bw", ".ls", ".sz", ".na", ".zm", ".zw",
      ".mw",
    ],
  },
  tech: {
    label: "科技",
    emoji: "💻",
    tlds: [
      ".app", ".dev", ".tech", ".io", ".ai", ".code", ".software",
      ".systems", ".network", ".hosting", ".cloud", ".data", ".digital",
      ".online", ".site", ".web", ".page", ".link", ".click",
      ".download", ".stream", ".email", ".chat", ".social",
      ".ml", ".analytics",
    ],
  },
  business: {
    label: "商业",
    emoji: "💼",
    tlds: [
      ".com", ".co", ".biz", ".company", ".business", ".enterprises",
      ".solutions", ".services", ".consulting", ".management",
      ".marketing", ".agency", ".studio", ".design", ".media",
      ".finance", ".fund", ".money", ".bank", ".capital",
      ".invest", ".trading", ".exchange", ".insurance",
      ".work", ".jobs", ".career", ".team", ".store", ".shop",
      ".sale", ".deals", ".supply", ".tools",
    ],
  },
  creative: {
    label: "创意",
    emoji: "🎨",
    tlds: [
      ".art", ".design", ".studio", ".gallery", ".photo", ".camera",
      ".film", ".movie", ".video", ".audio", ".music", ".game",
      ".games", ".play", ".fun", ".cool", ".style", ".fashion",
      ".beauty", ".dance", ".blog", ".press", ".news",
      ".book", ".review", ".guide",
    ],
  },
};

// Hackable ccTLDs (short, common endings in English)
export const HACKABLE_TLDS = [
  ".io", ".ai", ".co", ".me", ".ly", ".is", ".it", ".us", ".am", ".be",
  ".es", ".in", ".rs", ".re", ".al", ".at", ".ch", ".de", ".id", ".im",
  ".la", ".ng", ".no", ".nu", ".sh", ".so", ".st", ".to", ".tv",
  ".er", ".ge", ".se", ".ve", ".pe", ".ne", ".ke", ".le",
  ".ar", ".or", ".an", ".en", ".on", ".ur", ".ad", ".ed",
  ".ag", ".og", ".ig", ".ug", ".as", ".os", ".th", ".ph",
  ".gy", ".ky", ".my", ".py", ".sy", ".ee", ".ie", ".do",
  ".fi", ".li", ".ni", ".si", ".bi", ".bo", ".co", ".ro",
  ".ht", ".et", ".il", ".au", ".eu", ".gg", ".yt",
];
