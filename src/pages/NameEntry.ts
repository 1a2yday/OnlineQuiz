import { navigateTo } from '../router';
import { setCurrentUser } from '../storage';
import { generateUserId, validateName, hasSensitiveWords } from '../utils';
import type { User } from '../types';

export function renderNameEntry(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="phone-container flex flex-col items-center justify-center min-h-screen p-6">
      <div class="card-candy w-full p-8 animate-fade-in-up text-center">
        <!-- 糖果图标 -->
        <div class="text-5xl mb-4">🍬</div>
        <h1 class="text-2xl font-black text-candy-primary mb-2">英语刷题助手</h1>
        <p class="text-candy-text-secondary text-sm mb-6">Welcome! 请先给自己取个名字吧~</p>

        <div class="mb-4">
          <input
            id="name-input"
            type="text"
            placeholder="输入你的名字"
            maxlength="15"
            class="w-full px-5 py-3 rounded-2xl border-2 border-candy-border bg-candy-bg-light text-candy-text text-center text-lg font-semibold outline-none transition-all focus:border-candy-primary focus:bg-white"
            autocomplete="off"
          />
          <p class="text-xs text-candy-text-muted mt-2">最多5个中文字或10个英文字母</p>
        </div>

        <p id="name-error" class="text-candy-primary text-sm mb-4 hidden"></p>

        <button id="confirm-name-btn" class="btn-candy btn-strawberry w-full">
          开始学习 ✨
        </button>
      </div>
    </div>`;

  const input = document.getElementById('name-input') as HTMLInputElement;
  const errorEl = document.getElementById('name-error') as HTMLElement;
  const btn = document.getElementById('confirm-name-btn') as HTMLButtonElement;

  const handleConfirm = (): void => {
    const name = input.value.trim();
    const validation = validateName(name);

    if (!validation.valid) {
      errorEl.textContent = validation.error;
      errorEl.classList.remove('hidden');
      input.classList.add('animate-shake');
      setTimeout(() => input.classList.remove('animate-shake'), 500);
      return;
    }

    if (hasSensitiveWords(name)) {
      errorEl.textContent = '该名字不被允许，请换一个';
      errorEl.classList.remove('hidden');
      return;
    }

    errorEl.classList.add('hidden');

    const user: User = {
      id: generateUserId(),
      name,
      createdAt: Date.now(),
    };

    setCurrentUser(user);
    navigateTo('home');
  };

  btn.addEventListener('click', handleConfirm);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleConfirm();
  });

  // 自动聚焦
  setTimeout(() => input.focus(), 300);
}