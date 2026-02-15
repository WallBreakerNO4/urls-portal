# 仓库代理指引（urls-portal）

本文件提供给会在此仓库内自动写代码/改代码的 agent。
目标：快速跑起来、按现有风格改、尽量不引入新约定。

## 项目概览

- 技术栈：Next.js App Router + React + TypeScript + Tailwind CSS v4 + shadcn/ui
- 部署形态：静态导出（`next.config.ts` 里 `output: "export"`）
- 数据来源：`data/urls.json`（页面里直接 `import` JSON）
- 路径别名：`@/*`（见 `tsconfig.json`）

关键文件：`next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/`, `components/ui/`, `lib/utils.ts`。

## 本地开发 / 构建 / 质量命令

### 安装依赖

推荐使用 pnpm（仓库存在 `pnpm-lock.yaml`）：

```bash
pnpm install
```

### 开发

```bash
pnpm dev
# 等价：npm run dev / yarn dev / bun dev
```

### 构建（静态导出）

```bash
pnpm build
```

- `next build`，静态产物输出到 `out/`

### 预览/运行

```bash
pnpm start
```

注意：开启 `output: "export"` 时更推荐用静态服务器直接服务 `out/`（仓库未内置脚本）。

### Lint

```bash
pnpm lint
```

- 脚本实际执行：`eslint`（见 `package.json`）
- ESLint 配置：`eslint.config.mjs`（Next core-web-vitals + TypeScript 预设）

### TypeScript 类型检查（无内置脚本，但可直接跑）

```bash
pnpm exec tsc -p tsconfig.json --noEmit
```

### 测试（当前缺失）

当前未定义任何测试：无 `test` 脚本、无测试文件、无 `.github/workflows/`。
因此“运行单个测试”的命令为：not found。
如后续引入测试框架，请补充：`pnpm test`（全量）与 `pnpm test -- <file>`（单测）。

## 代码风格与约定（以现有代码为准）

本仓库没有 Prettier/Biome/EditorConfig 配置；主要依赖：

- TypeScript `strict`（见 `tsconfig.json`）
- Next.js ESLint 预设（见 `eslint.config.mjs`）

### Imports

在代表文件 `app/page.tsx` / `app/layout.tsx` 中观察到的惯例：

- `import type ...` 放在最前
- 用空行分组：第三方/框架、项目内 `@/`、样式（如 `./globals.css`）
- 项目内一律优先用别名：`@/components/...`, `@/lib/...`, `@/data/...`

建议保持这种顺序，避免频繁重排 imports（除非 ESLint 要求）。

### 引号、分号与格式

- 普遍使用双引号（`"`）
- 分号使用不完全统一：
  - 许多文件省略行尾分号
  - 个别文件/场景（例如类型标注、或部分 TSX）会出现分号

原则：不要为了“统一风格”做全仓库格式化；只在修改的局部保持文件内一致。

### React / Next.js 约定

- Client Component：需要浏览器 API / hooks 的文件在首行加 `"use client"`
  - 示例：`components/theme-toggle.tsx`, `components/theme-provider.tsx`
- App Router 页面/布局：
  - `app/layout.tsx` 导出 `metadata` 并提供全局字体与主题 Provider
  - `app/page.tsx` 为首页展示逻辑

### 类型与数据校验

TypeScript 开启 `strict`；对不可信输入（例如 JSON）采用“类型守卫 + 归一化”模式：

- 示例：`app/page.tsx` 中 `isRecord` / `isUrlItem` / `normalizeUrlItems`
- 目标：不要让 `unknown` 直接流入渲染；先过滤/规整，再渲染

禁止：用 `as any`/`@ts-ignore` 绕过类型（仓库也未出现这些写法）。

### 错误处理

UI hooks/contexts 常见模式：当 hook 未包在 Provider 中时直接 `throw new Error(...)`：

- 示例：`components/ui/sidebar.tsx`, `components/ui/carousel.tsx`, `components/ui/chart.tsx`

一般逻辑（例如页面数据处理）更偏向“返回空数组/默认值”，而非捕获异常。

### 样式与 UI

- Tailwind v4：`app/globals.css` 通过 `@import "tailwindcss";` 启用
- 组件样式：大量 shadcn/ui 组件在 `components/ui/*`
- className 合并：统一用 `cn()`（`lib/utils.ts`）
- 动效与主题：
  - `tw-animate-css` + shadcn 变量
  - 主题切换基于 `next-themes`（class 模式）

写 UI 时：优先复用 `components/ui/*`，不要另造一套按钮/弹窗/表单体系。

## 目录与约定速查

- `app/`：路由与页面（App Router）
- `components/`：业务组件与 UI 组件
- `components/ui/`：shadcn 组件库（保持生成/维护方式一致）
- `data/urls.json`：URL 数据（数组元素形如 `{ "name": string, "url": string }`）
- `public/`：静态资源
- `out/`：构建产物（静态导出）

## Cursor / Copilot 规则

当前未发现：`.cursor/rules/`、`.cursorrules`、`.github/copilot-instructions.md`（后续加入请同步更新本节）。

## Agent 工作流建议（在此仓库内）

- 改代码前先跑：`pnpm lint`（必要时再 `pnpm exec tsc -p tsconfig.json --noEmit`）
- UI 改动后建议跑：`pnpm build`，确认静态导出仍正常生成 `out/`
- 不要引入新格式化工具或全量重排 imports；保持“局部一致 + ESLint 通过”即可
- 涉及 `data/urls.json`：保持数据最小可信（页面会过滤非法项，但不要依赖过滤来隐藏错误数据）
