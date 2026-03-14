// Lightweight heuristics shared by WHOIS/RDAP parsing.

export function looksLikeNotFoundWhois(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t) return false;

  const patterns: RegExp[] = [
    /no whois data was found/i,
    /no match for/i,
    /not found/i,
    /no entries found/i,
    /domain not found/i,
    /no information available/i,
    /status:\s*available/i,
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
    /no match/i,
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
    /^% this is the .+ whois.*\n% .*\n%\s*$/im,
    /query_status:\s*220\s+available/i,
    /status:\s*free/i,
    /status:\s*not registered/i,
    /dominio libre/i,
    /domaine disponible/i,
    /^% object not found/im,
    /domain status:\s*available/i,
    /^%error:\s*101/im,
    // Freenom系列
    /your request cannot be processed/i,
    /invalid domain name/i,
    /no domain exists/i,
    /domain is not registered/i,
    // 法语非洲
    /aucun résultat/i,
    /pas de résultat/i,
    /non enregistré/i,
    // 更多语言/格式支持
    /nie znaleziono/i,           // 波兰语: not found
    /nicht gefunden/i,            // 德语: not found
    /niet gevonden/i,             // 荷兰语: not found
    /ikke funnet/i,               // 挪威语: not found
    /ei löydy/i,                  // 芬兰语: not found
    /未查到/i,
    /该域名.*?可以注册/i,
    /此域名.*?可以注册/i,
    /domain.*?not registered/i,
    /not registered/i,
    /free to register/i,
    /available to register/i,
    /^no data returned$/im,
    /registration status:\s*available/i,
    /^$ empty/im,
    /This domain name has not been registered/i,
    /The domain has not been registered/i,
    /The domain .+ is available/i,
    /domain is free/i,
    /is available for purchase/i,
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

  if (looksLikeNotFoundWhois(text)) return false;

  // Reserved domains are registered (held by registry)
  if (looksLikeReserved(text)) return true;

  const registeredIndicators = [
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
    /status:\s*(?:active|ok|live|registered|delegated)/i,
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
