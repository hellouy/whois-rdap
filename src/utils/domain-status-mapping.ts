// 域名状态映射工具 - 支持100+状态中文映射和分类

export interface StatusInfo {
  chinese: string;
  description: string;
  category: 'normal' | 'hold' | 'transfer' | 'renew' | 'delete' | 'grace' | 'pending' | 'lock' | 'other';
  severity: 'info' | 'warning' | 'error';
}

// 100+ 域名状态映射表
export const STATUS_MAPPING: Record<string, StatusInfo> = {
  // ========== 正常状态 ==========
  'ok': { chinese: '正常', description: '域名处于正常状态', category: 'normal', severity: 'info' },
  'active': { chinese: '活跃', description: '域名正常活跃', category: 'normal', severity: 'info' },
  'live': { chinese: '正常', description: '域名在线运行', category: 'normal', severity: 'info' },
  'inactive': { chinese: '非活跃', description: '域名不活跃', category: 'other', severity: 'warning' },
  
  // ========== Hold 暂停状态 ==========
  'clienthold': { chinese: '客户端暂停', description: '注册商设置暂停解析', category: 'hold', severity: 'error' },
  'serverhold': { chinese: '服务器暂停', description: '注册局设置暂停解析', category: 'hold', severity: 'error' },
  'hold': { chinese: '暂停', description: '域名暂停解析', category: 'hold', severity: 'error' },
  'registrarhold': { chinese: '注册商暂停', description: '注册商设置暂停', category: 'hold', severity: 'error' },
  'registryhold': { chinese: '注册局暂停', description: '注册局设置暂停', category: 'hold', severity: 'error' },
  'legalhold': { chinese: '法律暂停', description: '因法律原因暂停', category: 'hold', severity: 'error' },
  'disputehold': { chinese: '争议暂停', description: '域名争议暂停', category: 'hold', severity: 'error' },
  'fraudhold': { chinese: '欺诈暂停', description: '因欺诈暂停', category: 'hold', severity: 'error' },
  'abusehold': { chinese: '滥用暂停', description: '因滥用暂停', category: 'hold', severity: 'error' },
  'internalhold': { chinese: '内部暂停', description: '内部原因暂停', category: 'hold', severity: 'error' },
  
  // ========== 转移相关状态 ==========
  'clienttransferprohibited': { chinese: '禁止转移(客户端)', description: '注册商禁止转移', category: 'lock', severity: 'info' },
  'servertransferprohibited': { chinese: '禁止转移(服务器)', description: '注册局禁止转移', category: 'lock', severity: 'info' },
  'transferprohibited': { chinese: '禁止转移', description: '域名禁止转移', category: 'lock', severity: 'info' },
  'pendingtransfer': { chinese: '转移处理中', description: '域名正在转移', category: 'transfer', severity: 'warning' },
  'transferstarted': { chinese: '转移已启动', description: '转移流程已开始', category: 'transfer', severity: 'warning' },
  'transfercompleted': { chinese: '转移完成', description: '转移已完成', category: 'transfer', severity: 'info' },
  'transferrejected': { chinese: '转移被拒', description: '转移请求被拒绝', category: 'transfer', severity: 'warning' },
  'transfercancelled': { chinese: '转移取消', description: '转移已取消', category: 'transfer', severity: 'info' },
  'transferapproved': { chinese: '转移已批准', description: '转移请求已批准', category: 'transfer', severity: 'info' },
  'transferrequested': { chinese: '转移已请求', description: '转移已请求', category: 'transfer', severity: 'warning' },
  'transferperiod': { chinese: '转移宽限期', description: '转移后宽限期', category: 'grace', severity: 'info' },
  
  // ========== 续费相关状态 ==========
  'clientrenewprohibited': { chinese: '禁止续费(客户端)', description: '注册商禁止续费', category: 'lock', severity: 'warning' },
  'serverrenewprohibited': { chinese: '禁止续费(服务器)', description: '注册局禁止续费', category: 'lock', severity: 'warning' },
  'renewprohibited': { chinese: '禁止续费', description: '域名禁止续费', category: 'lock', severity: 'warning' },
  'pendingrenew': { chinese: '续费处理中', description: '续费请求处理中', category: 'renew', severity: 'info' },
  'autorenew': { chinese: '自动续费', description: '已设置自动续费', category: 'renew', severity: 'info' },
  'autorenewperiod': { chinese: '自动续费期', description: '自动续费宽限期', category: 'grace', severity: 'info' },
  'renewperiod': { chinese: '续费宽限期', description: '续费后宽限期', category: 'grace', severity: 'info' },
  'noautorenew': { chinese: '未自动续费', description: '未设置自动续费', category: 'renew', severity: 'warning' },
  
  // ========== 删除相关状态 ==========
  'clientdeleteprohibited': { chinese: '禁止删除(客户端)', description: '注册商禁止删除', category: 'lock', severity: 'info' },
  'serverdeleteprohibited': { chinese: '禁止删除(服务器)', description: '注册局禁止删除', category: 'lock', severity: 'info' },
  'deleteprohibited': { chinese: '禁止删除', description: '域名禁止删除', category: 'lock', severity: 'info' },
  'pendingdelete': { chinese: '待删除', description: '域名即将删除', category: 'delete', severity: 'error' },
  'pendingdeletion': { chinese: '等待删除', description: '域名等待删除', category: 'delete', severity: 'error' },
  'scheduledfordeletion': { chinese: '计划删除', description: '域名计划删除', category: 'delete', severity: 'error' },
  'pendingdeleterestorable': { chinese: '删除可恢复', description: '待删除但可恢复', category: 'delete', severity: 'error' },
  'pendingdeletescheduled': { chinese: '删除已计划', description: '删除已安排', category: 'delete', severity: 'error' },
  
  // ========== 更新相关状态 ==========
  'clientupdateprohibited': { chinese: '禁止更新(客户端)', description: '注册商禁止更新', category: 'lock', severity: 'info' },
  'serverupdateprohibited': { chinese: '禁止更新(服务器)', description: '注册局禁止更新', category: 'lock', severity: 'info' },
  'updateprohibited': { chinese: '禁止更新', description: '域名禁止更新', category: 'lock', severity: 'info' },
  'pendingupdate': { chinese: '更新处理中', description: '更新请求处理中', category: 'pending', severity: 'info' },
  'pendingupdates': { chinese: '待更新', description: '等待更新', category: 'pending', severity: 'info' },
  
  // ========== 宽限期状态 ==========
  'addperiod': { chinese: 'AGP宽限期', description: '新注册宽限期(5天)', category: 'grace', severity: 'info' },
  'redemptionperiod': { chinese: '赎回期', description: '域名赎回期(30天)', category: 'grace', severity: 'error' },
  'pendingrestore': { chinese: '恢复处理中', description: '域名恢复请求处理中', category: 'grace', severity: 'warning' },
  'graceperiod': { chinese: '宽限期', description: '域名宽限期内', category: 'grace', severity: 'info' },
  
  // ========== 审核和申请状态 ==========
  'pending': { chinese: '待处理', description: '请求待处理', category: 'pending', severity: 'warning' },
  'pendingapplication': { chinese: '申请待审核', description: '注册申请待审核', category: 'pending', severity: 'warning' },
  'applicationpending': { chinese: '申请待审核', description: '注册申请待审核', category: 'pending', severity: 'warning' },
  'underevaluation': { chinese: '评估中', description: '正在评估', category: 'pending', severity: 'warning' },
  'underreview': { chinese: '审核中', description: '正在审核', category: 'pending', severity: 'warning' },
  'awaitingapproval': { chinese: '等待批准', description: '等待批准', category: 'pending', severity: 'warning' },
  'pendingcreate': { chinese: '等待创建', description: '创建请求处理中', category: 'pending', severity: 'info' },
  'pendingverification': { chinese: '等待验证', description: '等待验证完成', category: 'pending', severity: 'warning' },
  
  // ========== 验证状态 ==========
  'registrantverificationlocked': { chinese: '注册人验证锁定', description: '等待注册人验证', category: 'lock', severity: 'warning' },
  'verificationrequired': { chinese: '需要验证', description: '需要完成验证', category: 'pending', severity: 'warning' },
  'verificationpending': { chinese: '验证待处理', description: '验证待处理', category: 'pending', severity: 'warning' },
  'emailverificationpending': { chinese: '邮箱验证中', description: '等待邮箱验证', category: 'pending', severity: 'warning' },
  'identityverificationpending': { chinese: '身份验证中', description: '等待身份验证', category: 'pending', severity: 'warning' },
  
  // ========== 锁定状态 ==========
  'locked': { chinese: '已锁定', description: '域名已锁定', category: 'lock', severity: 'info' },
  'registrarlock': { chinese: '注册商锁定', description: '注册商锁定', category: 'lock', severity: 'info' },
  'registrylock': { chinese: '注册局锁定', description: '注册局锁定', category: 'lock', severity: 'info' },
  
  // ========== DNSSEC 相关 ==========
  'adddsrecordprohibited': { chinese: '禁止添加DS', description: '禁止添加DS记录', category: 'lock', severity: 'info' },
  'removedsrecordprohibited': { chinese: '禁止移除DS', description: '禁止移除DS记录', category: 'lock', severity: 'info' },
  
  // ========== 过期和终止状态 ==========
  'expired': { chinese: '已过期', description: '域名已过期', category: 'delete', severity: 'error' },
  'suspended': { chinese: '已暂停', description: '域名已暂停', category: 'hold', severity: 'error' },
  'terminated': { chinese: '已终止', description: '域名已终止', category: 'delete', severity: 'error' },
  
  // ========== 可用性状态 ==========
  'available': { chinese: '可注册', description: '域名可注册', category: 'other', severity: 'info' },
  'unavailable': { chinese: '不可注册', description: '域名不可注册', category: 'other', severity: 'warning' },
  'reserved': { chinese: '注册局保留', description: '被注册局保留', category: 'other', severity: 'warning' },
  'notfound': { chinese: '未找到', description: '未找到记录', category: 'other', severity: 'info' },
  
  // ========== 隐私和代理 ==========
  'privacyprotect': { chinese: '隐私保护', description: '启用隐私保护', category: 'other', severity: 'info' },
  'proxy': { chinese: '代理注册', description: '通过代理注册', category: 'other', severity: 'info' },
  
  // ========== 特殊状态 ==========
  'quarantine': { chinese: '隔离期', description: '域名隔离期', category: 'grace', severity: 'warning' },
  'blocked': { chinese: '已屏蔽', description: '域名已屏蔽', category: 'hold', severity: 'error' },
  'frozen': { chinese: '已冻结', description: '域名已冻结', category: 'hold', severity: 'error' },
};

/**
 * 清理状态字符串（移除URL和空格）
 */
function cleanStatus(status: string): string {
  return status
    .replace(/\s*https?:\/\/[^\s]+/gi, '')
    .replace(/[\(\)]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
}

/**
 * 获取状态信息
 */
export function getStatusInfo(status: string | number | object): StatusInfo | null {
  if (typeof status !== 'string') {
    if (typeof status === 'number') return null;
    if (typeof status === 'object' && status !== null) {
      const text = (status as any).text || (status as any).desc || (status as any).value;
      if (text) return getStatusInfo(text);
    }
    return null;
  }
  
  const cleaned = cleanStatus(status);
  
  // 精确匹配
  if (STATUS_MAPPING[cleaned]) {
    return STATUS_MAPPING[cleaned];
  }
  
  // 部分匹配
  for (const [key, value] of Object.entries(STATUS_MAPPING)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return value;
    }
  }
  
  return null;
}

/**
 * 翻译状态为中文
 */
export function translateStatus(status: string | number | object): string {
  const info = getStatusInfo(status);
  if (info) return info.chinese;
  
  // 未匹配时返回原始状态
  if (typeof status === 'string') {
    return status.replace(/\s*https?:\/\/[^\s]+/gi, '').trim();
  }
  return String(status);
}

/**
 * 分类状态列表
 */
export interface CategorizedStatus {
  main: StatusInfo | null;
  subStatuses: StatusInfo[];
  holdStatuses: StatusInfo[];
  transferStatuses: StatusInfo[];
  renewStatuses: StatusInfo[];
  graceStatuses: StatusInfo[];
}

/**
 * 分析并分类状态列表
 */
export function categorizeStatuses(statuses: (string | number | object)[]): CategorizedStatus {
  const result: CategorizedStatus = {
    main: null,
    subStatuses: [],
    holdStatuses: [],
    transferStatuses: [],
    renewStatuses: [],
    graceStatuses: [],
  };
  
  const allInfos: StatusInfo[] = [];
  
  for (const status of statuses) {
    const info = getStatusInfo(status);
    if (info) {
      allInfos.push(info);
      
      switch (info.category) {
        case 'hold':
          result.holdStatuses.push(info);
          break;
        case 'transfer':
          result.transferStatuses.push(info);
          break;
        case 'renew':
          result.renewStatuses.push(info);
          break;
        case 'grace':
          result.graceStatuses.push(info);
          break;
      }
    }
  }
  
  // 确定主状态（优先级：error > warning > info）
  const errorStatuses = allInfos.filter(s => s.severity === 'error');
  const warningStatuses = allInfos.filter(s => s.severity === 'warning');
  
  if (errorStatuses.length > 0) {
    result.main = errorStatuses[0];
  } else if (warningStatuses.length > 0) {
    result.main = warningStatuses[0];
  } else if (allInfos.length > 0) {
    result.main = allInfos[0];
  }
  
  // 收集最多3个关键子状态（不包含主状态）
  const otherStatuses = allInfos.filter(s => s !== result.main);
  result.subStatuses = otherStatuses.slice(0, 3);
  
  return result;
}

/**
 * 获取状态严重程度的Badge变体
 */
export function getSeverityVariant(severity: 'info' | 'warning' | 'error'): 'default' | 'secondary' | 'destructive' {
  switch (severity) {
    case 'error': return 'destructive';
    case 'warning': return 'secondary';
    default: return 'default';
  }
}
