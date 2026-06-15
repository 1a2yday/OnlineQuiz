import { navigateTo } from '../router';
import { getQuizBanks, getLeaderboard } from '../storage';
import { formatTime } from '../utils';

export function renderLeaderboard(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const banks = getQuizBanks();

  if (banks.length === 0) {
    app.innerHTML = `
      <div class="phone-container flex flex-col min-h-screen p-4">
        <div class="flex items-center gap-3 mb-4">
          <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
          <h1 class="text-xl font-black text-candy-text">排行榜</h1>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center text-candy-text-muted">
            <div class="text-5xl mb-3">🏆</div>
            <p class="font-semibold">还没有题库</p>
            <p class="text-sm mt-1">请先导入题库开始练习</p>
          </div>
        </div>
      </div>`;
    document.getElementById('back-home-btn')?.addEventListener('click', () => navigateTo('home'));
    return;
  }

  const tabsHtml = banks.map((b, i) => `
    <button class="leaderboard-tab px-4 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-candy-primary text-white' : 'bg-candy-border text-candy-primary'}"
            data-bank-id="${b.id}">
      ${b.name}
    </button>
  `).join('');

  // 默认显示第一个题库的排行榜
  const firstBank = banks[0];
  const leaderboard = getLeaderboard(firstBank.id);

  const listHtml = leaderboard.length > 0
    ? leaderboard.map((r, i) => `
      <div class="flex items-center justify-between py-3 px-4 ${i === 0 ? 'bg-candy-highlight/20 rounded-2xl' : ''} ${i < 3 ? 'mb-2' : 'mb-1'}">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black
            ${i === 0 ? 'bg-candy-highlight text-white' : i === 1 ? 'bg-[#C0C0C0] text-white' : i === 2 ? 'bg-[#CD7F32] text-white' : 'bg-candy-bg-light text-candy-text-secondary'}">
            ${i + 1}
          </span>
          <div>
            <p class="font-semibold text-candy-text text-sm">${r.userName}</p>
            <p class="text-xs text-candy-text-muted">${formatTime(r.timeSeconds)}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-candy-primary">${r.correctCount}/${r.totalCount}</p>
          <p class="text-xs text-candy-text-muted">${Math.round((r.correctCount / r.totalCount) * 100)}%</p>
        </div>
      </div>
    `).join('')
    : '<p class="text-center text-candy-text-muted text-sm py-8">暂无记录，快去刷题吧！</p>';

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <div class="flex items-center gap-3 mb-4">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">排行榜</h1>
      </div>

      <!-- 题库标签 -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-4" id="leaderboard-tabs">
        ${tabsHtml}
      </div>

      <!-- 排行榜列表 -->
      <div class="flex-1" id="leaderboard-list">
        ${listHtml}
      </div>
    </div>`;

  document.getElementById('back-home-btn')?.addEventListener('click', () => navigateTo('home'));

  // 绑定标签切换
  document.querySelectorAll('.leaderboard-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const bankId = (tab as HTMLElement).dataset.bankId;
      if (!bankId) return;

      // 更新标签样式
      document.querySelectorAll('.leaderboard-tab').forEach((t) => {
        t.classList.remove('bg-candy-primary', 'text-white');
        t.classList.add('bg-candy-border', 'text-candy-primary');
      });
      tab.classList.add('bg-candy-primary', 'text-white');
      tab.classList.remove('bg-candy-border', 'text-candy-primary');

      // 更新列表
      const records = getLeaderboard(bankId);
      const listEl = document.getElementById('leaderboard-list');
      if (listEl) {
        listEl.innerHTML = records.length > 0
          ? records.map((r, i) => `
            <div class="flex items-center justify-between py-3 px-4 ${i === 0 ? 'bg-candy-highlight/20 rounded-2xl' : ''} ${i < 3 ? 'mb-2' : 'mb-1'}">
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black
                  ${i === 0 ? 'bg-candy-highlight text-white' : i === 1 ? 'bg-[#C0C0C0] text-white' : i === 2 ? 'bg-[#CD7F32] text-white' : 'bg-candy-bg-light text-candy-text-secondary'}">
                  ${i + 1}
                </span>
                <div>
                  <p class="font-semibold text-candy-text text-sm">${r.userName}</p>
                  <p class="text-xs text-candy-text-muted">${formatTime(r.timeSeconds)}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-candy-primary">${r.correctCount}/${r.totalCount}</p>
                <p class="text-xs text-candy-text-muted">${Math.round((r.correctCount / r.totalCount) * 100)}%</p>
              </div>
            </div>
          `).join('')
          : '<p class="text-center text-candy-text-muted text-sm py-8">暂无记录，快去刷题吧！</p>';
      }
    });
  });
}