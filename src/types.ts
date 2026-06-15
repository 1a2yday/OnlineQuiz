// ========== 题目类型 ==========

export type QuestionType = 'single-choice' | 'matching' | 'sentence-order';

export interface SingleChoiceQuestion {
  id: string;
  type: 'single-choice';
  question: string;
  options: string[];
  answer: number; // 正确选项的索引
  explanation?: string; // 答案解析（作答后显示）
}

export interface MatchingQuestion {
  id: string;
  type: 'matching';
  question: string;
  left: string[];
  right: string[];
  pairs: [number, number][]; // [leftIndex, rightIndex]
  explanation?: string; // 答案解析（作答后显示）
}

export interface SentenceOrderQuestion {
  id: string;
  type: 'sentence-order';
  question: string; // 中文提示
  words: string[];
  answer: number[]; // 正确顺序的索引
  explanation?: string; // 答案解析（作答后显示）
}

export type Question = SingleChoiceQuestion | MatchingQuestion | SentenceOrderQuestion;

// ========== 题库 ==========

export interface QuizBank {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
}

// ========== 用户 ==========

export interface User {
  id: string;
  name: string;
  createdAt: number;
}

// ========== 答题记录 ==========

export interface QuizRecord {
  userId: string;
  userName: string;
  quizBankId: string;
  quizBankName: string;
  correctCount: number;
  totalCount: number;
  timeSeconds: number;
  timestamp: number;
}

// ========== 错题 ==========

export interface WrongQuestionEntry {
  userId: string;
  questionId: string;
  quizBankId: string;
  wrongCount: number;
  mastered: boolean; // 用户标记为已掌握
}

// ========== 应用状态 ==========

export interface AppState {
  currentUser: User | null;
  currentPage: PageName;
}

export type PageName =
  | 'home'
  | 'name-entry'
  | 'quiz-bank'
  | 'quiz'
  | 'quiz-result'
  | 'wrong-questions'
  | 'leaderboard'
  | 'admin';

// ========== 黑名单 ==========

export interface BlacklistEntry {
  userId: string;
  userName: string;
  timestamp: number;
}

// ========== 应用配置 ==========

export interface AppConfig {
  bannerUrl: string; // 自定义横幅图URL（默认 banner.gif）
  adminPassword: string; // 管理员密码（简单保护）
  welcomeTitle: string; // 主页欢迎标题
  welcomeSubtitle: string; // 主页欢迎副标题
}