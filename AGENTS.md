# 项目上下文

## 项目概述
英语刷题助手 - 糖果风手机适配答题应用，支持多种题型（单选题、消消乐匹配、还原句子），纯前端静态页面，数据存储在 localStorage。可部署到 GitHub Pages 等任意静态托管服务。

## 技术栈

- **核心**: Vite 7, TypeScript
- **UI**: Tailwind CSS, 自定义糖果风 CSS（CSS 变量驱动的多主题系统）
- **字体**: Nunito (英文), Noto Sans SC (中文) via Google Fonts CN
- **部署**: 纯静态，`dist/` 目录直传 GitHub Pages

## 目录结构

```
├── tools/               # 辅助工具
│   └── quiz-generator.html  # 题库生成工具（CSV→JSON，A列题型自动识别）
├── scripts/             # 构建与启动脚本
│   ├── build.sh         # 构建脚本
│   ├── dev.sh           # 开发环境启动脚本
│   ├── prepare.sh       # 预处理脚本
│   └── start.sh         # 生产环境启动脚本
├── server/              # 服务端逻辑（仅开发环境使用）
│   ├── routes/          # API 路由（示例，项目不实际调用）
│   ├── server.ts        # Express 服务入口
│   └── vite.ts          # Vite 中间件集成
├── src/                 # 前端源码
│   ├── index.css        # 全局样式（CSS变量 + 组件样式）
│   ├── index.ts         # 客户端入口、SPA路由注册、主题初始化
│   ├── types.ts         # 所有 TypeScript 类型定义
│   ├── storage.ts       # localStorage 数据层封装
│   ├── utils.ts         # 工具函数（ID生成、验证、敏感词、管理员）
│   ├── router.ts        # SPA Hash路由（支持浏览器前进/后退）
│   ├── themes.ts        # 主题系统（4套糖果色方案 + CSS变量注入）
│   ├── sampleQuiz.ts    # 示例题库数据
│   └── pages/           # 页面组件
│       ├── HomePage.ts        # 主页（横幅/按钮/主题切换/管理员登录）
│       ├── NameEntry.ts       # 首次取名页
│       ├── QuizBank.ts        # 题库列表与管理（含导入/删除）
│       ├── Quiz.ts            # 答题页（核心，三种题型 + 错题重刷模式）
│       ├── QuizResult.ts      # 答题结果与排行榜
│       ├── WrongQuestions.ts  # 错题集（含已掌握标记）
│       ├── Leaderboard.ts     # 排行榜（按题库分标签）
│       └── Admin.ts           # 管理面板（横幅/欢迎文字/题库/用户/黑名单）
├── index.html           # 入口 HTML
├── package.json         # 项目依赖管理
├── tsconfig.json        # TypeScript 配置
├── tailwind.config.js   # Tailwind 配置（自定义 candy 色板）
└── vite.config.ts       # Vite 配置
```

## 核心设计

### 数据存储
- 所有数据存储在 localStorage，无后端依赖
- 题库、用户、答题记录、错题、黑名单、配置、主题偏好分别存储在不同的 key 下
- localStorage key 前缀统一为 `english_quiz_`

### SPA 路由
- 基于 Hash 路由，通过 `registerRoute` + `navigateTo` 管理页面切换
- 支持浏览器前进/后退按钮（`hashchange` 事件监听）
- 页面注册在 `src/index.ts` 的 `bootstrap` 函数中

### 主题系统
- 4套糖果色主题方案，通过 CSS 变量（`--c-primary`, `--c-bg` 等 22 个）驱动
- **默认主题：蜂蜜柠檬糖**（暖橘色 `#FF8C42`），不再是粉色
- 可选主题：薄荷糖 `#00BFA5` / 草莓糖 `#FF6B9D` / 蓝莓糖 `#667EEA`
- 主页底部提供主题色块切换，偏好保存到 localStorage
- Tailwind 自定义 `candy-*` 色板映射到 CSS 变量（`text-candy-primary` 等）
- 所有页面颜色均使用 CSS 变量，切换主题即时生效无需刷新

### 题型支持
- `single-choice`: 单选题 - 点击选项后确认，正确绿色高亮，错误红色抖动
- `matching`: 消消乐 - 点击左侧（英文）再点击右侧（中文）配对，**右侧每次随机打乱**，已匹配项防污染保护。全部配对成功后**自动判定结果**：有解析则显示解析 + 下一题按钮，无解析则 600ms 高亮后**自动进入下一题**（无需确认按钮）
- `sentence-order`: 还原句子 - 单词随机打乱显示，按正确顺序依次点击排列，支持回退选词
- 所有题型均支持 `explanation`（解析）字段，在用户作答后显示 💡 解析
- **作答流程**：
  - **单选题**：点击选项 → 点「确认答案」→ 显示对/错 + 解析 → 点「下一题」
  - **消消乐**：依次点击左/右配对 → 全部配对成功 → 自动判定 → 有解析显示解析+下一题 / 无解析 600ms 后自动跳题
  - **还原句子**：依次点击单词排列 → 点「确认答案」→ 显示对/错 + 解析 → 点「下一题」
  - **确认/下一题按钮互斥**：两个按钮**绝不会同时显示**。
    - 初始状态：两个按钮均 `style="display:none"`
    - 用户选择/排列完成 → 确认按钮 `style.display=''`，下一题按钮 `style.display='none'`
    - 点击确认 → 确认按钮 `style.display='none'`，下一题按钮 `style.display=''`
    - 单选题使用 `singleChoiceSubmitted` 标志位防止提交后再次触发确认
    - 确认按钮使用 `{ once: true }` 防止重复点击，提交后**选项/单词立即禁用**
  - ⚠️ **CSS 层级陷阱**：`.btn-candy { display: inline-flex }` 写在 `index.css` 无层区域，Tailwind 的 `.hidden { display: none }` 在 `@layer utilities` 内。按 CSS 规范，无层样式始终覆盖层内样式——因此 `classList.add('hidden')` 对 `.btn-candy` 元素**完全无效**。所有按钮显隐必须使用内联 `style.display` 操作，禁用 `classList` 切换 `hidden`。

### 用户系统
- 首次使用需取名（最多5中文/10英文，含敏感词过滤）
- 每个用户唯一 ID，错题独立存储
- 管理员通过密码验证（默认: admin123）
- 管理员可拉黑用户、删除题库、修改横幅图、编辑欢迎文字

### 横幅与主页
- 横幅图默认读取根目录 `banner.gif`，加载失败则显示渐变横幅
- 欢迎标题/副标题可在管理面板中随时修改
- ⚠️ 管理面板的修改存储在 localStorage，仅当前浏览器可见
- **部署后让所有用户看到自定义内容**：编辑 `src/storage.ts` 修改默认值后重新构建

### 静态内容定制（修改后需重新 `npm run build:local`）
| 想修改的内容 | 编辑文件 | 位置 |
|-------------|---------|------|
| 横幅图 | 替换根目录 `banner.gif` | 部署到 `dist/` 根目录 |
| 欢迎标题/副标题 | `src/storage.ts` | 搜索 `welcomeTitle` / `welcomeSubtitle`，改默认值 |
| 默认主题色 | `src/themes.ts` | 修改 `DEFAULT_THEME_ID` |
| 管理员密码 | `src/storage.ts` | 搜索 `adminPassword`，改默认值 |
| 应用标题 | `index.html` | `<title>` 标签 |

### 题库生成工具

`tools/quiz-generator.html` — 独立 HTML，双击即用，无需服务器。

**三种导入方式**：
1. **复制粘贴**：在 Excel 中按格式填写 → Ctrl+A Ctrl+C → 粘贴到 textarea → 解析预览
2. **上传 Excel**：点击「📁 上传 Excel」按钮 → 选择 .xlsx/.xls 文件 → 自动解析
3. **CSV 文本**：将 CSV 内容直接粘贴（支持 Tab/逗号分隔，自动检测）

**完整工作流**：
1. 在 Excel 中按表格格式填写题目（或让 AI 生成 CSV）
2. 打开 `tools/quiz-generator.html`，粘贴或上传数据
3. 填入题库名称 → ID 自动生成（可手动修改）
4. 点击「🔍 解析预览」检查是否有误，错误信息会红色高亮
5. 点击「➕ 全部加入题库」
6. 点击「📤 下载 JSON 文件」→ 放入 `public/quizzes/` 目录
7. 点击「📋 复制 Manifest 条目」→ 粘贴到 `public/quizzes/manifest.json` 的数组中
8. 运行 `npm run build:local` → 部署 `dist/` → **所有用户可见**

> ⚠️ **注意**：生成的 JSON 通过应用内的「导入题库」弹窗粘贴导入，导入后仅当前浏览器可见。**如需所有用户看到**，将题库 JSON 放入 `public/quizzes/` 目录并在 `manifest.json` 注册，重新构建部署。

### 远程题库系统（服务端托管）

`public/quizzes/` 目录下的题库 JSON 文件会在应用启动时自动拉取，**所有用户可见**，无需手动导入。

**目录结构**：
```
public/quizzes/
├── manifest.json              # 题库清单（注册每个题库的文件名和显示名）
├── grammar-basics.json        # 题库 JSON 文件
└── ...
```

**manifest.json 格式**：
```json
[
  {
    "id": "grammar-basics",
    "name": "📝 语法基础题库",
    "file": "grammar-basics.json",
    "description": "基础语法练习题"
  }
]
```

**添加新题库步骤**：
1. 用 `tools/quiz-generator.html` 生成题库 → 下载 JSON → 放入 `public/quizzes/`
2. 在工具中点击「📋 复制 Manifest 条目」→ 粘贴到 `public/quizzes/manifest.json` 的 `[...]` 数组中
3. 运行 `npm run build:local` 重新构建
4. 部署 `dist/` 到服务器 → 所有用户刷新后可见（📡 云端标识）

**特性**：
- 远程题库在题库列表中显示「📡 云端」标签，与本地导入题库区分
- 远程题库不可删除（删除按钮隐藏）
- 首次拉取后缓存到 localStorage，后续访问秒开
- 网络不通时使用缓存，不影响答题
- 应用启动时后台拉取，不阻塞页面渲染

---

## 题库制作格式规范（供 AI 生成题库使用）

以下规范用于让 AI 直接生成可导入的 CSV 题库。每行一道题，逗号分隔，**无需表头行**。

### 通用规则

- **CSV 格式**：逗号分隔。字段内含逗号时用英文双引号 `"` 包裹
- **多值分隔符**：竖线 `|`（选项之间、单词之间、配对之间）
- **A 列题型标识**（不区分大小写）：
  - `单选` → 单选题
  - `消消乐` → 消消乐配对
  - `还原句子` → 还原句子
- **解析列**：所有题型最后一列均可选填 `explanation`（💡 解析），留空则不显示解析

---

### 题型一：单选题 (`单选`)

**列布局**：`A:题型 | B:题目 | C:选项A | D:选项B | E:选项C | F:选项D | G:答案 | H:解析(可选)`

| 列 | 含义 | 说明 |
|----|------|------|
| A | `单选` | 题型标识 |
| B | 题目 | 英文题面，如 `What is the capital of UK?` |
| C | 选项A | 第1个选项 |
| D | 选项B | 第2个选项 |
| E | 选项C | 第3个选项 |
| F | 选项D | 第4个选项 |
| G | 答案 | `0`=A, `1`=B, `2`=C, `3`=D |
| H | 解析 | 可选，解释为什么选这个答案 |

**示例**：
```
单选,What is the capital of UK?,Manchester,London,Liverpool,Birmingham,1,英国的首都是伦敦（London）
单选,"Hello" means?,你好,再见,谢谢,对不起,0,Hello 是最常用的英语问候语
单选,She ___ to school every day.,go,goes,going,gone,1,主语 She 是第三人称单数，动词需用 goes
```

---

### 题型二：消消乐配对 (`消消乐`)

**列布局**：`A:题型 | B:说明 | C:左词 | D:右词 | E:配对(可选) | F:解析(可选)`

| 列 | 含义 | 说明 |
|----|------|------|
| A | `消消乐` | 题型标识 |
| B | 说明 | 配对主题，如 `请匹配水果英文与中文` |
| C | 左词 | 竖线分隔，如 `apple\|banana\|cherry` |
| D | 右词 | 竖线分隔，如 `苹果\|香蕉\|樱桃` |
| E | 配对 | **可选**。格式 `左索引-右索引\|...`。留空则默认按书写顺序一一配对（`0-0\|1-1\|2-2\|...`） |
| F | 解析 | 可选 |

> **答题时**：左侧按导入顺序显示，**右侧随机打乱**，因此导入时右列无需刻意乱序。

**示例**：
```
# 顺序配对 — E列留空即可
消消乐,请匹配水果英文与中文,apple|banana|cherry|grape,苹果|香蕉|樱桃|葡萄,,常见水果词汇

# 交叉配对 — E列手动指定（如不规则动词）
消消乐,请匹配动词与过去式,eat|go|see|take,went|saw|ate|took,0-2|1-0|2-1|3-3,不规则动词过去式需单独记忆
```

---

### 题型三：还原句子 (`还原句子`)

**列布局**：`A:题型 | B:中文提示 | C:单词 | D:正确顺序(可选) | E:解析(可选)`

| 列 | 含义 | 说明 |
|----|------|------|
| A | `还原句子` | 题型标识 |
| B | 中文提示 | 要还原的句子中文含义，如 `我喜欢在周末读书` |
| C | 单词 | 竖线分隔，**按正确句子顺序书写**，如 `I\|like\|reading\|books\|on\|weekends` |
| D | 正确顺序 | **可选**。格式 `0\|1\|2\|...`。留空则默认按 C 列单词书写顺序 |
| E | 解析 | 可选 |

> **答题时**：单词**随机打乱显示**，用户需按正确顺序依次点击排列。

**示例**：
```
# D列留空 — 单词按正确顺序写即可
还原句子,我喜欢在周末读书,I|like|reading|books|on|weekends,,英语语序：主+谓+宾+时间状语
还原句子,她每天喝咖啡,She|drinks|coffee|every|day,,第三人称单数 drink→drinks

# D列手动 — 单词乱序时需要指定正确顺序
还原句子,猫在桌子上睡觉,on|the|cat|sleeps|table|the,2|3|0|4|1|5,英语语序与中文不同
```

---

### 完整题库 CSV 示例

```
单选,What is the capital of UK?,Manchester,London,Liverpool,Birmingham,1,英国的首都是伦敦
单选,"Hello" means?,你好,再见,谢谢,对不起,0
单选,She ___ to school every day.,go,goes,going,gone,1,三单用 goes
消消乐,请匹配水果,apple|banana|cherry|grape,苹果|香蕉|樱桃|葡萄,,常见水果词汇
消消乐,请匹配动词过去式,eat|go|see|take,went|saw|ate|took,0-2|1-0|2-1|3-3,不规则动词
还原句子,我喜欢在周末读书,I|like|reading|books|on|weekends,,英语语序：主+谓+宾+状语
还原句子,她每天喝咖啡,She|drinks|coffee|every|day,,三单 drink→drinks
```

### 生成题库的注意事项

1. **单选题答案必须是 0-3 的数字**，对应 A/B/C/D 四个选项
2. **消消乐左右数量应相等**，否则自动配对时只取较短一侧的长度
3. **还原句子单词按正确顺序写**，D 列留空即可；仅当单词故意乱序时才需手动填 D 列
4. **解析是可选的**，不填不会报错，但建议填写以帮助学习者理解
5. **含逗号的字段必须用双引号包裹**（Excel 导出 CSV 会自动处理）
6. 含逗号的字段用双引号包裹，或直接使用 Excel 上传功能（避免 CSV 逗号问题）
7. 生成后粘贴到 `tools/quiz-generator.html` 中解析，检查无报错后导出 JSON，再通过应用「导入题库」功能导入

## 本地运行

```bash
# 安装依赖（首次，pnpm 不可用时用 npm --ignore-scripts）
npm install --ignore-scripts

# 启动开发服务器（HMR 热更新）
npm run dev:local

# 仅构建前端
npm run build:local

# 预览构建产物
npm run preview
```

## 开发规范

- 使用 Tailwind CSS 的 `candy-*` 自定义色板进行样式开发，禁止硬编码颜色值
- 所有圆角至少 12px，禁止暗色模式，禁止纯黑文字
- ⚠️ **禁止用 `classList` 切换 `hidden` 来控制 `.btn-candy` / `.card-candy` 等无层样式组件的显隐**（CSS 层级问题：无层样式覆盖 `@layer utilities`）。统一使用内联 `el.style.display = 'none'` / `el.style.display = ''`
- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any`；函数参数、返回值、事件对象在使用前明确类型
- 清理未使用的变量和导入
- 新页面通过 `registerRoute` 注册到 `src/index.ts`
- 数据操作统一通过 `src/storage.ts` 封装的函数

## 设计约束

- 手机适配：max-width 480px 居中，超出展示手机外壳
- 禁止暗色模式（Tailwind `darkMode` 已关闭）
- 圆角 ≥12px，阴影柔和（粉调/暖调）
- 文字颜色使用深紫灰/深棕（非纯黑）
- 动效：弹性缓出 `cubic-bezier(0.34, 1.56, 0.64, 1)`，0.2s 过渡
