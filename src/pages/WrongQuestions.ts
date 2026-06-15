import { navigateTo } from '../router';
import { getCurrentUser, getUserWrongQuestions, markWrongQuestionMastered, getQuizBanks, getWrongCountForQuestion } from '../storage';
import type { Question, WrongQuestionEntry } from '../types';

let selectedWrongQuestions: Question[] = [];

export function getSelectedWrongQuestions(): Question[] {
  return selectedWrongQuestions;
}

export function renderWrongQuestions(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const user = getCurrentUser();
  if (!user) { navigateTo('name-entry'); return; }

  const wrongEntries = getUserWrongQuestions(user.id);
  const banks = getQuizBanks();

  // 构建错题列表（含题目详情）
  const wrongWithQuestions: { entry: WrongQuestionEntry; question: Question; bankName: string }[] = [];

  for (const entry of wrongEntries) {
    for (const bank of banks) {
      const q = bank.questions.find((q) => q.id === entry.questionId);
      if (q) {
        wrongWithQuestions.push({ entry, question: q, bankName: bank.name });
        break;
      }
    }
  }

  const listHtml = wrongWithQuestions.length === 0
    ? `<div class="text-center py-12 text-candy-text-muted">
        <div class="text-5xl mb-3">🎉</div>
        <p class="font-semibold">太棒了！没有错题~</p>
        <p class="text-sm mt-1">继续保持！</p>
      </div>`
    : wrongWithQuestions.map(({ entry, question, bankName }, i) => `
      <div class="card-candy mb-3 animate-fade-in-up delay-${(i % 5) * 100}">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-0.5 rounded-full bg-candy-border text-candy-primary font-bold">${getTypeLabelShort(question.type)}</span>
              <span class="text-xs text-candy-text-muted">${bankName}</span>
            </div>
            <p class="text-sm text-candy-text font-semibold truncate">${getQuestionPreview(question)}</p>
            <p class="text-xs text-candy-primary mt-1">做错 <span class="font-bold">${entry.wrongCount}</span> 次</p>
          </div>
          <button class="master-btn flex-shrink-0 ml-3 px-3 py-1.5 rounded-xl bg-candy-accent text-white text-xs font-bold hover:bg-candy-accent/80 transition-colors"
                  data-question-id="${entry.questionId}">
            已掌握
          </button>
        </div>
      </div>`).join('');

  const canRetry = wrongWithQuestions.length > 0;

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <div class="flex items-center gap-3 mb-4 animate-fade-in-up">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">错题集</h1>
        <span class="text-sm text-candy-text-muted">(${wrongWithQuestions.length}道)</span>
      </div>

      <div class="flex-1" id="wrong-list">
        ${listHtml}
      </div>

      ${canRetry ? `
      <div class="mt-4 animate-fade-in-up delay-300">
        <button id="redo-all-btn" class="btn-candy btn-strawberry w-full">
          🔄 重刷全部错题
        </button>
      </div>` : ''}
    </div>`;

  document.getElementById('back-home-btn')?.addEventListener('click', () => navigateTo('home'));

  // 绑定"已掌握"按钮
  document.querySelectorAll('.master-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const questionId = (btn as HTMLElement).dataset.questionId;
      if (questionId && user) {
        markWrongQuestionMastered(user.id, questionId);
        renderWrongQuestions();
      }
    });
  });

  // 重刷全部
  document.getElementById('redo-all-btn')?.addEventListener('click', () => {
    selectedWrongQuestions = wrongWithQuestions.map(({ question }) => question);
    // 存储 questionId → quizBankId 映射，供答题页错题记录使用
    const bankIdMap: Record<string, string> = {};
    wrongWithQuestions.forEach(({ entry }) => {
      bankIdMap[entry.questionId] = entry.quizBankId;
    });
    sessionStorage.setItem('wrong_questions_bank_map', JSON.stringify(bankIdMap));
    sessionStorage.setItem('wrong_questions_mode', 'true');
    navigateTo('quiz');
  });
}

function getTypeLabelShort(type: string): string {
  switch (type) {
    case 'single-choice': return '单选';
    case 'matching': return '消消乐';
    case 'sentence-order': return '排序';
    default: return type;
  }
}

function getQuestionPreview(q: Question): string {
  switch (q.type) {
    case 'single-choice':
      return q.question.length > 30 ? q.question.slice(0, 30) + '...' : q.question;
    case 'matching':
      return q.question.length > 30 ? q.question.slice(0, 30) + '...' : q.question;
    case 'sentence-order':
      return q.question.length > 30 ? q.question.slice(0, 30) + '...' : q.question;
    default:
      return '未知题型';
  }
}