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

// 检测是否为管理员
export function isAdminUser(userId: string): boolean {
  // 简单实现：检查localStorage中的管理员标记
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