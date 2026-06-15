// ========== 主题系统 ==========

export interface ThemeColors {
  id: string;
  name: string;
  emoji: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  highlight: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;
  border: string;
  borderStrong: string;
  bgLight: string;
  shadow: string;
  shadowHover: string;
  // 按钮专用渐变
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  highlightGradient: string;
}

export const THEMES: ThemeColors[] = [
  {
    id: 'honey-lemon',
    name: '蜂蜜柠檬糖',
    emoji: '🍯',
    primary: '#FF8C42',
    primaryLight: '#FFAA70',
    secondary: '#FFB347',
    secondaryLight: '#FFC773',
    accent: '#2EC4A7',
    highlight: '#FFC940',
    background: '#FFF8F0',
    card: '#FFFFFF',
    text: '#4A3030',
    textSecondary: '#8B7070',
    textMuted: '#B8A0A0',
    textLight: '#C8B0A0',
    border: '#FFE0D0',
    borderStrong: '#FFC8A8',
    bgLight: '#FFF5EE',
    shadow: 'rgba(255, 140, 66, 0.15)',
    shadowHover: 'rgba(255, 140, 66, 0.25)',
    primaryGradient: 'linear-gradient(135deg, #FF8C42, #FFAA70)',
    secondaryGradient: 'linear-gradient(135deg, #FFB347, #FFC773)',
    accentGradient: 'linear-gradient(135deg, #2EC4A7, #50D8B8)',
    highlightGradient: 'linear-gradient(135deg, #FFC940, #FFD970)',
  },
  {
    id: 'mint',
    name: '薄荷糖',
    emoji: '🍃',
    primary: '#00BFA5',
    primaryLight: '#33CFB5',
    secondary: '#26A69A',
    secondaryLight: '#4DB6AC',
    accent: '#00D2A0',
    highlight: '#FFC940',
    background: '#F0FFFA',
    card: '#FFFFFF',
    text: '#2D4040',
    textSecondary: '#5C7070',
    textMuted: '#90A0A0',
    textLight: '#A8B8B8',
    border: '#C8E8E0',
    borderStrong: '#A0D8C8',
    bgLight: '#E8F8F2',
    shadow: 'rgba(0, 191, 165, 0.15)',
    shadowHover: 'rgba(0, 191, 165, 0.25)',
    primaryGradient: 'linear-gradient(135deg, #00BFA5, #33CFB5)',
    secondaryGradient: 'linear-gradient(135deg, #26A69A, #4DB6AC)',
    accentGradient: 'linear-gradient(135deg, #00D2A0, #33E0B8)',
    highlightGradient: 'linear-gradient(135deg, #FFC940, #FFD970)',
  },
  {
    id: 'strawberry',
    name: '草莓糖',
    emoji: '🍓',
    primary: '#FF6B9D',
    primaryLight: '#FF85B3',
    secondary: '#9B59B6',
    secondaryLight: '#B07CD8',
    accent: '#00D2A0',
    highlight: '#FFD93D',
    background: '#FFF0F5',
    card: '#FFFFFF',
    text: '#4A3040',
    textSecondary: '#8B7080',
    textMuted: '#B8A0B0',
    textLight: '#C8B0C0',
    border: '#FFE0EC',
    borderStrong: '#FFB8D0',
    bgLight: '#FFF5F7',
    shadow: 'rgba(255, 107, 157, 0.15)',
    shadowHover: 'rgba(255, 107, 157, 0.25)',
    primaryGradient: 'linear-gradient(135deg, #FF6B9D, #FF85B3)',
    secondaryGradient: 'linear-gradient(135deg, #9B59B6, #B07CD8)',
    accentGradient: 'linear-gradient(135deg, #00D2A0, #33E0B8)',
    highlightGradient: 'linear-gradient(135deg, #FFD93D, #FFE566)',
  },
  {
    id: 'blueberry',
    name: '蓝莓糖',
    emoji: '🫐',
    primary: '#667EEA',
    primaryLight: '#8295F0',
    secondary: '#764BA2',
    secondaryLight: '#9568C0',
    accent: '#00D2A0',
    highlight: '#FFC940',
    background: '#F2F0FF',
    card: '#FFFFFF',
    text: '#303048',
    textSecondary: '#686880',
    textMuted: '#9898B0',
    textLight: '#B0B0C8',
    border: '#D8D8F0',
    borderStrong: '#C0C0E8',
    bgLight: '#ECEAFA',
    shadow: 'rgba(102, 126, 234, 0.15)',
    shadowHover: 'rgba(102, 126, 234, 0.25)',
    primaryGradient: 'linear-gradient(135deg, #667EEA, #8295F0)',
    secondaryGradient: 'linear-gradient(135deg, #764BA2, #9568C0)',
    accentGradient: 'linear-gradient(135deg, #00D2A0, #33E0B8)',
    highlightGradient: 'linear-gradient(135deg, #FFC940, #FFD970)',
  },
];

const DEFAULT_THEME_ID = 'honey-lemon';
const THEME_STORAGE_KEY = 'english_quiz_theme';

/** 获取当前保存的主题 ID */
export function getSavedThemeId(): string {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

/** 保存主题 ID */
export function saveThemeId(id: string): void {
  localStorage.setItem(THEME_STORAGE_KEY, id);
}

/** 获取当前主题配置 */
export function getCurrentTheme(): ThemeColors {
  const id = getSavedThemeId();
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/** 应用主题到 DOM（设置 CSS 变量） */
export function applyTheme(theme: ThemeColors): void {
  const root = document.documentElement;
  root.style.setProperty('--c-primary', theme.primary);
  root.style.setProperty('--c-primary-light', theme.primaryLight);
  root.style.setProperty('--c-secondary', theme.secondary);
  root.style.setProperty('--c-secondary-light', theme.secondaryLight);
  root.style.setProperty('--c-accent', theme.accent);
  root.style.setProperty('--c-highlight', theme.highlight);
  root.style.setProperty('--c-background', theme.background);
  root.style.setProperty('--c-card', theme.card);
  root.style.setProperty('--c-text', theme.text);
  root.style.setProperty('--c-text-secondary', theme.textSecondary);
  root.style.setProperty('--c-text-muted', theme.textMuted);
  root.style.setProperty('--c-text-light', theme.textLight);
  root.style.setProperty('--c-border', theme.border);
  root.style.setProperty('--c-border-strong', theme.borderStrong);
  root.style.setProperty('--c-bg-light', theme.bgLight);
  root.style.setProperty('--c-shadow', theme.shadow);
  root.style.setProperty('--c-shadow-hover', theme.shadowHover);
  root.style.setProperty('--c-primary-gradient', theme.primaryGradient);
  root.style.setProperty('--c-secondary-gradient', theme.secondaryGradient);
  root.style.setProperty('--c-accent-gradient', theme.accentGradient);
  root.style.setProperty('--c-highlight-gradient', theme.highlightGradient);
}

/** 初始化主题 */
export function initTheme(): ThemeColors {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
}
