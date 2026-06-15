import type {
  QuizBank,
  User,
  QuizRecord,
  WrongQuestionEntry,
  BlacklistEntry,
  AppConfig,
} from './types';

// ========== localStorage 键名 ==========
const KEYS = {
  QUIZ_BANKS: 'english_quiz_banks',
  USERS: 'english_quiz_users',
  CURRENT_USER: 'english_quiz_current_user',
  QUIZ_RECORDS: 'english_quiz_records',
  WRONG_QUESTIONS: 'english_quiz_wrong_questions',
  BLACKLIST: 'english_quiz_blacklist',
  APP_CONFIG: 'english_quiz_config',
} as const;

// ========== 通用读写 ==========
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ========== 远程题库（服务端托管，所有用户可见） ==========
const REMOTE_CACHE_KEY = 'english_quiz_remote_cache';

interface RemoteQuizManifestEntry {
  id: string;
  name: string;
  file: string;
  description?: string;
}

/** 从服务端拉取远程题库清单并缓存到 localStorage */
export async function loadRemoteQuizzes(): Promise<void> {
  try {
    const resp = await fetch('quizzes/manifest.json');
    if (!resp.ok) return;
    const manifest: RemoteQuizManifestEntry[] = await resp.json();

    const banks: QuizBank[] = [];
    for (const entry of manifest) {
      try {
        const quizResp = await fetch(`quizzes/${entry.file}`);
        if (!quizResp.ok) continue;
        const data = await quizResp.json();
        // 验证基本结构
        if (!data.name || !Array.isArray(data.questions)) continue;
        banks.push({
          id: `remote_${entry.id}`,
          name: entry.name,
          questions: data.questions,
          createdAt: 0, // 远程题库无本地创建时间
        });
      } catch {
        // 单个题库加载失败不影响其他
        console.warn(`远程题库加载失败: ${entry.file}`);
      }
    }

    setItem(REMOTE_CACHE_KEY, banks);
    // 通知页面远程题库已就绪（QuizBank 可刷新）
    window.dispatchEvent(new CustomEvent('remote-quizzes-loaded'));
  } catch {
    // 网络不通时使用已有缓存，静默处理
  }
}

/** 获取缓存的远程题库（同步，不触发网络请求） */
function getRemoteQuizBanks(): QuizBank[] {
  return getItem<QuizBank[]>(REMOTE_CACHE_KEY, []);
}

// ========== 题库 ==========
export function getQuizBanks(): QuizBank[] {
  const local = getItem<QuizBank[]>(KEYS.QUIZ_BANKS, []);
  const remote = getRemoteQuizBanks();
  // 远程题库在前，本地题库在后
  return [...remote, ...local];
}

/** 仅获取本地题库（用于保存/删除操作） */
function getLocalQuizBanks(): QuizBank[] {
  return getItem<QuizBank[]>(KEYS.QUIZ_BANKS, []);
}

export function saveQuizBank(bank: QuizBank): void {
  // 远程题库不允许覆盖
  if (bank.id.startsWith('remote_')) return;
  const banks = getLocalQuizBanks();
  const idx = banks.findIndex((b) => b.id === bank.id);
  if (idx >= 0) {
    banks[idx] = bank;
  } else {
    banks.push(bank);
  }
  setItem(KEYS.QUIZ_BANKS, banks);
}

export function deleteQuizBank(id: string): void {
  // 远程题库不允许删除
  if (id.startsWith('remote_')) return;
  const banks = getLocalQuizBanks().filter((b) => b.id !== id);
  setItem(KEYS.QUIZ_BANKS, banks);
}

// ========== 用户 ==========
export function getUsers(): User[] {
  return getItem<User[]>(KEYS.USERS, []);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
  setItem(KEYS.CURRENT_USER, user);
  if (user) {
    const users = getUsers();
    if (!users.find((u) => u.id === user.id)) {
      users.push(user);
      setItem(KEYS.USERS, users);
    }
  }
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function deleteUserData(userId: string): void {
  // 删除用户
  const users = getUsers().filter((u) => u.id !== userId);
  setItem(KEYS.USERS, users);

  // 删除当前用户如果是被删除的
  const cur = getCurrentUser();
  if (cur && cur.id === userId) {
    setCurrentUser(null);
  }

  // 删除答题记录
  const records = getQuizRecords().filter((r) => r.userId !== userId);
  setItem(KEYS.QUIZ_RECORDS, records);

  // 删除错题
  const wrong = getWrongQuestions().filter((w) => w.userId !== userId);
  setItem(KEYS.WRONG_QUESTIONS, wrong);
}

// ========== 答题记录 ==========
export function getQuizRecords(): QuizRecord[] {
  return getItem<QuizRecord[]>(KEYS.QUIZ_RECORDS, []);
}

export function saveQuizRecord(record: QuizRecord): void {
  const records = getQuizRecords();
  records.push(record);
  setItem(KEYS.QUIZ_RECORDS, records);
}

export function getLeaderboard(quizBankId: string): QuizRecord[] {
  return getQuizRecords()
    .filter((r) => r.quizBankId === quizBankId)
    .sort((a, b) => {
      // 按正确率降序，正确率相同按时间升序
      const rateA = a.correctCount / a.totalCount;
      const rateB = b.correctCount / b.totalCount;
      if (rateB !== rateA) return rateB - rateA;
      return a.timeSeconds - b.timeSeconds;
    });
}

// ========== 错题 ==========
export function getWrongQuestions(): WrongQuestionEntry[] {
  return getItem<WrongQuestionEntry[]>(KEYS.WRONG_QUESTIONS, []);
}

export function recordWrongAnswer(
  userId: string,
  questionId: string,
  quizBankId: string
): void {
  const wrong = getWrongQuestions();
  const existing = wrong.find(
    (w) => w.userId === userId && w.questionId === questionId
  );
  if (existing) {
    existing.wrongCount += 1;
    existing.mastered = false; // 重新做错，取消已掌握
  } else {
    wrong.push({
      userId,
      questionId,
      quizBankId,
      wrongCount: 1,
      mastered: false,
    });
  }
  setItem(KEYS.WRONG_QUESTIONS, wrong);
}

export function markWrongQuestionMastered(
  userId: string,
  questionId: string
): void {
  const wrong = getWrongQuestions();
  const entry = wrong.find(
    (w) => w.userId === userId && w.questionId === questionId
  );
  if (entry) {
    entry.mastered = true;
    setItem(KEYS.WRONG_QUESTIONS, wrong);
  }
}

export function getUserWrongQuestions(
  userId: string
): WrongQuestionEntry[] {
  return getWrongQuestions().filter(
    (w) => w.userId === userId && !w.mastered
  );
}

export function getWrongCountForQuestion(
  userId: string,
  questionId: string
): number {
  const entry = getWrongQuestions().find(
    (w) => w.userId === userId && w.questionId === questionId
  );
  return entry ? entry.wrongCount : 0;
}

// ========== 黑名单 ==========
export function getBlacklist(): BlacklistEntry[] {
  return getItem<BlacklistEntry[]>(KEYS.BLACKLIST, []);
}

export function addToBlacklist(userId: string, userName: string): void {
  const list = getBlacklist();
  if (!list.find((b) => b.userId === userId)) {
    list.push({ userId, userName, timestamp: Date.now() });
    setItem(KEYS.BLACKLIST, list);
  }
}

export function removeFromBlacklist(userId: string): void {
  const list = getBlacklist().filter((b) => b.userId !== userId);
  setItem(KEYS.BLACKLIST, list);
}

export function isBlacklisted(userId: string): boolean {
  return getBlacklist().some((b) => b.userId === userId);
}

// ========== 应用配置 ==========
export function getAppConfig(): AppConfig {
  return getItem<AppConfig>(KEYS.APP_CONFIG, {
    bannerUrl: 'banner.gif',
    adminPassword: 'admin123',
    welcomeTitle: '英语刷题助手',
    welcomeSubtitle: 'Sweet English, Sweet Learning!',
  });
}

export function setAppConfig(config: Partial<AppConfig>): void {
  const current = getAppConfig();
  setItem(KEYS.APP_CONFIG, { ...current, ...config });
}