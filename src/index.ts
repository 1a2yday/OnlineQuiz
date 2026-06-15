import './index.css';
import { navigateTo, registerRoute } from './router';
import { getCurrentUser, isBlacklisted, loadRemoteQuizzes } from './storage';
import { initTheme } from './themes';
import { renderHomePage } from './pages/HomePage';
import { renderNameEntry } from './pages/NameEntry';
import { renderQuizBank } from './pages/QuizBank';
import { renderQuiz } from './pages/Quiz';
import { renderQuizResult } from './pages/QuizResult';
import { renderWrongQuestions } from './pages/WrongQuestions';
import { renderLeaderboard } from './pages/Leaderboard';
import { renderAdmin } from './pages/Admin';
import type { PageName } from './types';

// 初始化主题（在渲染前设置 CSS 变量）
initTheme();

// 注册所有路由
registerRoute('home', renderHomePage);
registerRoute('name-entry', renderNameEntry);
registerRoute('quiz-bank', renderQuizBank);
registerRoute('quiz', renderQuiz);
registerRoute('quiz-result', renderQuizResult);
registerRoute('wrong-questions', renderWrongQuestions);
registerRoute('leaderboard', renderLeaderboard);
registerRoute('admin', renderAdmin);

// 应用启动
function bootstrap(): void {
  // 后台拉取远程题库（不阻塞页面渲染）
  loadRemoteQuizzes();

  const user = getCurrentUser();
  const isBlocked = user && isBlacklisted(user.id);

  if (isBlocked) {
    // 被拉黑用户看到提示
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="phone-container flex items-center justify-center p-6">
          <div class="card-candy text-center p-8 w-full">
            <div class="text-5xl mb-4">🚫</div>
            <h2 class="text-xl font-bold text-candy-text mb-2">账户已被禁用</h2>
            <p class="text-candy-text-secondary text-sm">您的账户已被管理员禁用，无法使用本应用。</p>
          </div>
        </div>`;
    }
    return;
  }

  if (!user) {
    navigateTo('name-entry');
  } else {
    navigateTo('home');
  }
}

// 暴露导航函数到全局，供页面使用
(window as unknown as Record<string, unknown>).__navigate = (page: PageName) => {
  navigateTo(page);
};

bootstrap();