// 生成唯一用户ID
export function generateUserId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `u_${id}_${Date.now().toString(36)}`;
}

// 生成题库ID
export function generateQuizBankId(): string {
  return `qb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// 生成题目ID
export function generateQuestionId(): string {
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// 格式化时间
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// 洗牌
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 验证用户名
export function validateName(name: string): { valid: boolean; error: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: '名字不能为空' };
  }
  // 检测中英文字符数
  const chineseChars = (trimmed.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishChars = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const otherChars = trimmed.length - chineseChars - englishChars;

  if (chineseChars > 5) {
    return { valid: false, error: '中文最多5个字符' };
  }
  if (englishChars > 10) {
    return { valid: false, error: '英文最多10个字符' };
  }
  if (otherChars > 0) {
    return { valid: false, error: '名字只能包含中文或英文字母' };
  }
  if (chineseChars === 0 && englishChars === 0) {
    return { valid: false, error: '名字至少包含一个中文字或英文字母' };
  }
  if (trimmed.length > 15) {
    return { valid: false, error: '名字总长度不能超过15个字符' };
  }
  return { valid: true, error: '' };
}

// 简单敏感词检测 - 使用常见的敏感词模式
const SENSITIVE_PATTERNS = [
  /[^\u4e00-\u9fffa-zA-Z0-9_\-\s]/g, // 检测特殊符号
];

export function hasSensitiveWords(name: string): boolean {
  const trimmed = name.trim().toLowerCase();
  // 常见不适宜词汇的简单检测
  const blockedWords = [
    'admin', 'root', 'system', 'test', 'null',
    '管理员', '系统', '超级管理员', '版主',
  ];
  for (const word of blockedWords) {
    if (trimmed.includes(word.toLowerCase())) {
      return true;
    }
  }
  // 检测特殊符号过多
  for (const pattern of SENSITIVE_PATTERNS) {
    const matches = trimmed.match(pattern);
    if (matches && matches.length > 2) {
      return true;
    }
  }
  return false;
}

// ========== 安全工具 ==========

/**
 * 使用 Web Crypto API 计算 SHA-256 哈希
 * 用于管理员密码的安全存储和验证
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * HTML 实体转义，防止 XSS 注入
 * 转义所有危险的 HTML 字符
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
  };
  return str.replace(/[&<>"'`]/g, (ch) => map[ch] || ch);
}

/**
 * 校验 URL 是否安全（仅允许 http/https 和相对路径）
 * 防止 javascript: 等危险协议注入
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  // 允许相对路径（/ 或 ./ 开头，或不含协议的纯文件名）
  if (/^(\.{0,2}\/|[a-zA-Z0-9_-])/.test(url) && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
    return true;
  }
  // 仅允许 http: 和 https: 协议
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// ========== 管理员 ==========

// 管理员密码的 SHA-256 哈希（默认密码: admin123）
const DEFAULT_ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

/**
 * 验证管理员密码是否正确
 * 使用 SHA-256 哈希对比，密码不以明文存储
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const { getAppConfig } = await import('./storage');
  const config = getAppConfig();
  const storedHash = config.adminPasswordHash || DEFAULT_ADMIN_PASSWORD_HASH;
  const inputHash = await sha256(password);
  return inputHash === storedHash;
}

/**
 * 生成并存储新的管理员密码哈希
 */
export async function setAdminPassword(newPassword: string): Promise<void> {
  const { setAppConfig } = await import('./storage');
  const hash = await sha256(newPassword);
  setAppConfig({ adminPasswordHash: hash });
}

// 检测是否为管理员（基于 localStorage 会话标记）
export function isAdminUser(userId: string): boolean {
  try {
    const adminIds = JSON.parse(localStorage.getItem('english_quiz_admins') || '[]') as string[];
    return adminIds.includes(userId);
  } catch {
    return false;
  }
}

export function setAdminUser(userId: string, isAdmin: boolean): void {
  try {
    const adminIds = JSON.parse(localStorage.getItem('english_quiz_admins') || '[]') as string[];
    if (isAdmin && !adminIds.includes(userId)) {
      adminIds.push(userId);
    } else if (!isAdmin) {
      const idx = adminIds.indexOf(userId);
      if (idx >= 0) adminIds.splice(idx, 1);
    }
    localStorage.setItem('english_quiz_admins', JSON.stringify(adminIds));
  } catch {
    // ignore
  }
}