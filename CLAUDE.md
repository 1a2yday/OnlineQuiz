# OnlineQuiz — 英语刷题助手

糖果风手机适配答题应用，支持三种题型（单选/消消乐/还原句子），纯前端 SPA。

## Quick Start

```bash
npm install --ignore-scripts  # 首次安装依赖
npm run dev:local              # 启动开发服务器（端口5000，HMR热更新）
npm run build:local            # 生产构建 → dist/
npm run preview                # 预览构建产物
```

## 技术栈

Vite 7 + TypeScript + Tailwind CSS 3 + Express（开发服务器），纯静态部署。

## 类型检查

```bash
npx tsc --noEmit  # 快速类型检查，无需完整构建
```

## 目录结构

```
├── src/           # 前端源码（入口 index.ts，页面在 pages/）
├── server/        # Express 开发服务器 + API 路由
├── public/quizzes/ # 远程题库 JSON（manifest.json 注册）
├── tools/         # 独立 HTML 工具
│   ├── quiz-generator.html  # CSV/Excel → JSON 题库生成
│   ├── quiz-editor.html     # 可视化题库编辑（拖拽排序/序号移动/直接保存/预览）
│   └── quiz-manager.html    # 题库管理器（拖拽排序/启用禁用/删除重命名/预览）
└── dist/          # 构建产物（部署此目录）
```

## 关键注意事项

- ⚠️ **CSS hidden 类冲突**：`.btn-candy` 等无层组件的显隐必须用 `style.display` 操作，禁止用 `classList.toggle('hidden')`（详情见 AGENTS.md）
- ⚠️ **JSON 引号**：Windows 下 AI 编辑工具可能将 `"` 转为弯引号 `"` `"`，破坏 JSON。修复用 Node 脚本
- ⚠️ **localStorage key 前缀**：所有存储键统一为 `english_quiz_`
- ⚠️ **访问计数器**：`POST/GET /api/visits` 依赖 Express 服务器（需 `npm start`），纯静态部署不可用；修改 `src/` 或 `server/` 后需重启生效
- ⚠️ **TS 模板字面量中禁止 `<script>`**：`src/pages/` 的模板字符串内不可使用 `<script>` 标签，事件绑定必须在 render 后的 TS 代码中用 `addEventListener` 完成
- ⚠️ **tools/ 浏览器 API**：`tools/` 目录的 HTML 工具使用浏览器端 File System Access API（`showOpenFilePicker`/`showSaveFilePicker`/`createWritable`），仅 Chromium 支持，须提供 `<input type="file">` 降级
- ⚠️ **File System Access API 记忆目录**：`showDirectoryPicker` 的 `startIn` 参数可传入已保存的 `FileSystemHandle`，使弹出窗口默认定位到上次目录；`FileSystemDirectoryHandle` 需用 IndexedDB 持久化（localStorage 不支持结构化克隆）
- ⚠️ **sessionStorage 传参**：页面间传参使用 `sessionStorage`（关闭时自动清除），跨页面前在 `storage.ts` 或 `utils.ts` 中统一加 `english_quiz_` 前缀

## 随机顺序

答题前可勾选「🔄 题目出现顺序随机」（QuizBank.ts），进入答题后题目顺序被 `shuffle()` 打乱。标志通过 `sessionStorage`（`english_quiz_randomize`）传递到 Quiz.ts。

## 完整文档

详见 `AGENTS.md`（356行）涵盖：题型实现、用户系统、安全机制、远程题库、题库生成格式等。

## 部署

1. `npm run build:local` → `dist/`
2. 将 `dist/` 上传到 GitHub Pages 或任意静态托管
3. 自建服务器可用 `npm start`（Express 生产模式，含访问计数 API）
