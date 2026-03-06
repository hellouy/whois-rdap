// Lightweight heuristics shared by WHOIS/RDAP parsing.

export function looksLikeNotFoundWhois(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t) return false;

  // Common patterns across ccTLD / gTLD WHOIS pages and proxies.
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
    // 非洲 ccTLD 特有
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
    // Freenom系列 (.gq .cf .ga .ml .tk)
    /your request cannot be processed/i,
    /invalid domain name/i,
    /no domain exists/i,
    /domain is not registered/i,
    // 法语非洲
    /aucun résultat/i,
    /pas de résultat/i,
    /non enregistré/i,
  ];

  return patterns.some((p) => p.test(t));
}

/**
 * 从 WHOIS 原始文本中提取注册状态的辅助判断
 * 用于缺乏标准字段的冷门 ccTLD
 */
export function inferRegisteredFromWhois(text: string): boolean | null {
  if (!text) return null;
  
  // 如果文本包含典型的注册信息字段，推断为已注册
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
  ];
  
  const matchCount = registeredIndicators.filter(p => p.test(text)).length;
  if (matchCount >= 2) return true;
  
  if (looksLikeNotFoundWhois(text)) return false;
  
  return null;
}
