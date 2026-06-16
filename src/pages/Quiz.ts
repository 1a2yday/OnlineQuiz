import { navigateTo } from '../router';
import { getQuizBanks, getCurrentUser, recordWrongAnswer, getWrongCountForQuestion } from '../storage';
import { formatTime, shuffle } from '../utils';
import { getSelectedQuizBankId } from './QuizBank';
import { playSelect, playMatch, playCorrect, playWrong, playAllMatched } from '../sound';
import type { Question, SingleChoiceQuestion, MatchingQuestion, SentenceOrderQuestion } from '../types';

interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: (number | [number, number][] | number[])[];
  startTime: number;
  timerInterval: ReturnType<typeof setInterval> | null;
  elapsedSeconds: number;
  answeredCorrect: boolean[];
  isWrongQuestionsMode: boolean; // 是否为错题重刷模式
  wrongBankIdMap: Record<string, string>; // 错题模式：questionId → quizBankId
}

let session: QuizSession;

// ========== 粒子特效 ==========
/** 在匹配成功的卡片位置产生星星粒子爆炸效果 */
function spawnParticles(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#FFD700', '#FF6B9D', '#667EEA', '#2EC4A7', '#FF8C42', '#FFC940'];

  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
    const distance = 30 + Math.random() * 40;
    const px = Math.cos(angle) * distance;
    const py = Math.sin(angle) * distance;
    particle.style.cssText = `
      left: ${cx}px;
      top: ${cy}px;
      background: ${colors[i % colors.length]};
      --px: ${px}px;
      --py: ${py}px;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
    `;
    document.body.appendChild(particle);
    // 动画结束后清理
    setTimeout(() => particle.remove(), 550);
  }
}

export function renderQuiz(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const user = getCurrentUser();
  if (!user) { navigateTo('name-entry'); return; }

  // 优先检查是否为错题重刷模式
  const isWrongMode = sessionStorage.getItem('wrong_questions_mode') === 'true';
  if (isWrongMode) {
    sessionStorage.removeItem('wrong_questions_mode');
    initWrongQuestionsSession();
    return;
  }

  const bankId = getSelectedQuizBankId();
  const banks = getQuizBanks();
  const bank = banks.find((b) => b.id === bankId);

  if (!bank) {
    // 可能是错题重刷模式（fallback）
    initWrongQuestionsSession();
    return;
  }

  initNormalSession(bank.questions);
}

function initNormalSession(questions: Question[]): void {
  session = {
    questions: [...questions],
    currentIndex: 0,
    answers: [],
    startTime: Date.now(),
    timerInterval: null,
    elapsedSeconds: 0,
    answeredCorrect: [],
    isWrongQuestionsMode: false,
    wrongBankIdMap: {},
  };
  startQuiz();
}

function initWrongQuestionsSession(): void {
  const user = getCurrentUser();
  if (!user) return;

  // 读取错题 bankId 映射
  let bankIdMap: Record<string, string> = {};
  try {
    const raw = sessionStorage.getItem('wrong_questions_bank_map');
    if (raw) bankIdMap = JSON.parse(raw) as Record<string, string>;
  } catch { /* ignore */ }

  import('./WrongQuestions').then(({ getSelectedWrongQuestions }) => {
    const questions = getSelectedWrongQuestions();
    if (!questions || questions.length === 0) {
      navigateTo('wrong-questions');
      return;
    }
    session = {
      questions: [...questions],
      currentIndex: 0,
      answers: [],
      startTime: Date.now(),
      timerInterval: null,
      elapsedSeconds: 0,
      answeredCorrect: [],
      isWrongQuestionsMode: true,
      wrongBankIdMap: bankIdMap,
    };
    startQuiz();
  });
}

function startQuiz(): void {
  startTimer();
  renderQuestion();
}

function startTimer(): void {
  session.timerInterval = setInterval(() => {
    session.elapsedSeconds = Math.floor((Date.now() - session.startTime) / 1000);
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) {
      timerEl.textContent = formatTime(session.elapsedSeconds);
    }
  }, 500);
}

function stopTimer(): void {
  if (session.timerInterval) {
    clearInterval(session.timerInterval);
    session.timerInterval = null;
  }
}

function renderQuestion(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const q = session.questions[session.currentIndex];
  if (!q) {
    finishQuiz();
    return;
  }

  const total = session.questions.length;
  const current = session.currentIndex + 1;
  const progress = (session.currentIndex / total) * 100;
  const user = getCurrentUser();
  const wrongCount = user ? getWrongCountForQuestion(user.id, q.id) : 0;

  let questionBody: string;
  switch (q.type) {
    case 'single-choice':
      questionBody = renderSingleChoice(q);
      break;
    case 'matching':
      questionBody = renderMatching(q);
      break;
    case 'sentence-order':
      questionBody = renderSentenceOrder(q);
      break;
    default:
      questionBody = '<p>未知题型</p>';
  }

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 顶部栏 -->
      <div class="flex items-center justify-between mb-3">
        <button id="quit-quiz-btn" class="text-sm text-candy-text-muted underline">退出</button>
        <div class="flex items-center gap-2">
          <span class="text-xs text-candy-text-muted">${current}/${total}</span>
          <span id="quiz-timer" class="font-bold text-candy-primary text-sm">${formatTime(session.elapsedSeconds)}</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-candy mb-4">
        <div class="progress-candy-fill" style="width:${progress}%"></div>
      </div>

      <!-- 题型标签 -->
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs px-3 py-1 rounded-full bg-candy-border text-candy-primary font-bold">
          ${getTypeLabel(q.type)}
        </span>
        ${wrongCount > 0 ? `<span class="text-xs px-3 py-1 rounded-full bg-candy-highlight text-candy-text font-bold">做错${wrongCount}次</span>` : ''}
      </div>

      <!-- 题目内容 -->
      <div class="flex-1">
        ${questionBody}
      </div>

      <!-- 底部按钮 -->
      <div class="mt-4">
        <button id="submit-answer-btn" class="btn-candy btn-strawberry w-full" style="display:none">
          确认答案
        </button>
        <button id="next-question-btn" class="btn-candy btn-mint w-full" style="display:none">
          下一题 →
        </button>
      </div>
    </div>`;

  // 绑定事件
  document.getElementById('quit-quiz-btn')?.addEventListener('click', () => {
    if (confirm('确定要退出答题吗？当前进度不会保存。')) {
      stopTimer();
      navigateTo(session.isWrongQuestionsMode ? 'wrong-questions' : 'quiz-bank');
    }
  });

  if (q.type === 'single-choice') {
    bindSingleChoiceEvents(q);
  } else if (q.type === 'matching') {
    bindMatchingEvents(q);
  } else if (q.type === 'sentence-order') {
    bindSentenceOrderEvents(q);
  }
}

/** 将换行符转换为 <br>，支持题干中的多行文本 */
function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>');
}

// ========== 单选题 ==========
function renderSingleChoice(q: SingleChoiceQuestion): string {
  const options = q.options.map((opt, i) => `
    <button class="option-btn single-option" data-index="${i}">
      <span class="inline-block w-7 h-7 rounded-full bg-candy-border text-candy-primary text-sm font-bold leading-7 text-center mr-3">${String.fromCharCode(65 + i)}</span>
      ${opt}
    </button>
  `).join('');

  return `
    <div class="card-candy">
      <h3 class="text-lg font-bold text-candy-text mb-4">${nl2br(q.question)}</h3>
      <div id="single-options">${options}</div>
      <div id="explanation-area" class="hidden mt-4 p-3 rounded-xl bg-candy-bg-light border border-candy-border text-sm text-candy-text-secondary leading-relaxed"></div>
    </div>`;
}

let selectedSingleChoice: number | null = null;
let singleChoiceSubmitted = false;

function bindSingleChoiceEvents(q: SingleChoiceQuestion): void {
  const options = document.querySelectorAll('.single-option');
  const submitBtn = document.getElementById('submit-answer-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('next-question-btn') as HTMLButtonElement;
  selectedSingleChoice = null;
  singleChoiceSubmitted = false;

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      if (singleChoiceSubmitted || opt.hasAttribute('disabled')) return;
      options.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedSingleChoice = Number((opt as HTMLElement).dataset.index);
      playSelect();
      if (submitBtn) submitBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = 'none';
    });
  });

  submitBtn?.addEventListener('click', () => {
    if (selectedSingleChoice === null || singleChoiceSubmitted) return;
    singleChoiceSubmitted = true;
    if (submitBtn) submitBtn.style.display = 'none';
    options.forEach((o) => { (o as HTMLButtonElement).disabled = true; });
    const isCorrect = selectedSingleChoice === q.answer;
    handleSingleChoiceResult(q, isCorrect);
    if (nextBtn) nextBtn.style.display = '';
  }, { once: true });

  nextBtn?.addEventListener('click', () => {
    session.currentIndex++;
    selectedSingleChoice = null;
    singleChoiceSubmitted = false;
    renderQuestion();
  });
}

function handleSingleChoiceResult(q: SingleChoiceQuestion, isCorrect: boolean): void {
  const options = document.querySelectorAll('.single-option');
  options.forEach((opt, i) => {
    (opt as HTMLButtonElement).disabled = true;
    if (i === q.answer) {
      opt.classList.add('correct');
      opt.innerHTML += ' ✓';
    }
    if (i === selectedSingleChoice && !isCorrect) {
      opt.classList.add('wrong');
      opt.classList.add('animate-shake');
      opt.innerHTML += ' ✗';
    }
  });

  session.answers.push(selectedSingleChoice!);
  session.answeredCorrect.push(isCorrect);

  if (isCorrect) {
    playCorrect();
  } else {
    playWrong();
    const user = getCurrentUser();
    if (user) {
      recordWrongAnswer(user.id, q.id, getCurrentQuestionBankId(q.id));
    }
  }

  showExplanation(q.explanation);
}

// ========== 消消乐 ==========
interface MatchingState {
  leftSelected: number | null;
  rightSelected: number | null;
  matched: Set<string>; // "leftIdx-rightIdx"
  pairs: [number, number][];
}

let matchingState: MatchingState;

function renderMatching(q: MatchingQuestion): string {
  matchingState = {
    leftSelected: null,
    rightSelected: null,
    matched: new Set(),
    pairs: q.pairs,
  };

  const leftItems = q.left.map((item, i) => `
    <div class="matching-item matching-left p-3 rounded-xl border-2 border-candy-border bg-white text-center font-semibold text-candy-text cursor-pointer transition-all"
         data-side="left" data-index="${i}">
      ${item}
    </div>
  `).join('');

  const rightItems = shuffle(q.right.map((item, i) => ({ item, origIdx: i })))
    .map(({ item, origIdx }) => `
    <div class="matching-item matching-right p-3 rounded-xl border-2 border-candy-border bg-white text-center font-semibold text-candy-text cursor-pointer transition-all"
         data-side="right" data-index="${origIdx}">
      ${item}
    </div>
  `).join('');

  return `
    <div class="card-candy">
      <h3 class="text-lg font-bold text-candy-text mb-2">${nl2br(q.question)}</h3>
      <p class="text-xs text-candy-text-muted mb-4">点击左侧再点击右侧进行匹配</p>
      <div class="flex gap-3">
        <div class="flex-1 flex flex-col gap-2" id="matching-left">${leftItems}</div>
        <div class="flex-1 flex flex-col gap-2" id="matching-right">${rightItems}</div>
      </div>
      <div id="explanation-area" class="hidden mt-4 p-3 rounded-xl bg-candy-bg-light border border-candy-border text-sm text-candy-text-secondary leading-relaxed"></div>
    </div>`;
}

function bindMatchingEvents(q: MatchingQuestion): void {
  const submitBtn = document.getElementById('submit-answer-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('next-question-btn') as HTMLButtonElement;

  // 消消乐不需要确认按钮——全部匹配即等于确认
  if (submitBtn) submitBtn.style.display = 'none';

  const leftItems = document.querySelectorAll('.matching-left');
  const rightItems = document.querySelectorAll('.matching-right');

  /** 检查某个 left/right 索引是否已被任何 pair 匹配 */
  function isItemMatched(side: 'left' | 'right', index: number): boolean {
    return matchingState.pairs.some(([l, r]) => {
      const key = `${l}-${r}`;
      return matchingState.matched.has(key) && (side === 'left' ? l === index : r === index);
    });
  }

  leftItems.forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number((el as HTMLElement).dataset.index);
      if (isItemMatched('left', idx)) return;

      playSelect();
      // 取消之前的左选择
      leftItems.forEach((l) => l.classList.remove('matching-selected'));
      el.classList.add('matching-selected');
      matchingState.leftSelected = idx;

      checkMatchingPair();
    });
  });

  rightItems.forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number((el as HTMLElement).dataset.index);
      // 检查当前 right 是否已被任何 pair 匹配
      if (isItemMatched('right', idx)) return;

      playSelect();
      rightItems.forEach((r) => r.classList.remove('matching-selected'));
      el.classList.add('matching-selected');
      matchingState.rightSelected = idx;

      checkMatchingPair();
    });
  });

  function checkMatchingPair(): void {
    if (matchingState.leftSelected === null || matchingState.rightSelected === null) return;

    const pair = matchingState.pairs.find(
      ([l, r]) => l === matchingState.leftSelected && r === matchingState.rightSelected
    );

    if (pair) {
      // 匹配成功
      const key = `${pair[0]}-${pair[1]}`;
      matchingState.matched.add(key);

      playMatch();
      leftItems.forEach((l) => {
        if (Number((l as HTMLElement).dataset.index) === pair[0]) {
          l.classList.add('matching-matched');
          l.classList.remove('matching-selected');
          spawnParticles(l as HTMLElement);
        }
      });
      rightItems.forEach((r) => {
        if (Number((r as HTMLElement).dataset.index) === pair[1]) {
          r.classList.add('matching-matched');
          r.classList.remove('matching-selected');
          spawnParticles(r as HTMLElement);
        }
      });

      matchingState.leftSelected = null;
      matchingState.rightSelected = null;

      // 检查是否全部匹配 → 自动完成
      if (matchingState.matched.size === q.pairs.length) {
        playAllMatched();
        handleMatchingComplete(q, nextBtn);
      }
    } else {
      // 匹配失败 - 抖动后取消选择
      playWrong();
      leftItems.forEach((l) => {
        if (l.classList.contains('matching-selected')) {
          l.classList.add('animate-shake');
          setTimeout(() => l.classList.remove('animate-shake'), 500);
        }
      });
      rightItems.forEach((r) => {
        if (r.classList.contains('matching-selected')) {
          r.classList.add('animate-shake');
          setTimeout(() => r.classList.remove('animate-shake'), 500);
        }
      });
      matchingState.leftSelected = null;
      matchingState.rightSelected = null;
      leftItems.forEach((l) => l.classList.remove('matching-selected'));
      rightItems.forEach((r) => r.classList.remove('matching-selected'));
    }
  }

  /** 全部匹配完成后的处理：记录结果、高亮答案、自动推进或显示解析 */
  function handleMatchingComplete(q: MatchingQuestion, nextBtn: HTMLButtonElement | null): void {
    const userPairs: [number, number][] = [];
    matchingState.matched.forEach((key) => {
      const [l, r] = key.split('-').map(Number);
      userPairs.push([l, r]);
    });

    const isCorrect = matchingState.matched.size === q.pairs.length &&
      q.pairs.every(([l, r]) => matchingState.matched.has(`${l}-${r}`));

    session.answers.push(userPairs);
    session.answeredCorrect.push(isCorrect);

    if (!isCorrect) {
      const user = getCurrentUser();
      if (user) {
        recordWrongAnswer(user.id, q.id, getCurrentQuestionBankId(q.id));
      }
    }

    // 高亮正确答案，禁用所有点击
    highlightMatchingAnswers(q);
    leftItems.forEach((el) => { (el as HTMLElement).style.pointerEvents = 'none'; });
    rightItems.forEach((el) => { (el as HTMLElement).style.pointerEvents = 'none'; });

    if (q.explanation) {
      // 有解析 → 显示解析 + 下一题按钮
      showExplanation(q.explanation);
      if (nextBtn) nextBtn.style.display = '';
    } else {
      // 无解析 → 短暂高亮后自动进入下一题
      setTimeout(() => {
        session.currentIndex++;
        renderQuestion();
      }, 600);
    }
  }

  nextBtn?.addEventListener('click', () => {
    session.currentIndex++;
    renderQuestion();
  });
}

function highlightMatchingAnswers(q: MatchingQuestion): void {
  const leftItems = document.querySelectorAll('.matching-left');
  const rightItems = document.querySelectorAll('.matching-right');

  q.pairs.forEach(([l, r]) => {
    const matched = matchingState.matched.has(`${l}-${r}`);
    leftItems.forEach((el) => {
      if (Number((el as HTMLElement).dataset.index) === l) {
        el.classList.add(matched ? 'correct' : 'wrong');
        el.classList.remove('matching-matched', 'matching-selected');
        (el as HTMLElement).style.pointerEvents = 'none';
      }
    });
    rightItems.forEach((el) => {
      if (Number((el as HTMLElement).dataset.index) === r) {
        el.classList.add(matched ? 'correct' : 'wrong');
        el.classList.remove('matching-matched', 'matching-selected');
        (el as HTMLElement).style.pointerEvents = 'none';
      }
    });
  });
}

// ========== 还原句子 ==========
let sentenceOrderState: {
  selectedOrder: number[];
  availableIndices: number[];
};

function renderSentenceOrder(q: SentenceOrderQuestion): string {
  sentenceOrderState = {
    selectedOrder: [],
    availableIndices: q.words.map((_, i) => i),
  };

  // 打乱单词显示顺序，保留原始索引用于答案判断
  const wordChips = shuffle(q.words.map((word, i) => ({ word, origIdx: i })))
    .map(({ word, origIdx }) => `
    <span class="word-chip word-available" data-index="${origIdx}">${word}</span>
  `).join('');

  return `
    <div class="card-candy">
      <h3 class="text-lg font-bold text-candy-text mb-1">还原句子</h3>
      <p class="text-sm text-candy-primary font-semibold mb-4">${nl2br(q.question)}</p>

      <!-- 已选区域 -->
      <div id="sentence-result" class="min-h-[52px] p-3 rounded-2xl border-2 border-dashed border-candy-border-strong bg-candy-bg-light mb-4 flex flex-wrap gap-2 items-center">
        <span class="text-sm text-candy-text-light">按正确顺序点击下方单词...</span>
      </div>

      <!-- 待选单词 -->
      <div id="sentence-words" class="flex flex-wrap gap-2">
        ${wordChips}
      </div>

      <div id="explanation-area" class="hidden mt-4 p-3 rounded-xl bg-candy-bg-light border border-candy-border text-sm text-candy-text-secondary leading-relaxed"></div>
    </div>`;
}

function bindSentenceOrderEvents(q: SentenceOrderQuestion): void {
  const submitBtn = document.getElementById('submit-answer-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('next-question-btn') as HTMLButtonElement;
  const resultArea = document.getElementById('sentence-result');
  const wordsArea = document.getElementById('sentence-words');

  function updateDisplay(): void {
    if (!resultArea || !wordsArea) return;

    const { selectedOrder, availableIndices } = sentenceOrderState;

    if (selectedOrder.length === 0) {
      resultArea.innerHTML = '<span class="text-sm text-candy-text-light">按正确顺序点击下方单词...</span>';
    } else {
      resultArea.innerHTML = selectedOrder.map((idx, i) => `
        <span class="word-chip selected-for-order cursor-pointer" data-remove="${i}">${q.words[idx]}</span>
      `).join('');
      // 绑定已选单词的点击移除
      resultArea.querySelectorAll('[data-remove]').forEach((el) => {
        el.addEventListener('click', () => {
          const removeIdx = Number((el as HTMLElement).dataset.remove);
          const removed = sentenceOrderState.selectedOrder.splice(removeIdx, 1)[0];
          sentenceOrderState.availableIndices.push(removed);
          sentenceOrderState.availableIndices.sort((a, b) => a - b);
          updateDisplay();
        });
      });
    }

    wordsArea.innerHTML = availableIndices.map((idx) => `
      <span class="word-chip word-available cursor-pointer" data-index="${idx}">${q.words[idx]}</span>
    `).join('');

    // 绑定可选单词的点击
    wordsArea.querySelectorAll('.word-available').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = Number((el as HTMLElement).dataset.index);
        const availIdx = sentenceOrderState.availableIndices.indexOf(idx);
        if (availIdx >= 0) {
          playSelect();
          sentenceOrderState.availableIndices.splice(availIdx, 1);
          sentenceOrderState.selectedOrder.push(idx);
          updateDisplay();
        }
      });
    });

    // 显示/隐藏确认按钮
    if (selectedOrder.length === q.words.length) {
      if (submitBtn) submitBtn.style.display = '';
    } else {
      if (submitBtn) submitBtn.style.display = 'none';
    }
  }

  updateDisplay();

  submitBtn?.addEventListener('click', () => {
    const userAnswer = [...sentenceOrderState.selectedOrder];
    const isCorrect = arraysEqual(userAnswer, q.answer);

    session.answers.push(userAnswer);
    session.answeredCorrect.push(isCorrect);

    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
      const user = getCurrentUser();
      if (user) {
        recordWrongAnswer(user.id, q.id, getCurrentQuestionBankId(q.id));
      }
    }

    // 显示正确/错误
    if (resultArea) {
      const correctOrder = q.answer.map((idx) => q.words[idx]).join(' ');
      if (isCorrect) {
        resultArea.innerHTML = `<div class="text-candy-accent font-bold animate-bounce-in">✓ 正确！</div>`;
      } else {
        resultArea.innerHTML = `
          <div class="text-candy-primary font-bold animate-shake">✗ 错误</div>
          <div class="text-sm text-candy-text-secondary mt-1">正确顺序：${correctOrder}</div>`;
      }
    }

    showExplanation(q.explanation);
    if (submitBtn) submitBtn.style.display = 'none';
    // 禁用所有单词点击
    if (wordsArea) wordsArea.querySelectorAll('.word-available').forEach(el => ((el as HTMLElement).style.pointerEvents = 'none'));
    if (resultArea) resultArea.querySelectorAll('.selected-for-order').forEach(el => ((el as HTMLElement).style.pointerEvents = 'none'));
    if (nextBtn) nextBtn.style.display = '';
  }, { once: true });

  nextBtn?.addEventListener('click', () => {
    session.currentIndex++;
    renderQuestion();
  });
}

// ========== 完成答题 ==========
function finishQuiz(): void {
  stopTimer();
  const totalSeconds = session.elapsedSeconds;
  const correctCount = session.answeredCorrect.filter(Boolean).length;
  const totalCount = session.questions.length;

  const user = getCurrentUser();
  const banks = getQuizBanks();

  if (session.isWrongQuestionsMode) {
    // 错题重刷模式：问题来自多个题库，按来源题库分别保存记录
    if (user) {
      const bankRecords = new Map<string, { correct: number; total: number }>();
      session.questions.forEach((q, i) => {
        const qBankId = session.wrongBankIdMap[q.id] || '__unknown__';
        const entry = bankRecords.get(qBankId) || { correct: 0, total: 0 };
        entry.total += 1;
        if (session.answeredCorrect[i]) entry.correct += 1;
        bankRecords.set(qBankId, entry);
      });
      import('../storage').then(({ saveQuizRecord }) => {
        bankRecords.forEach((record, qBankId) => {
          const b = banks.find((x) => x.id === qBankId);
          saveQuizRecord({
            userId: user.id,
            userName: user.name,
            quizBankId: qBankId,
            quizBankName: b?.name || '错题重刷',
            correctCount: record.correct,
            totalCount: record.total,
            timeSeconds: totalSeconds,
            timestamp: Date.now(),
          });
        });
      });
    }

    sessionStorage.setItem('quiz_result', JSON.stringify({
      correctCount,
      totalCount,
      timeSeconds: totalSeconds,
      quizBankId: '',
      quizBankName: '错题重刷',
      isWrongQuestionsMode: true,
    }));
  } else {
    // 普通模式
    const bankId = getSelectedQuizBankId();
    const bank = banks.find((b) => b.id === bankId);

    if (user && bank) {
      import('../storage').then(({ saveQuizRecord }) => {
        saveQuizRecord({
          userId: user.id,
          userName: user.name,
          quizBankId: bank.id,
          quizBankName: bank.name,
          correctCount,
          totalCount,
          timeSeconds: totalSeconds,
          timestamp: Date.now(),
        });
      });
    }

    sessionStorage.setItem('quiz_result', JSON.stringify({
      correctCount,
      totalCount,
      timeSeconds: totalSeconds,
      quizBankId: bankId || '',
      quizBankName: bank?.name || '未知题库',
      isWrongQuestionsMode: false,
    }));
  }

  navigateTo('quiz-result');
}

/** 显示答案解析 */
function showExplanation(explanation?: string): void {
  const area = document.getElementById('explanation-area');
  if (!area) return;
  if (explanation) {
    area.innerHTML = `<span class="font-bold text-candy-primary">💡 解析：</span>${explanation}`;
    area.classList.remove('hidden');
  }
}

/** 获取当前题目所属题库 ID（兼容错题重刷模式） */
function getCurrentQuestionBankId(questionId: string): string {
  if (session.isWrongQuestionsMode) {
    return session.wrongBankIdMap[questionId] || '';
  }
  return getSelectedQuizBankId() || '';
}

// ========== 工具函数 ==========
function getTypeLabel(type: string): string {
  switch (type) {
    case 'single-choice': return '单选题';
    case 'matching': return '消消乐';
    case 'sentence-order': return '还原句子';
    default: return type;
  }
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}