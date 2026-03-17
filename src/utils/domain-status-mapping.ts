/**
 * DomainStatusRegistry — EPP status taxonomy
 *
 * Provides bilingual (Chinese + English) labels, category classification,
 * severity levels, and an `isActionRequired` flag for statuses that need
 * immediate attention (locked/disputed/redemption etc.).
 *
 * Pure functions only — no UI, no React.
 */

export interface StatusInfo {
  chinese: string;
  english: string;
  description: string;
  category: "normal" | "hold" | "transfer" | "renew" | "delete" | "grace" | "pending" | "lock" | "other";
  severity: "info" | "warning" | "error";
  isActionRequired: boolean;
}

// ── 100+ EPP Status Registry ──────────────────────────────────────────────────
export const STATUS_MAPPING: Record<string, StatusInfo> = {
  // ========== 正常状态 ==========
  "ok": { chinese: "正常", english: "OK", description: "域名处于正常状态", category: "normal", severity: "info", isActionRequired: false },
  "active": { chinese: "活跃", english: "Active", description: "域名正常活跃", category: "normal", severity: "info", isActionRequired: false },
  "live": { chinese: "正常", english: "Live", description: "域名在线运行", category: "normal", severity: "info", isActionRequired: false },
  "inactive": { chinese: "非活跃", english: "Inactive", description: "域名不活跃", category: "other", severity: "warning", isActionRequired: false },

  // ========== Hold 暂停状态 ==========
  "clienthold": { chinese: "客户端暂停", english: "Client Hold", description: "注册商设置暂停解析", category: "hold", severity: "error", isActionRequired: true },
  "serverhold": { chinese: "服务器暂停", english: "Server Hold", description: "注册局设置暂停解析", category: "hold", severity: "error", isActionRequired: true },
  "hold": { chinese: "暂停", english: "Hold", description: "域名暂停解析", category: "hold", severity: "error", isActionRequired: true },
  "registrarhold": { chinese: "注册商暂停", english: "Registrar Hold", description: "注册商设置暂停", category: "hold", severity: "error", isActionRequired: true },
  "registryhold": { chinese: "注册局暂停", english: "Registry Hold", description: "注册局设置暂停", category: "hold", severity: "error", isActionRequired: true },
  "legalhold": { chinese: "法律暂停", english: "Legal Hold", description: "因法律原因暂停", category: "hold", severity: "error", isActionRequired: true },
  "disputehold": { chinese: "争议暂停", english: "Dispute Hold", description: "域名争议暂停", category: "hold", severity: "error", isActionRequired: true },
  "fraudhold": { chinese: "欺诈暂停", english: "Fraud Hold", description: "因欺诈暂停", category: "hold", severity: "error", isActionRequired: true },
  "abusehold": { chinese: "滥用暂停", english: "Abuse Hold", description: "因滥用暂停", category: "hold", severity: "error", isActionRequired: true },
  "internalhold": { chinese: "内部暂停", english: "Internal Hold", description: "内部原因暂停", category: "hold", severity: "error", isActionRequired: false },

  // ========== 转移相关状态 ==========
  "clienttransferprohibited": { chinese: "禁止转移(客户端)", english: "Client Transfer Prohibited", description: "注册商禁止转移", category: "lock", severity: "info", isActionRequired: false },
  "servertransferprohibited": { chinese: "禁止转移(服务器)", english: "Server Transfer Prohibited", description: "注册局禁止转移", category: "lock", severity: "info", isActionRequired: false },
  "transferprohibited": { chinese: "禁止转移", english: "Transfer Prohibited", description: "域名禁止转移", category: "lock", severity: "info", isActionRequired: false },
  "pendingtransfer": { chinese: "转移处理中", english: "Pending Transfer", description: "域名正在转移", category: "transfer", severity: "warning", isActionRequired: false },
  "transferstarted": { chinese: "转移已启动", english: "Transfer Started", description: "转移流程已开始", category: "transfer", severity: "warning", isActionRequired: false },
  "transfercompleted": { chinese: "转移完成", english: "Transfer Completed", description: "转移已完成", category: "transfer", severity: "info", isActionRequired: false },
  "transferrejected": { chinese: "转移被拒", english: "Transfer Rejected", description: "转移请求被拒绝", category: "transfer", severity: "warning", isActionRequired: true },
  "transfercancelled": { chinese: "转移取消", english: "Transfer Cancelled", description: "转移已取消", category: "transfer", severity: "info", isActionRequired: false },
  "transferapproved": { chinese: "转移已批准", english: "Transfer Approved", description: "转移请求已批准", category: "transfer", severity: "info", isActionRequired: false },
  "transferrequested": { chinese: "转移已请求", english: "Transfer Requested", description: "转移已请求", category: "transfer", severity: "warning", isActionRequired: false },
  "transferperiod": { chinese: "转移宽限期", english: "Transfer Period", description: "转移后宽限期", category: "grace", severity: "info", isActionRequired: false },

  // ========== 续费相关状态 ==========
  "clientrenewprohibited": { chinese: "禁止续费(客户端)", english: "Client Renew Prohibited", description: "注册商禁止续费", category: "lock", severity: "warning", isActionRequired: true },
  "serverrenewprohibited": { chinese: "禁止续费(服务器)", english: "Server Renew Prohibited", description: "注册局禁止续费", category: "lock", severity: "warning", isActionRequired: true },
  "renewprohibited": { chinese: "禁止续费", english: "Renew Prohibited", description: "域名禁止续费", category: "lock", severity: "warning", isActionRequired: true },
  "pendingrenew": { chinese: "续费处理中", english: "Pending Renew", description: "续费请求处理中", category: "renew", severity: "info", isActionRequired: false },
  "autorenew": { chinese: "自动续费", english: "Auto Renew", description: "已设置自动续费", category: "renew", severity: "info", isActionRequired: false },
  "autorenewperiod": { chinese: "自动续费期", english: "Auto Renew Period", description: "自动续费宽限期", category: "grace", severity: "info", isActionRequired: false },
  "renewperiod": { chinese: "续费宽限期", english: "Renew Period", description: "续费后宽限期", category: "grace", severity: "info", isActionRequired: false },
  "noautorenew": { chinese: "未自动续费", english: "No Auto Renew", description: "未设置自动续费", category: "renew", severity: "warning", isActionRequired: false },

  // ========== 删除相关状态 ==========
  "clientdeleteprohibited": { chinese: "禁止删除(客户端)", english: "Client Delete Prohibited", description: "注册商禁止删除", category: "lock", severity: "info", isActionRequired: false },
  "serverdeleteprohibited": { chinese: "禁止删除(服务器)", english: "Server Delete Prohibited", description: "注册局禁止删除", category: "lock", severity: "info", isActionRequired: false },
  "deleteprohibited": { chinese: "禁止删除", english: "Delete Prohibited", description: "域名禁止删除", category: "lock", severity: "info", isActionRequired: false },
  "pendingdelete": { chinese: "待删除", english: "Pending Delete", description: "域名即将删除", category: "delete", severity: "error", isActionRequired: true },
  "pendingdeletion": { chinese: "等待删除", english: "Pending Deletion", description: "域名等待删除", category: "delete", severity: "error", isActionRequired: true },
  "scheduledfordeletion": { chinese: "计划删除", english: "Scheduled for Deletion", description: "域名计划删除", category: "delete", severity: "error", isActionRequired: true },
  "pendingdeleterestorable": { chinese: "删除可恢复", english: "Pending Delete (Restorable)", description: "待删除但可恢复", category: "delete", severity: "error", isActionRequired: true },
  "pendingdeletescheduled": { chinese: "删除已计划", english: "Pending Delete (Scheduled)", description: "删除已安排", category: "delete", severity: "error", isActionRequired: true },

  // ========== 更新相关状态 ==========
  "clientupdateprohibited": { chinese: "禁止更新(客户端)", english: "Client Update Prohibited", description: "注册商禁止更新", category: "lock", severity: "info", isActionRequired: false },
  "serverupdateprohibited": { chinese: "禁止更新(服务器)", english: "Server Update Prohibited", description: "注册局禁止更新", category: "lock", severity: "info", isActionRequired: false },
  "updateprohibited": { chinese: "禁止更新", english: "Update Prohibited", description: "域名禁止更新", category: "lock", severity: "info", isActionRequired: false },
  "pendingupdate": { chinese: "更新处理中", english: "Pending Update", description: "更新请求处理中", category: "pending", severity: "info", isActionRequired: false },
  "pendingupdates": { chinese: "待更新", english: "Pending Updates", description: "等待更新", category: "pending", severity: "info", isActionRequired: false },

  // ========== 宽限期状态 ==========
  "addperiod": { chinese: "AGP宽限期", english: "Add Grace Period", description: "新注册宽限期(5天)", category: "grace", severity: "info", isActionRequired: false },
  "redemptionperiod": { chinese: "赎回期", english: "Redemption Period", description: "域名赎回期(30天)", category: "grace", severity: "error", isActionRequired: true },
  "pendingrestore": { chinese: "恢复处理中", english: "Pending Restore", description: "域名恢复请求处理中", category: "grace", severity: "warning", isActionRequired: false },
  "graceperiod": { chinese: "宽限期", english: "Grace Period", description: "域名宽限期内", category: "grace", severity: "info", isActionRequired: false },

  // ========== 审核和申请状态 ==========
  "pending": { chinese: "待处理", english: "Pending", description: "请求待处理", category: "pending", severity: "warning", isActionRequired: false },
  "pendingapplication": { chinese: "申请待审核", english: "Application Pending", description: "注册申请待审核", category: "pending", severity: "warning", isActionRequired: false },
  "applicationpending": { chinese: "申请待审核", english: "Application Pending", description: "注册申请待审核", category: "pending", severity: "warning", isActionRequired: false },
  "underevaluation": { chinese: "评估中", english: "Under Evaluation", description: "正在评估", category: "pending", severity: "warning", isActionRequired: false },
  "underreview": { chinese: "审核中", english: "Under Review", description: "正在审核", category: "pending", severity: "warning", isActionRequired: false },
  "awaitingapproval": { chinese: "等待批准", english: "Awaiting Approval", description: "等待批准", category: "pending", severity: "warning", isActionRequired: false },
  "pendingcreate": { chinese: "等待创建", english: "Pending Create", description: "创建请求处理中", category: "pending", severity: "info", isActionRequired: false },
  "pendingverification": { chinese: "等待验证", english: "Pending Verification", description: "等待验证完成", category: "pending", severity: "warning", isActionRequired: true },

  // ========== 验证状态 ==========
  "registrantverificationlocked": { chinese: "注册人验证锁定", english: "Registrant Verification Locked", description: "等待注册人验证", category: "lock", severity: "warning", isActionRequired: true },
  "verificationrequired": { chinese: "需要验证", english: "Verification Required", description: "需要完成验证", category: "pending", severity: "warning", isActionRequired: true },
  "verificationpending": { chinese: "验证待处理", english: "Verification Pending", description: "验证待处理", category: "pending", severity: "warning", isActionRequired: true },
  "emailverificationpending": { chinese: "邮箱验证中", english: "Email Verification Pending", description: "等待邮箱验证", category: "pending", severity: "warning", isActionRequired: true },
  "identityverificationpending": { chinese: "身份验证中", english: "Identity Verification Pending", description: "等待身份验证", category: "pending", severity: "warning", isActionRequired: true },

  // ========== 锁定状态 ==========
  "locked": { chinese: "已锁定", english: "Locked", description: "域名已锁定", category: "lock", severity: "info", isActionRequired: false },
  "registrarlock": { chinese: "注册商锁定", english: "Registrar Lock", description: "注册商锁定", category: "lock", severity: "info", isActionRequired: false },
  "registrylock": { chinese: "注册局锁定", english: "Registry Lock", description: "注册局锁定", category: "lock", severity: "info", isActionRequired: false },

  // ========== DNSSEC 相关 ==========
  "adddsrecordprohibited": { chinese: "禁止添加DS", english: "Add DS Record Prohibited", description: "禁止添加DS记录", category: "lock", severity: "info", isActionRequired: false },
  "removedsrecordprohibited": { chinese: "禁止移除DS", english: "Remove DS Record Prohibited", description: "禁止移除DS记录", category: "lock", severity: "info", isActionRequired: false },

  // ========== 过期和终止状态 ==========
  "expired": { chinese: "已过期", english: "Expired", description: "域名已过期", category: "delete", severity: "error", isActionRequired: true },
  "suspended": { chinese: "已暂停", english: "Suspended", description: "域名已暂停", category: "hold", severity: "error", isActionRequired: true },
  "terminated": { chinese: "已终止", english: "Terminated", description: "域名已终止", category: "delete", severity: "error", isActionRequired: true },

  // ========== 可用性状态 ==========
  "available": { chinese: "可注册", english: "Available", description: "域名可注册", category: "other", severity: "info", isActionRequired: false },
  "unavailable": { chinese: "不可注册", english: "Unavailable", description: "域名不可注册", category: "other", severity: "warning", isActionRequired: false },
  "reserved": { chinese: "注册局保留", english: "Reserved", description: "被注册局保留", category: "other", severity: "warning", isActionRequired: false },
  "notfound": { chinese: "未找到", english: "Not Found", description: "未找到记录", category: "other", severity: "info", isActionRequired: false },

  // ========== 隐私和代理 ==========
  "privacyprotect": { chinese: "隐私保护", english: "Privacy Protect", description: "启用隐私保护", category: "other", severity: "info", isActionRequired: false },
  "proxy": { chinese: "代理注册", english: "Proxy Registration", description: "通过代理注册", category: "other", severity: "info", isActionRequired: false },

  // ========== 特殊状态 ==========
  "quarantine": { chinese: "隔离期", english: "Quarantine", description: "域名隔离期", category: "grace", severity: "warning", isActionRequired: true },
  "blocked": { chinese: "已屏蔽", english: "Blocked", description: "域名已屏蔽", category: "hold", severity: "error", isActionRequired: true },
  "frozen": { chinese: "已冻结", english: "Frozen", description: "域名已冻结", category: "hold", severity: "error", isActionRequired: true },

  // ========== 不规则/ccTLD 特殊状态 ==========
  "connect": { chinese: "已连接", english: "Connected", description: "域名已连接", category: "normal", severity: "info", isActionRequired: false },
  "linked": { chinese: "已关联", english: "Linked", description: "域名已关联", category: "normal", severity: "info", isActionRequired: false },
  "associated": { chinese: "已关联", english: "Associated", description: "域名已关联", category: "normal", severity: "info", isActionRequired: false },
  "registered": { chinese: "已注册", english: "Registered", description: "域名已注册", category: "normal", severity: "info", isActionRequired: false },
  "notassigned": { chinese: "未分配", english: "Not Assigned", description: "域名未分配", category: "other", severity: "info", isActionRequired: false },
  "assigned": { chinese: "已分配", english: "Assigned", description: "域名已分配", category: "normal", severity: "info", isActionRequired: false },
  "published": { chinese: "已发布", english: "Published", description: "域名已发布", category: "normal", severity: "info", isActionRequired: false },
  "verified": { chinese: "已验证", english: "Verified", description: "域名已验证", category: "normal", severity: "info", isActionRequired: false },
  "validated": { chinese: "已验证", english: "Validated", description: "域名已通过验证", category: "normal", severity: "info", isActionRequired: false },
  "thedomainisn'tgeneratedinthezone": { chinese: "未生成DNS区域", english: "Not Generated in Zone", description: "该域名未在DNS区域中生成", category: "hold", severity: "warning", isActionRequired: false },
  "notgeneratedinthezone": { chinese: "未生成DNS区域", english: "Not Generated in Zone", description: "未在DNS区域中生成", category: "hold", severity: "warning", isActionRequired: false },
  "zone": { chinese: "DNS区域", english: "Zone", description: "DNS区域相关", category: "other", severity: "info", isActionRequired: false },
  "generated": { chinese: "已生成", english: "Generated", description: "已在区域中生成", category: "normal", severity: "info", isActionRequired: false },
  "delegated": { chinese: "已委托", english: "Delegated", description: "域名已委托", category: "normal", severity: "info", isActionRequired: false },
  "notdelegated": { chinese: "未委托", english: "Not Delegated", description: "域名未委托", category: "hold", severity: "warning", isActionRequired: false },
  "undelegated": { chinese: "未委托", english: "Undelegated", description: "域名未委托", category: "hold", severity: "warning", isActionRequired: false },
  "exempt": { chinese: "豁免", english: "Exempt", description: "域名豁免", category: "other", severity: "info", isActionRequired: false },
  "renewgrace": { chinese: "续费宽限期", english: "Renew Grace", description: "续费后宽限期", category: "grace", severity: "info", isActionRequired: false },
  "pendingreview": { chinese: "审核中", english: "Pending Review", description: "域名审核中", category: "pending", severity: "warning", isActionRequired: false },
  "pendingactivation": { chinese: "待激活", english: "Pending Activation", description: "域名待激活", category: "pending", severity: "warning", isActionRequired: false },
  "pendingsuspension": { chinese: "待暂停", english: "Pending Suspension", description: "域名待暂停", category: "pending", severity: "warning", isActionRequired: false },
  "pendingtransit": { chinese: "待转移", english: "Pending Transit", description: "域名待转移", category: "pending", severity: "warning", isActionRequired: false },
  "free": { chinese: "空闲", english: "Free", description: "域名空闲可用", category: "other", severity: "info", isActionRequired: false },
  "taken": { chinese: "已被注册", english: "Taken", description: "域名已被注册", category: "normal", severity: "info", isActionRequired: false },
  "parked": { chinese: "已停放", english: "Parked", description: "域名已停放", category: "other", severity: "info", isActionRequired: false },
  "outofservice": { chinese: "停止服务", english: "Out of Service", description: "域名已停止服务", category: "hold", severity: "error", isActionRequired: true },
  "disabled": { chinese: "已禁用", english: "Disabled", description: "域名已禁用", category: "hold", severity: "error", isActionRequired: true },
  "tobereleased": { chinese: "待释放", english: "To Be Released", description: "域名待释放", category: "delete", severity: "warning", isActionRequired: false },
  "released": { chinese: "已释放", english: "Released", description: "域名已释放", category: "delete", severity: "info", isActionRequired: false },
  "disputed": { chinese: "争议中", english: "Disputed", description: "域名存在争议", category: "hold", severity: "error", isActionRequired: true },
  "court": { chinese: "法院限制", english: "Court Order", description: "法院限制域名", category: "hold", severity: "error", isActionRequired: true },
  "renewal": { chinese: "续费中", english: "Renewal", description: "域名续费中", category: "renew", severity: "info", isActionRequired: false },
  "grace": { chinese: "宽限期", english: "Grace", description: "域名宽限期", category: "grace", severity: "info", isActionRequired: false },
  "tobepurged": { chinese: "待清除", english: "To Be Purged", description: "域名待清除", category: "delete", severity: "error", isActionRequired: true },
  "purged": { chinese: "已清除", english: "Purged", description: "域名已清除", category: "delete", severity: "error", isActionRequired: false },
  "archived": { chinese: "已归档", english: "Archived", description: "域名已归档", category: "other", severity: "info", isActionRequired: false },
  "notrenewed": { chinese: "未续费", english: "Not Renewed", description: "域名未续费", category: "renew", severity: "warning", isActionRequired: true },
  "nottransferrable": { chinese: "不可转移", english: "Not Transferrable", description: "域名不可转移", category: "lock", severity: "info", isActionRequired: false },
  "notregistrable": { chinese: "不可注册", english: "Not Registrable", description: "域名不可注册", category: "other", severity: "warning", isActionRequired: false },
};

// ── Utility functions ─────────────────────────────────────────────────────────

function cleanStatus(status: string): string {
  return status
    .replace(/\s*https?:\/\/[^\s]+/gi, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

export function getStatusInfo(status: string | number | object): StatusInfo | null {
  if (typeof status !== "string") {
    if (typeof status === "number") return null;
    if (typeof status === "object" && status !== null) {
      const text = (status as Record<string, unknown>).text ||
                   (status as Record<string, unknown>).desc ||
                   (status as Record<string, unknown>).value;
      if (text) return getStatusInfo(text as string);
    }
    return null;
  }

  const cleaned = cleanStatus(status);
  if (STATUS_MAPPING[cleaned]) return STATUS_MAPPING[cleaned];

  for (const [key, value] of Object.entries(STATUS_MAPPING)) {
    if (cleaned.includes(key) || key.includes(cleaned)) return value;
  }

  return null;
}

export function translateStatus(status: string | number | object): string {
  const info = getStatusInfo(status);
  if (info) return info.chinese;
  if (typeof status === "string") {
    return status.replace(/\s*https?:\/\/[^\s]+/gi, "").trim();
  }
  return String(status);
}

export function translateStatusEn(status: string | number | object): string {
  const info = getStatusInfo(status);
  if (info) return info.english;
  if (typeof status === "string") {
    return status.replace(/\s*https?:\/\/[^\s]+/gi, "").trim();
  }
  return String(status);
}

/** Returns true if the given status demands user/registrar attention. */
export function isActionRequired(status: string | number | object): boolean {
  return getStatusInfo(status)?.isActionRequired ?? false;
}

/** Returns true if any status in the list requires action. */
export function hasActionRequired(statuses: (string | number | object)[]): boolean {
  return statuses.some(isActionRequired);
}

export interface CategorizedStatus {
  main: StatusInfo | null;
  subStatuses: StatusInfo[];
  holdStatuses: StatusInfo[];
  transferStatuses: StatusInfo[];
  renewStatuses: StatusInfo[];
  graceStatuses: StatusInfo[];
  actionRequired: boolean;
}

export function categorizeStatuses(statuses: (string | number | object)[]): CategorizedStatus {
  const result: CategorizedStatus = {
    main: null,
    subStatuses: [],
    holdStatuses: [],
    transferStatuses: [],
    renewStatuses: [],
    graceStatuses: [],
    actionRequired: false,
  };

  const allInfos: StatusInfo[] = [];

  for (const status of statuses) {
    const info = getStatusInfo(status);
    if (info) {
      allInfos.push(info);
      if (info.isActionRequired) result.actionRequired = true;

      switch (info.category) {
        case "hold": result.holdStatuses.push(info); break;
        case "transfer": result.transferStatuses.push(info); break;
        case "renew": result.renewStatuses.push(info); break;
        case "grace": result.graceStatuses.push(info); break;
      }
    }
  }

  const errorStatuses   = allInfos.filter((s) => s.severity === "error");
  const warningStatuses = allInfos.filter((s) => s.severity === "warning");

  if (errorStatuses.length > 0)        result.main = errorStatuses[0];
  else if (warningStatuses.length > 0) result.main = warningStatuses[0];
  else if (allInfos.length > 0)        result.main = allInfos[0];

  const otherStatuses = allInfos.filter((s) => s !== result.main);
  result.subStatuses = otherStatuses.slice(0, 3);

  return result;
}

export function getSeverityVariant(severity: "info" | "warning" | "error"): "default" | "secondary" | "destructive" {
  switch (severity) {
    case "error":   return "destructive";
    case "warning": return "secondary";
    default:        return "default";
  }
}
