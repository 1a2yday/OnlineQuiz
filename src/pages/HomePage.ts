import { navigateTo } from '../router';
import { getCurrentUser, getAppConfig, isBlacklisted } from '../storage';
import { isAdminUser, setAdminUser } from '../utils';
import { THEMES, getSavedThemeId, saveThemeId, applyTheme, getCurrentTheme } from '../themes';

export function renderHomePage(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const user = getCurrentUser();
  if (!user) {
    navigateTo('name-entry');
    return;
  }

  if (isBlacklisted(user.id)) {
    app.innerHTML = `
      <div class="phone-container flex items-center justify-center p-6">
        <div class="card-candy text-center p-8 w-full">
          <div class="text-5xl mb-4">🚫</div>
          <h2 class="text-xl font-bold text-candy-text mb-2">账户已被禁用</h2>
          <p class="text-candy-text-secondary text-sm">您的账户已被管理员禁用。</p>
        </div>
      </div>`;
    return;
  }

  const config = getAppConfig();
  const admin = isAdminUser(user.id);

  // 横幅：优先显示 banner.gif，加载失败则显示默认渐变
  const bannerHtml = `
    <img src="${config.bannerUrl || 'banner.gif'}" alt="Banner"
         class="w-full rounded-2xl object-cover max-h-48"
         onerror="this.style.display='none';document.getElementById('fallback-banner')?.classList.remove('hidden')" />
    <div id="fallback-banner" class="hidden w-full rounded-2xl bg-gradient-to-br from-candy-primary via-candy-primary-light to-candy-border-strong p-6 text-white text-center">
      <div class="text-4xl mb-2">🍬</div>
      <h2 class="text-xl font-black">${config.welcomeTitle}</h2>
      <p class="text-sm opacity-80 mt-1">${config.welcomeSubtitle}</p>
    </div>`;

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <!-- 横幅 -->
      <div class="mb-4 animate-fade-in-up">
        ${bannerHtml}
      </div>

      <!-- 用户信息条 -->
      <div class="flex items-center justify-between mb-6 px-2 animate-fade-in-up delay-100">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-candy-primary to-candy-primary-light flex items-center justify-center text-white font-bold text-sm">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <span class="font-bold text-candy-text">${user.name}</span>
          ${admin ? '<span class="text-xs bg-candy-highlight text-candy-text px-2 py-1 rounded-full font-bold">管理员</span>' : ''}
        </div>
        <div class="flex items-center gap-2">
          <button id="switch-user-btn" class="text-xs text-candy-text-muted underline">切换用户</button>
        </div>
      </div>

      <!-- 功能按钮区 -->
      <div class="flex flex-col gap-3 flex-1">
        <button id="btn-quiz-bank" class="btn-candy btn-strawberry w-full text-lg animate-fade-in-up delay-200">
          📚 题库练习
        </button>
        <button id="btn-wrong" class="btn-candy btn-grape w-full text-lg animate-fade-in-up delay-300">
          📝 错题重刷
        </button>
        <button id="btn-leaderboard" class="btn-candy btn-mint w-full text-lg animate-fade-in-up delay-400">
          🏆 排行榜<span class="text-xs opacity-60">（仅本机）</span>
        </button>
        ${admin ? `
        <button id="btn-admin" class="btn-candy btn-lemon w-full text-lg animate-fade-in-up delay-500">
          ⚙️ 管理面板
        </button>` : `
        <button id="btn-admin-login" class="btn-candy btn-outline w-full text-sm animate-fade-in-up delay-500">
          🔑 管理员入口
        </button>`}
      </div>

      <!-- 管理员登录弹窗 -->
      <div id="admin-login-modal" class="hidden fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
        <div class="bg-white rounded-t-3xl w-full max-w-[480px] p-6 animate-fade-in-up">
          <h3 class="text-lg font-black text-candy-text mb-4">管理员验证</h3>
          <input id="admin-password-input" type="password" placeholder="请输入管理员密码"
            class="w-full px-4 py-3 rounded-2xl border-2 border-candy-border text-candy-text text-center outline-none focus:border-candy-primary" />
          <p id="admin-password-error" class="text-candy-primary text-sm mt-2 hidden"></p>
          <div class="flex gap-3 mt-4">
            <button id="cancel-admin-login-btn" class="btn-candy btn-outline flex-1">取消</button>
            <button id="confirm-admin-login-btn" class="btn-candy btn-strawberry flex-1">确认</button>
          </div>
        </div>
      </div>

      <!-- 主题切换 -->
      <div class="card-candy mt-4 p-3 animate-fade-in-up delay-500">
        <p class="text-xs text-candy-text-muted mb-2 text-center">🎨 配色方案</p>
        <div class="flex justify-center gap-3" id="theme-swatches">
          ${THEMES.map((t) => `
            <div class="theme-swatch ${getSavedThemeId() === t.id ? 'active' : ''}"
                 data-theme-id="${t.id}"
                 title="${t.name}"
                 style="background: linear-gradient(135deg, ${t.primary}, ${t.primaryLight})">
            </div>
          `).join('')}
        </div>
        <p class="text-xs text-candy-text-muted text-center mt-1" id="theme-name-label">${getCurrentTheme().emoji} ${getCurrentTheme().name}</p>
      </div>

      <!-- 底部提示 -->
      <p class="text-center text-xs text-candy-text-light mt-4 animate-fade-in-up delay-500">
        点击题库练习开始刷题吧~
      </p>
    </div>`;

  // 绑定事件
  document.getElementById('btn-quiz-bank')?.addEventListener('click', () => navigateTo('quiz-bank'));
  document.getElementById('btn-wrong')?.addEventListener('click', () => navigateTo('wrong-questions'));
  document.getElementById('btn-leaderboard')?.addEventListener('click', () => navigateTo('leaderboard'));
  document.getElementById('btn-admin')?.addEventListener('click', () => navigateTo('admin'));

  document.getElementById('switch-user-btn')?.addEventListener('click', () => {
    if (confirm('确定要切换用户吗？')) {
      import('../storage').then(({ setCurrentUser }) => {
        setCurrentUser(null);
        navigateTo('name-entry');
      });
    }
  });

  // 管理员登录
  const adminModal = document.getElementById('admin-login-modal');
  const adminLoginBtn = document.getElementById('btn-admin-login');
  const cancelAdminBtn = document.getElementById('cancel-admin-login-btn');
  const confirmAdminBtn = document.getElementById('confirm-admin-login-btn');
  const passwordInput = document.getElementById('admin-password-input') as HTMLInputElement;
  const passwordError = document.getElementById('admin-password-error');

  adminLoginBtn?.addEventListener('click', () => {
    adminModal?.classList.remove('hidden');
    setTimeout(() => passwordInput?.focus(), 200);
  });

  cancelAdminBtn?.addEventListener('click', () => adminModal?.classList.add('hidden'));
  adminModal?.addEventListener('click', (e) => {
    if (e.target === adminModal) adminModal.classList.add('hidden');
  });

  confirmAdminBtn?.addEventListener('click', () => {
    const pwd = passwordInput?.value.trim() || '';
    const cfg = getAppConfig();
    if (pwd === cfg.adminPassword) {
      setAdminUser(user.id, true);
      adminModal?.classList.add('hidden');
      renderHomePage();
    } else {
      if (passwordError) {
        passwordError.textContent = '密码错误';
        passwordError.classList.remove('hidden');
      }
    }
  });

  passwordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmAdminBtn?.click();
  });

  // 主题切换
  document.querySelectorAll('.theme-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const themeId = (swatch as HTMLElement).dataset.themeId;
      if (!themeId) return;
      const theme = THEMES.find((t) => t.id === themeId);
      if (!theme) return;
      saveThemeId(themeId);
      applyTheme(theme);
      // 更新选中状态
      document.querySelectorAll('.theme-swatch').forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      const label = document.getElementById('theme-name-label');
      if (label) label.textContent = `${theme.emoji} ${theme.name}`;
    });
  });
}