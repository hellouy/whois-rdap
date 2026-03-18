// Lightweight heuristics shared by WHOIS/RDAP parsing.

/**
 * Strong positive signals that prove a domain IS registered.
 * When ≥2 of these match, we trust registration even if "not found" text appears.
 */
const STRONG_POSITIVE_PATTERNS: RegExp[] = [
  /creation date\s*:/i,
  /created\s*:/i,
  /registered\s*:\s*\d{2}/i,           // "Registered: 2020-..."
  /domain registered\s*:/i,
  /registration date\s*:/i,
  /registry expiry date\s*:/i,
  /expir(?:y|ation) date\s*:/i,
  /expiration time\s*:/i,
  /paid-till\s*:/i,
  /valid until\s*:/i,
  /renewal date\s*:/i,
  /name\s*server\s*:\s*\S+\.\S+/i,
  /nserver\s*:\s*\S+\.\S+/i,
  /registrar\s*:\s*\S/i,
  /sponsoring registrar\s*:/i,
  /domain status\s*:\s*(?:active|ok|live|clienttransferprohibited|clientupdateprohibited|clientdeleteprohibited|serverdeleteprohibited)/i,
  /status\s*:\s*(?:active|ok|live|registered|delegated)/i,
  /registered\s*:\s*yes/i,
  /registration status\s*:\s*(?:active|registered|ok)/i,
  /\[登録年月日\]/i,           // JP
  /\[有効期限\]/i,              // JP
  /\[name server\]/i,           // JP
  /paid-till\s*:/i,             // RU
  /state\s*:\s*\S/i,            // RU
  /expiry\s*:\s*\d{4}/i,
  /holder\s*:/i,
  /titular\s*:/i,               // ES/PT
];

export function hasClearRegistrationSignals(text: string): boolean {
  return STRONG_POSITIVE_PATTERNS.filter(p => p.test(text)).length >= 2;
}

export function looksLikeNotFoundWhois(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t) return false;

  // If there are strong positive registration signals, don't flag as "not found"
  if (hasClearRegistrationSignals(text)) return false;

  const patterns: RegExp[] = [
    /no whois data was found/i,
    /no match for/i,
    /^%?\s*no match/im,
    /no entries found/i,
    /domain not found/i,
    /no information available/i,
    /is free/i,
    /available for registration/i,
    /no data found/i,
    /object does not exist/i,
    /unknown domain/i,
    /domain name not known/i,
    /no existe/i,
    /没有找到/i,
    /未注册/i,
    /该域名未被注册/i,
    /this domain is available/i,
    /nothing found/i,
    /the queried object does not exist/i,
    /domain(.+)is available/i,
    /^%.*?no data/im,
    /domaine non trouvé/i,
    /domaine libre/i,
    /keine einträge gefunden/i,
    /ドメインが見つかりません/i,
    /domain is available for registration/i,
    /no record found/i,
    /^% no such domain/im,
    /query_status:\s*220\s+available/i,
    /^status:\s*free$/im,
    /^status:\s*not registered$/im,
    /dominio libre/i,
    /domaine disponible/i,
    /^%\s*object not found/im,
    /^domain status:\s*available$/im,
    /^%error:\s*101/im,
    /your request cannot be processed/i,
    /invalid domain name/i,
    /no domain exists/i,
    // More specific "domain is not registered" variants (not just "not registered")
    /this domain is not registered/i,
    /domain is not registered/i,
    /this domain name has not been registered/i,
    /the domain has not been registered/i,
    /the domain .+ is available/i,
    /domain is free/i,
    /is available for purchase/i,
    // French African
    /aucun résultat/i,
    /pas de résultat/i,
    /non enregistré/i,
    // Multi-language "not found"
    /nie znaleziono/i,
    /nicht gefunden/i,
    /niet gevonden/i,
    /ikke funnet/i,
    /ei löydy/i,
    /未查到/i,
    /该域名.*?可以注册/i,
    /此域名.*?可以注册/i,
    /free to register/i,
    /available to register/i,
    /^no data returned$/im,
    /^registration status:\s*available$/im,
    /^% empty/im,
  ];

  return patterns.some((p) => p.test(t));
}

/**
 * Detect reserved/hold status that indicates registered-but-not-active
 */
export function looksLikeReserved(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t) return false;
  const patterns: RegExp[] = [
    /status:\s*reserved/i,
    /reserved by/i,
    /domain reserved/i,
    /registry reserved/i,
    /\breserved\b/i,
  ];
  return patterns.some(p => p.test(t));
}

/**
 * 从 WHOIS 原始文本中提取注册状态的辅助判断
 */
export function inferRegisteredFromWhois(text: string): boolean | null {
  if (!text) return null;

  // ── Step 1: Strong positive signals take priority ─────────────────────────
  // If ≥2 clear registration signals exist, it's registered regardless of other text.
  if (hasClearRegistrationSignals(text)) return true;

  // ── Step 2: Check for unambiguous "not found" language ───────────────────
  if (looksLikeNotFoundWhois(text)) return false;

  // ── Step 3: Reserved domains are registered ───────────────────────────────
  if (looksLikeReserved(text)) return true;

  // ── Step 4: Broader registration indicators ───────────────────────────────
  const registeredIndicators: RegExp[] = [
    /domain name:/i,
    /registr(?:ar|ant)/i,
    /name\s*server/i,
    /nserver/i,
    /creation date/i,
    /created:/i,
    /expir/i,
    /registrar:/i,
    /holder:/i,
    /owner:/i,
    /titular:/i,
    /contact:/i,
    /admin-c:/i,
    /tech-c:/i,
    /billing-c:/i,
    /handle:/i,
    /nic-hdl:/i,
    /domain:/i,
    /organisation:/i,
    /organization:/i,
    /address:/i,
    /phone:/i,
    /e-mail:/i,
    /paid-till:/i,
    /state:/i,
    /sponsoring registrar:/i,
    /domain id:/i,
    /roid:/i,
    /registry domain id:/i,
    /registrar iana id:/i,
    /dnssec:/i,
    /status:\s*(?:active|ok|live|registered|delegated|connect)/i,
    /registered:\s*yes/i,
    /registration status:\s*(?:active|registered)/i,
  ];

  const matchCount = registeredIndicators.filter(p => p.test(text)).length;
  if (matchCount >= 2) return true;

  return null;
}

/**
 * 标准化注册人/注册商名称，过滤掉常见的隐私保护文本
 */
export function sanitizeRegistrantName(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const privacyPatterns = [
    /redacted/i, /privacy/i, /protected/i, /withheld/i,
    /not disclosed/i, /data protected/i, /gdpr/i, /private/i,
    /contact privacy/i, /whoisguard/i, /domains by proxy/i,
    /perfect privacy/i, /masked/i, /hidden/i, /confidential/i,
    /n\/a/i, /not available/i, /not shown/i, /registry customer/i,
  ];
  if (privacyPatterns.some(p => p.test(name))) return undefined;
  return name.trim() || undefined;
}
