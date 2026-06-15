import { navigateTo } from '../router';
import { getLeaderboard } from '../storage';
import { formatTime } from '../utils';

export function renderQuizResult(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const raw = sessionStorage.getItem('quiz_result');
  if (!raw) {
    navigateTo('home');
    return;
  }

  const result = JSON.parse(raw) as {
    correctCount: number;
    totalCount: number;
    timeSeconds: number;
    quizBankId: string;
    quizBankName: string;
    isWrongQuestionsMode: boolean;
  };

  const accuracy = result.totalCount > 0
    ? Math.round((result.correctCount / result.totalCount) * 100)
    : 0;

  const leaderboard = getLeaderboard(result.quizBankId).slice(0, 10);

  const getEmoji = (rate: number): string => {
    if (rate >= 90) return '🌟';
    if (rate >= 70) return '👍';
    if (rate >= 50) return '💪';
    return '📚';
  };

  const leaderboardHtml = leaderboard.length > 0
    ? leaderboard.map((r, i) => `
      <div class="flex items-center justify-between py-2 px-3 ${i === 0 ? 'bg-candy-highlight/20 rounded-xl' : ''}">
        <div class="flex items-center gap-2">
          <span class="text-lg font-black ${i === 0 ? 'text-candy-highlight' : i === 1 ? 'text-[#C0C0C0]' : i === 2 ? 'text-[#CD7F32]' : 'text-candy-text-muted'}">
            ${i + 1}
          </span>
          <span class="font-semibold text-candy-text text-sm">${r.userName}</span>
        </div>
        <div class="text-right text-xs">
          <span class="font-bold text-candy-primary">${r.correctCount}/${r.totalCount}</span>
          <span class="text-candy-text-muted ml-1">${formatTime(r.timeSeconds)}</span>
        </div>
      </div>
    `).join('')
    : '<p class="text-center text-candy-text-muted text-sm py-4">暂无排行记录</p>';

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 结果卡片 -->
      <div class="card-candy text-center mb-4 animate-bounce-in">
        <div class="text-5xl mb-3">${getEmoji(accuracy)}</div>
        <h2 class="text-xl font-black text-candy-text mb-2">答题完成！</h2>
        <p class="text-sm text-candy-text-secondary mb-4">${result.quizBankName}</p>

        <div class="flex gap-4 mb-4">
          <div class="flex-1 bg-candy-bg-light rounded-2xl p-3">
            <p class="text-3xl font-black text-candy-primary">${result.correctCount}<span class="text-lg text-candy-text-muted">/${result.totalCount}</span></p>
            <p class="text-xs text-candy-text-secondary mt-1">正确题数</p>
          </div>
          <div class="flex-1 bg-candy-accent/10 rounded-2xl p-3">
            <p class="text-3xl font-black text-candy-accent">${accuracy}<span class="text-lg">%</span></p>
            <p class="text-xs text-candy-text-secondary mt-1">正确率</p>
          </div>
          <div class="flex-1 bg-candy-highlight/20 rounded-2xl p-3">
            <p class="text-3xl font-black text-candy-highlight">${formatTime(result.timeSeconds)}</p>
            <p class="text-xs text-candy-text-secondary mt-1">用时</p>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div class="card-candy mb-4 animate-fade-in-up delay-200">
        <h3 class="font-black text-candy-text text-lg mb-3">🏆 排行榜 (${result.quizBankName})</h3>
        ${leaderboardHtml}
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col gap-3 mt-auto animate-fade-in-up delay-300">
        <button id="retry-btn" class="btn-candy btn-strawberry w-full">
          🔄 ${result.isWrongQuestionsMode ? '再次重刷' : '再刷一次'}
        </button>
        ${result.isWrongQuestionsMode ? `
        <button id="back-wrong-btn" class="btn-candy btn-grape w-full">
          📝 回到错题集
        </button>` : `
        <button id="back-bank-btn" class="btn-candy btn-grape w-full">
          📚 回到题库
        </button>`}
        <button id="back-home-btn" class="btn-candy btn-outline w-full">
          🏠 回到主页
        </button>
      </div>
    </div>`;

  document.getElementById('retry-btn')?.addEventListener('click', () => {
    if (result.isWrongQuestionsMode) {
      sessionStorage.setItem('wrong_questions_mode', 'true');
    }
    navigateTo('quiz');
  });

  document.getElementById('back-bank-btn')?.addEventListener('click', () => navigateTo('quiz-bank'));
  document.getElementById('back-wrong-btn')?.addEventListener('click', () => navigateTo('wrong-questions'));
  document.getElementById('back-home-btn')?.addEventListener('click', () => navigateTo('home'));
}