/**
 * DomainLabelManager — i18n smart label system
 *
 * Pure functions only. No React, no side-effects.
 * All date inputs are formatted Chinese strings ("2020年5月14日 08:07:31")
 * as produced by whois-client.ts formatDate(), OR ISO strings from raw data.
 */

export interface DomainLabel {
  key: string;
  zh: string;
  en: string;
  severity: "info" | "warning" | "error";
  icon: string;
}

export interface DomainLabelResult {
  labels: DomainLabel[];
  primaryLabel: DomainLabel | null;
}

// ── Date parsing ──────────────────────────────────────────────────────────────

/**
 * Parse a date string that may be in Chinese format ("2020年5月14日 08:07:31")
 * or standard ISO/US format. Returns null if unparseable.
 */
export function parseDomainDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const s = dateStr.trim();

  // Chinese format: "2020年5月14日 08:07:31" or "2020年5月14日"
  const chineseMatch = s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s+(\d{2}):(\d{2}):(\d{2}))?/);
  if (chineseMatch) {
    const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = chineseMatch;
    const date = new Date(
      parseInt(y), parseInt(mo) - 1, parseInt(d),
      parseInt(hh), parseInt(mm), parseInt(ss)
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Standard ISO / RFC formats
  const date = new Date(s);
  if (!isNaN(date.getTime())) return date;

  return null;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;
const YEAR   = 365 * DAY;

// ── Pure predicate functions ──────────────────────────────────────────────────

/**
 * T1-A: Domain expires within 30 days (and is not already expired).
 */
export function isExpiringSoon(expirationDate: string | undefined): boolean {
  const exp = parseDomainDate(expirationDate);
  if (!exp) return false;
  const diff = exp.getTime() - Date.now();
  return diff > 0 && diff <= 30 * DAY;
}

/**
 * T1-B: Domain was last updated more than 1 year ago.
 */
export function isLongTermInactive(updatedDate: string | undefined): boolean {
  const upd = parseDomainDate(updatedDate);
  if (!upd) return false;
  return Date.now() - upd.getTime() > YEAR;
}

/**
 * T1-C: Domain was updated within the last 7 days.
 */
export function isFreshlyUpdated(updatedDate: string | undefined): boolean {
  const upd = parseDomainDate(updatedDate);
  if (!upd) return false;
  return Date.now() - upd.getTime() <= 7 * DAY;
}

/**
 * T1-D: Domain was registered more than 10 years ago.
 */
export function isLegacyDomain(creationDate: string | undefined): boolean {
  const created = parseDomainDate(creationDate);
  if (!created) return false;
  return Date.now() - created.getTime() > 10 * YEAR;
}

/**
 * T1-E: Domain has already expired.
 */
export function isExpired(expirationDate: string | undefined): boolean {
  const exp = parseDomainDate(expirationDate);
  if (!exp) return false;
  return exp.getTime() < Date.now();
}

/**
 * T1-F: Domain expires within 90 days (but more than 30).
 */
export function isExpiringThisQuarter(expirationDate: string | undefined): boolean {
  const exp = parseDomainDate(expirationDate);
  if (!exp) return false;
  const diff = exp.getTime() - Date.now();
  return diff > 30 * DAY && diff <= 90 * DAY;
}

// ── Label builder (i18n) ──────────────────────────────────────────────────────

const LABEL_DEFS: Array<{
  key: string;
  zh: string;
  en: string;
  severity: DomainLabel["severity"];
  icon: string;
  check: (d: DomainDateInput) => boolean;
}> = [
  {
    key: "expired",
    zh: "已过期",
    en: "Expired",
    severity: "error",
    icon: "⚠️",
    check: (d) => isExpired(d.expirationDate),
  },
  {
    key: "expiring-soon",
    zh: "即将过期",
    en: "Expiring Soon",
    severity: "warning",
    icon: "⏳",
    check: (d) => isExpiringSoon(d.expirationDate),
  },
  {
    key: "expiring-quarter",
    zh: "三月内到期",
    en: "Expiring This Quarter",
    severity: "warning",
    icon: "📅",
    check: (d) => isExpiringThisQuarter(d.expirationDate),
  },
  {
    key: "freshly-updated",
    zh: "近期更新",
    en: "Freshly Updated",
    severity: "info",
    icon: "✨",
    check: (d) => isFreshlyUpdated(d.updatedDate),
  },
  {
    key: "long-term-inactive",
    zh: "长期未更新",
    en: "Long-term Inactive",
    severity: "warning",
    icon: "💤",
    check: (d) => isLongTermInactive(d.updatedDate),
  },
  {
    key: "legacy-domain",
    zh: "老牌域名",
    en: "Legacy Domain",
    severity: "info",
    icon: "🏛️",
    check: (d) => isLegacyDomain(d.creationDate),
  },
];

export interface DomainDateInput {
  creationDate?: string;
  expirationDate?: string;
  updatedDate?: string;
}

/**
 * Compute all applicable i18n labels for a domain based on its timestamps.
 * Returns labels in priority order (error → warning → info).
 * primaryLabel is the highest-severity label, or null if none apply.
 */
export function getDomainLabels(dates: DomainDateInput): DomainLabelResult {
  const labels: DomainLabel[] = LABEL_DEFS
    .filter((def) => def.check(dates))
    .map(({ key, zh, en, severity, icon }) => ({ key, zh, en, severity, icon }));

  const primary =
    labels.find((l) => l.severity === "error") ||
    labels.find((l) => l.severity === "warning") ||
    labels.find((l) => l.severity === "info") ||
    null;

  return { labels, primaryLabel: primary };
}

/**
 * Get a single localized label string given a key and locale.
 */
export function getLabelText(label: DomainLabel, locale: "zh" | "en" = "zh"): string {
  return locale === "en" ? label.en : label.zh;
}
