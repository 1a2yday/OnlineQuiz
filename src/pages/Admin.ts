import { navigateTo } from '../router';
import { getCurrentUser, getUsers, getBlacklist, addToBlacklist, removeFromBlacklist, deleteUserData, getAppConfig, setAppConfig, getQuizBanks, deleteQuizBank } from '../storage';
import { isAdminUser, escapeHtml, isValidUrl, setAdminPassword } from '../utils';

export function renderAdmin(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const user = getCurrentUser();
  if (!user || !isAdminUser(user.id)) {
    navigateTo('home');
    return;
  }

  const config = getAppConfig();
  const blacklist = getBlacklist();
  const allUsers = getUsers();
  const banks = getQuizBanks();

  const blacklistHtml = blacklist.length === 0
    ? '<p class="text-sm text-candy-text-muted text-center py-4">黑名单为空</p>'
    : blacklist.map((b) => `
      <div class="flex items-center justify-between py-2 px-3 bg-candy-bg-light rounded-xl mb-2">
        <div>
          <p class="font-semibold text-candy-text text-sm">${b.userName}</p>
          <p class="text-xs text-candy-text-muted">ID: ${b.userId}</p>
        </div>
        <button class="unblock-btn px-3 py-1 rounded-xl bg-candy-accent text-white text-xs font-bold" data-user-id="${b.userId}">
          解除
        </button>
      </div>
    `).join('');

  const usersHtml = allUsers.length === 0
    ? '<p class="text-sm text-candy-text-muted text-center py-4">暂无用户</p>'
    : allUsers.map((u) => {
      const blocked = blacklist.some((b) => b.userId === u.id);
      return `
      <div class="flex items-center justify-between py-2 px-3 bg-white rounded-xl mb-2 border border-candy-border">
        <div>
          <p class="font-semibold text-candy-text text-sm">${u.name} ${blocked ? '<span class="text-xs text-candy-primary">(已拉黑)</span>' : ''}</p>
          <p class="text-xs text-candy-text-muted">ID: ${u.id}</p>
        </div>
        ${!blocked ? `
        <button class="block-btn px-3 py-1 rounded-xl bg-candy-primary text-white text-xs font-bold" data-user-id="${u.id}" data-user-name="${u.name}">
          拉黑
        </button>` : ''}
      </div>`;
    }).join('');

  const banksHtml = banks.length === 0
    ? '<p class="text-sm text-candy-text-muted text-center py-4">暂无题库</p>'
    : banks.map((b) => `
      <div class="flex items-center justify-between py-2 px-3 bg-white rounded-xl mb-2 border border-candy-border">
        <div>
          <p class="font-semibold text-candy-text text-sm">${b.name}</p>
          <p class="text-xs text-candy-text-muted">${b.questions.length}道题</p>
        </div>
        <button class="delete-bank-btn px-3 py-1 rounded-xl bg-candy-primary text-white text-xs font-bold" data-bank-id="${b.id}">
          删除
        </button>
      </div>
    `).join('');

  app.innerHTML = `
    <div class="phone-container flex flex-col min-h-screen p-4">
      <div class="flex items-center gap-3 mb-4">
        <button id="back-home-btn" class="text-2xl text-candy-primary leading-none">&larr;</button>
        <h1 class="text-xl font-black text-candy-text">管理面板</h1>
      </div>

      <div class="space-y-4">
        <!-- 主页外观设置 -->
        <div class="card-candy animate-fade-in-up">
          <h3 class="font-black text-candy-text mb-3">🎨 主页外观</h3>

          <p class="text-xs text-candy-text-secondary mb-2">📷 横幅图（将 banner.gif 放在根目录，或填写图片URL）</p>
          <div class="flex gap-2 mb-3">
            <input id="banner-input" type="text" value="${escapeHtml(config.bannerUrl)}" placeholder="banner.gif"
              class="flex-1 px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary" />
            <button id="save-banner-btn" class="btn-candy btn-strawberry text-sm px-4">保存</button>
          </div>
          ${isValidUrl(config.bannerUrl) ? `<img src="${escapeHtml(config.bannerUrl)}" class="w-full rounded-xl max-h-32 object-cover mb-2" onerror="this.style.display='none'" />` : ''}
          <button id="reset-banner-btn" class="text-xs text-candy-text-muted underline">重置为 banner.gif</button>

          <div class="mt-4 pt-4 border-t border-candy-border">
            <p class="text-xs text-candy-text-secondary mb-2">✏️ 欢迎文字（图片不可用时显示）</p>
            <input id="welcome-title-input" type="text" value="${escapeHtml(config.welcomeTitle)}" placeholder="欢迎标题"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <input id="welcome-subtitle-input" type="text" value="${escapeHtml(config.welcomeSubtitle)}" placeholder="欢迎副标题"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <button id="save-welcome-btn" class="btn-candy btn-strawberry text-sm px-4">保存欢迎文字</button>
          </div>

          <div class="mt-4 pt-4 border-t border-candy-border">
            <p class="text-xs text-candy-text-secondary mb-2">🔐 修改管理员密码</p>
            <input id="admin-old-pwd" type="password" placeholder="当前密码"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <input id="admin-new-pwd" type="password" placeholder="新密码（至少6位）"
              class="w-full px-4 py-2 rounded-xl border-2 border-candy-border text-sm text-candy-text outline-none focus:border-candy-primary mb-2" />
            <p id="pwd-msg" class="text-xs text-candy-primary mb-2 hidden"></p>
            <button id="change-pwd-btn" class="btn-candy btn-strawberry text-sm px-4">修改密码</button>
          </div>
        </div>

        <!-- 题库管理 -->
        <div class="card-candy animate-fade-in-up delay-100">
          <h3 class="font-black text-candy-text mb-3">📚 题库管理 (${banks.length}个)</h3>
          <div id="banks-list">${banksHtml}</div>
        </div>

        <!-- 用户管理 -->
        <div class="card-candy animate-fade-in-up delay-200">
          <h3 class="font-black text-candy-text mb-3">👥 用户管理 (${allUsers.length}人)</h3>
          <div id="users-list">${usersHtml}</div>
        </div>

        <!-- 黑名单 -->
        <div class="card-candy animate-fade-in-up delay-300">
          <h3 class="font-black text-candy-text mb-3">🚫 黑名单 (${blacklist.length}人)</h3>
          <div id="blacklist-list">${blacklistHtml}</div>
        </div>
      </div>
    </div>`;

  document.getElementById('back-home-btn')?.addEventListener('click', () => navigateTo('home'));

  // 横幅图
  document.getElementById('save-banner-btn')?.addEventListener('click', () => {
    const input = document.getElementById('banner-input') as HTMLInputElement;
    if (input) {
      setAppConfig({ bannerUrl: input.value.trim() || 'banner.gif' });
      renderAdmin();
    }
  });

  document.getElementById('reset-banner-btn')?.addEventListener('click', () => {
    setAppConfig({ bannerUrl: 'banner.gif' });
    renderAdmin();
  });

  // 欢迎文字
  document.getElementById('save-welcome-btn')?.addEventListener('click', () => {
    const titleInput = document.getElementById('welcome-title-input') as HTMLInputElement;
    const subtitleInput = document.getElementById('welcome-subtitle-input') as HTMLInputElement;
    setAppConfig({
      welcomeTitle: titleInput?.value.trim() || '英语刷题助手',
      welcomeSubtitle: subtitleInput?.value.trim() || 'Sweet English, Sweet Learning!',
    });
    renderAdmin();
  });

  // 修改管理员密码
  document.getElementById('change-pwd-btn')?.addEventListener('click', async () => {
    const oldPwd = (document.getElementById('admin-old-pwd') as HTMLInputElement)?.value || '';
    const newPwd = (document.getElementById('admin-new-pwd') as HTMLInputElement)?.value.trim() || '';
    const msgEl = document.getElementById('pwd-msg');
    const showMsg = (msg: string) => {
      if (msgEl) { msgEl.textContent = msg; msgEl.classList.remove('hidden'); }
    };

    if (newPwd.length < 6) {
      showMsg('新密码至少6位');
      return;
    }

    const { verifyAdminPassword } = await import('../utils');
    const valid = await verifyAdminPassword(oldPwd);
    if (!valid) {
      showMsg('当前密码错误');
      return;
    }

    await setAdminPassword(newPwd);
    // 清空旧的管理员会话标记，下次需要重新验证
    localStorage.removeItem('english_quiz_admins');
    showMsg('密码修改成功！下次访问管理面板请用新密码。');
    (document.getElementById('admin-old-pwd') as HTMLInputElement).value = '';
    (document.getElementById('admin-new-pwd') as HTMLInputElement).value = '';
    setTimeout(() => msgEl?.classList.add('hidden'), 3000);
  });

  // 拉黑用户
  document.querySelectorAll('.block-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = btn as HTMLElement;
      const userId = el.dataset.userId;
      const userName = el.dataset.userName;
      if (userId && userName && confirm(`确定拉黑用户「${userName}」吗？将删除其所有数据。`)) {
        addToBlacklist(userId, userName);
        deleteUserData(userId);
        renderAdmin();
      }
    });
  });

  // 解除拉黑
  document.querySelectorAll('.unblock-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const userId = (btn as HTMLElement).dataset.userId;
      if (userId && confirm('确定解除拉黑吗？')) {
        removeFromBlacklist(userId);
        renderAdmin();
      }
    });
  });

  // 删除题库
  document.querySelectorAll('.delete-bank-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bankId = (btn as HTMLElement).dataset.bankId;
      if (bankId && confirm('确定删除该题库吗？此操作不可撤销。')) {
        deleteQuizBank(bankId);
        renderAdmin();
      }
    });
  });
}