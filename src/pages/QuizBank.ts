import { navigateTo } from '../router';
import { getQuizBanks, deleteQuizBank, getCurrentUser, loadRemoteQuizzes } from '../storage';
import { isAdminUser, generateQuizBankId, generateQuestionId } from '../utils';
import type { QuizBank, Question } from '../types';
import { SAMPLE_QUIZ_JSON } from '../sampleQuiz';

let selectedQuizBankId: string | null = null;

// 监听远程题库加载完成，自动刷新列表
let remoteQuizListenerSetup = false;
function setupRemoteQuizListener(): void {
  if (remoteQuizListenerSetup) return;
  remoteQuizListenerSetup = true;
  window.addEventListener('remote-quizzes-loaded', () => {
    // 仅当用户在题库列表页时才刷新
    const app = document.getElementById('app');
    if (app?.querySelector('#bank-list')) {
      renderQuizBank();
    }
  });
}

export function getSelectedQuizBankId(): string | null {
  return selectedQuizBankId;
}

export function renderQuizBank(): void {
  const app = document.getElementById('app');
  if (!app) return;

  setupRemoteQuizListener();

  const user = getCurrentUser();
  if (!user) { navigateTo('name-entry'); return; }

  const banks = getQuizBanks();
  const admin = isAdminUser(user.id);

  const banksHtml = banks.length === 0
    ? `<div class="text-center py-12 text-candy-text-muted">
        <div class="text-5xl mb-3">📭</div>
        <p class="font-semibold">还没有题库哦~</p>
        <p class="text-sm mt-1">${admin ? '点击下方按钮导入题库' : '请联系管理员导入题库'}</p>
      </div>`
    : banks.map((bank, i) => {
        const isRemote = bank.id.startsWith('remote_');
        return `
      <div class="card-candy mb-3 animate-fade-in-up delay-${(i % 5) * 100} cursor-pointer hover:shadow-lg transition-shadow" data-bank-id="${bank.id}">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="font-bold text-candy-text text-lg">
              ${bank.name}
              ${isRemote ? '<span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold">📡 云端</span>' : ''}
            </h3>
            <p class="text-sm text-candy-text-muted mt-1">${bank.questions.length} 道题目</p>
          </div>
          <div class="flex items-center gap-2">
            ${admin && !isRemote ? `<button class="delete-bank-btn text-candy-primary text-sm px-2 py-1" data-bank-id="${bank.id}">删除</button>` : ''}
            <span class="text-candy-primary text-2xl">→</span>
          </div>
        </div>
      </div>`;
      }).join('');

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 顶部导航 -->
      <div class="flex items-center gap-3 mb-4 animate-fade-in-up">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text flex-1">题库列表</h1>
        <button id="refresh-banks-btn" class="text-sm text-candy-text-muted underline hover:text-candy-primary transition-colors" title="刷新云端题库">
          🔄 刷新
        </button>
      </div>

      <!-- 题库列表 -->
      <div class="flex-1" id="bank-list">
        ${banksHtml}
      </div>

      ${admin ? `
      <div class="mt-4 space-y-2 animate-fade-in-up delay-300">
        <button id="import-bank-btn" class="btn-candy btn-strawberry w-full">
          📥 导入题库 (JSON)
        </button>
        <button id="load-sample-btn" class="btn-candy btn-mint w-full text-sm">
          🎁 加载示例题库（体验三种题型）
        </button>
        <p class="text-xs text-candy-text-muted text-center mt-2">
          支持包含单选题、消消乐、还原句子的混合题库
        </p>
      </div>` : ''}

      <!-- 导入弹窗 -->
      <div id="import-modal" class="hidden fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
        <div class="bg-white rounded-t-3xl w-full max-w-[480px] p-6 animate-fade-in-up">
          <h3 class="text-lg font-black text-candy-text mb-4">导入题库</h3>
          <textarea id="import-json" class="w-full h-40 p-3 rounded-2xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary resize-none" placeholder='粘贴JSON格式的题库数据...'></textarea>
          <p id="import-error" class="text-candy-primary text-sm mt-2 hidden"></p>
          <div class="flex gap-3 mt-4">
            <button id="cancel-import-btn" class="btn-candy btn-outline flex-1">取消</button>
            <button id="confirm-import-btn" class="btn-candy btn-strawberry flex-1">确认导入</button>
          </div>
        </div>
      </div>
    </div>`;

  // 事件绑定
  document.getElementById('back-home-btn')?.addEventListener('click', () => navigateTo('home'));

  // 手动刷新云端题库
  document.getElementById('refresh-banks-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('refresh-banks-btn');
    if (btn) {
      btn.textContent = '⏳ 加载中...';
      (btn as HTMLButtonElement).disabled = true;
    }
    // 清除远程题库缓存
    localStorage.removeItem('english_quiz_remote_cache');
    // 重新拉取（完成后自动触发 remote-quizzes-loaded 事件刷新列表）
    await loadRemoteQuizzes();
    // 确保刷新列表（即使事件没触发也更新）
    renderQuizBank();
  });

  // 选择题库
  document.querySelectorAll('[data-bank-id]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('delete-bank-btn')) return;
      const bankId = (el as HTMLElement).dataset.bankId;
      if (bankId) {
        selectedQuizBankId = bankId;
        navigateTo('quiz');
      }
    });
  });

  // 删除题库
  document.querySelectorAll('.delete-bank-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bankId = (btn as HTMLElement).dataset.bankId;
      if (bankId && confirm('确定删除该题库吗？')) {
        deleteQuizBank(bankId);
        renderQuizBank();
      }
    });
  });

  // 导入题库
  const modal = document.getElementById('import-modal');
  const importBtn = document.getElementById('import-bank-btn');
  const cancelBtn = document.getElementById('cancel-import-btn');
  const confirmBtn = document.getElementById('confirm-import-btn');
  const textarea = document.getElementById('import-json') as HTMLTextAreaElement;
  const errorEl = document.getElementById('import-error');

  importBtn?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
    setTimeout(() => textarea?.focus(), 200);
  });

  // 加载示例题库
  document.getElementById('load-sample-btn')?.addEventListener('click', () => {
    if (!textarea) return;
    textarea.value = SAMPLE_QUIZ_JSON;
    modal?.classList.remove('hidden');
    setTimeout(() => textarea?.focus(), 200);
  });

  cancelBtn?.addEventListener('click', () => modal?.classList.add('hidden'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  confirmBtn?.addEventListener('click', () => {
    if (!textarea || !errorEl) return;
    try {
      const raw = JSON.parse(textarea.value.trim());

      // 验证题库格式
      if (!raw.name || !Array.isArray(raw.questions)) {
        throw new Error('题库格式错误：需要 name 和 questions 数组');
      }

      const questions: Question[] = raw.questions.map((q: Record<string, unknown>) => {
        const base = { id: q.id || generateQuestionId() };
        if (q.type === 'single-choice') {
          return {
            ...base,
            type: 'single-choice',
            question: String(q.question),
            options: q.options as string[],
            answer: Number(q.answer),
            explanation: q.explanation ? String(q.explanation) : undefined,
          };
        } else if (q.type === 'matching') {
          return {
            ...base,
            type: 'matching',
            question: String(q.question),
            left: q.left as string[],
            right: q.right as string[],
            pairs: q.pairs as [number, number][],
            explanation: q.explanation ? String(q.explanation) : undefined,
          };
        } else if (q.type === 'sentence-order') {
          return {
            ...base,
            type: 'sentence-order',
            question: String(q.question),
            words: q.words as string[],
            answer: q.answer as number[],
            explanation: q.explanation ? String(q.explanation) : undefined,
          };
        }
        throw new Error(`未知题型: ${q.type}`);
      });

      const bank: QuizBank = {
        id: generateQuizBankId(),
        name: String(raw.name),
        questions,
        createdAt: Date.now(),
      };

      import('../storage').then(({ saveQuizBank }) => {
        saveQuizBank(bank);
        modal?.classList.add('hidden');
        textarea.value = '';
        renderQuizBank();
      });
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = `导入失败：${(err as Error).message}`;
        errorEl.classList.remove('hidden');
      }
    }
  });
}