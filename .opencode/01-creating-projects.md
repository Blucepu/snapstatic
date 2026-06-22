# 创建项目规范

> 供 AI 读取。创建新项目时必须严格按以下步骤执行，不得跳过，不得调换顺序。

---

## 前置条件检查

```bash
bun --version   # 必须存在，≥ 1.0.0
```

若未安装，停止并提示用户访问 https://bun.sh 安装。

---

## 步骤一：创建 Vite + React + TypeScript 项目

```bash
bun create vite@latest <项目名> --template react-ts
cd <项目名>
bun install
```

项目名使用小写字母 + 连字符，如 `client-report`、`product-showcase`。

在 `index.html` 的 `<head>` 中添加默认图标（用户可后续自行替换）：

```html
<link rel="icon" type="image/x-icon" href="https://zbanx.com/favicon.ico" />
```

---

## 步骤二：安装并配置 Tailwind CSS v4

```bash
bun add -d tailwindcss @tailwindcss/vite
```

> Tailwind v4 不需要 `postcss`、`autoprefixer`，不要安装它们。

**`vite.config.ts` 完整替换为：**

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**`src/index.css` 完整替换为：**

```css
@import "tailwindcss";
```

---

## 步骤三：配置 TypeScript 路径别名

> Vite 项目有两个 tsconfig 文件，必须都配置。
> TypeScript 6.0 废弃了 `baseUrl + paths`，需加 `"ignoreDeprecations": "6.0"` 否则报错 TS5101。

**`tsconfig.json`** — 在已有内容基础上，保留 `files` 和 `references` 字段，在 `compilerOptions` 中添加：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "ignoreDeprecations": "6.0"
  },
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**`tsconfig.app.json`** — **不要替换整个文件**，在 Vite 生成的 `tsconfig.app.json` 的 `compilerOptions` 中**追加**以下三项：

```json
{
  "baseUrl": ".",
  "paths": { "@/*": ["./src/*"] },
  "ignoreDeprecations": "6.0"
}
```

**安装 Node 类型包：**

```bash
bun add -d @types/node
```

---

## 步骤四：初始化 shadcn/ui 并安装 coss 组件

### 4-1 初始化 shadcn

```bash
bunx --bun shadcn@latest init -t vite --base radix -p nova --css-variables -y
```

完成后验证根目录出现 `components.json`，`src/components/ui/` 目录已创建。

### 4-2 安装 coss 组件和颜色 token

```bash
bunx --bun shadcn@latest add @coss/ui -y --overwrite
bunx --bun shadcn@latest add @coss/colors-neutral -y --overwrite
```

> `@coss/colors-neutral` 会通过 `@fontsource-variable/geist` 自动配置字体，
> 无需手动添加 Google Fonts。不要手动修改 `index.css` 的字体部分。

### 4-3 补充 --font-mono

coss 自动生成的 `@theme` 块只定义 `--font-sans` 和 `--font-heading`，需手动追加 `--font-mono`。
在 `src/index.css` 的 coss 生成的 `@theme` 块末尾添加：

```css
@theme {
  /* 保留 coss 已生成的内容，在末尾加这一行 */
  --font-mono: "Geist Mono Variable", "Fira Code", ui-monospace, monospace;
}
```

---

## 步骤五：安装 AntV Infographic（询问用户）

> **询问用户**：是否安装 AntV Infographic？
> 安装后可生成精美的信息图表（流程图、对比图、数据图等 200+ 种模板）。
> - **是** → 执行安装
> - **否** → 跳至步骤六

```bash
bun add @antv/infographic@0.2.19
```

> 固定版本，不使用 `@latest`。

**创建 `src/hooks/useInfographic.ts`：**

```ts
import { useEffect, useRef } from "react"
import { Infographic } from "@antv/infographic"

interface UseInfographicOptions {
  syntax: string
  width?: string
  height?: string
}

export function useInfographic({ syntax, width = "100%", height = "400px" }: UseInfographicOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<Infographic | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    instanceRef.current = new Infographic({
      container: containerRef.current,
      width,
      height,
    })
    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    instanceRef.current?.render(syntax)
  }, [syntax])

  return containerRef
}
```

---

## 步骤六：安装路由并清理脚手架

```bash
bun add react-router-dom
mkdir -p src/pages src/components/blocks src/pages/dev src/hooks
rm -f src/App.tsx src/App.css
```

**`src/router.tsx`：** 根据步骤五用户是否安装了 AntV Infographic，选择对应版本。

**版本 A — 已安装 Infographic：**

```tsx
import { HashRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import HomePage from "./pages/HomePage"

const ComponentsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ComponentsPage"))
  : null

const ChartsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ChartsPage"))
  : null

const Loading = () => <div className="p-8 text-muted-foreground">加载中...</div>

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 新增页面在此追加：<Route path="/xxx" element={<XxxPage />} /> */}

        {import.meta.env.DEV && ComponentsPage && (
          <Route path="/dev/components" element={<Suspense fallback={<Loading />}><ComponentsPage /></Suspense>} />
        )}
        {import.meta.env.DEV && ChartsPage && (
          <Route path="/dev/charts" element={<Suspense fallback={<Loading />}><ChartsPage /></Suspense>} />
        )}
      </Routes>
    </HashRouter>
  )
}
```

**版本 B — 未安装 Infographic：**

```tsx
import { HashRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import HomePage from "./pages/HomePage"

const ComponentsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ComponentsPage"))
  : null

const Loading = () => <div className="p-8 text-muted-foreground">加载中...</div>

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 新增页面在此追加：<Route path="/xxx" element={<XxxPage />} /> */}

        {import.meta.env.DEV && ComponentsPage && (
          <Route path="/dev/components" element={<Suspense fallback={<Loading />}><ComponentsPage /></Suspense>} />
        )}
      </Routes>
    </HashRouter>
  )
}
```

**`src/main.tsx` 完整替换为：**

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import Router from "./router"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
```

---

## 步骤七：创建页面占位文件

**`src/pages/HomePage.tsx`：**

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">项目已就绪</h1>
        <p className="mt-4 text-muted-foreground">开始构建你的页面</p>
      </div>
    </main>
  )
}
```

**`src/pages/dev/ComponentsPage.tsx` 占位：**

```tsx
// 开发专属页面，构建时不打包。访问：http://localhost:5173/#/dev/components
export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">组件预览页待生成</p>
    </main>
  )
}
```

**`src/pages/dev/ChartsPage.tsx` 占位（仅安装了 Infographic 时创建）：**

```tsx
// 开发专属页面，构建时不打包。访问：http://localhost:5173/#/dev/charts
export default function ChartsPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">图表预览页待生成</p>
    </main>
  )
}
```

---

## 步骤八：验证

```bash
bun dev
```

- `http://localhost:5173` → 看到"项目已就绪"
- `http://localhost:5173/#/dev/components` → 看到占位页面

```bash
bun run build
grep -r "ComponentsPage\|ChartsPage" dist/
# 输出为空 → 预览页未进入生产包
```

---

## 最终目录结构

```
<项目名>/
├── src/
│   ├── components/
│   │   ├── ui/          ← coss/shadcn 自动生成，不要手动修改
│   │   └── blocks/      ← 业务区块组件
│   ├── hooks/
│   │   └── useInfographic.ts  ← 仅安装了 Infographic 时存在
│   ├── pages/
│   │   ├── dev/
│   │   │   ├── ComponentsPage.tsx  ← 开发专属，构建不打包
│   │   │   └── ChartsPage.tsx      ← 开发专属，构建不打包
│   │   └── HomePage.tsx
│   ├── lib/utils.ts
│   ├── router.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── components.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

---

## 核心约束

- 统一使用 `bun`，不用 npm / yarn / pnpm
- 路由必须用 `HashRouter`（OSS 静态托管刷新不会 404）
- 图表统一用 `@antv/infographic` + `useInfographic` hook，版本固定 `0.2.19`
- `src/components/ui/` 下的文件不要手动修改