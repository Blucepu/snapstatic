# snapstatic

> 静态站点模板 — Vite + React + TypeScript + Tailwind v4 + coss/shadcn + @antv/infographic

## 快速开始

```bash
bun dev            # 启动开发服务器
bun run build      # typecheck + 构建
bun run lint       # ESLint 检查
```

## 技术栈

| 类别 | 工具 |
|------|------|
| 框架 | React 19 + TypeScript 6 |
| 构建 | Vite 8 |
| 样式 | Tailwind v4（语义化 token） |
| UI 组件 | coss/shadcn（54 个组件） |
| 图表 | @antv/infographic |
| 路由 | react-router-dom（HashRouter） |
| 图标 | lucide-react |
| 字体 | Geist（@fontsource-variable） |

## UI 组件

基于 [coss](https://coss.dev)（shadcn 的 Base UI 移植版），位于 `src/components/ui/`。

与标准 shadcn 的关键差异：

| 标准 shadcn | coss |
|-------------|------|
| `asChild` | `render={<Button />}` |
| `variant="destructive"` | `variant="error"` |
| `CardContent` | `CardPanel` |

## 开发页面

`src/pages/dev/` 下的页面仅在 `import.meta.env.DEV` 时加载：

- **ComponentsPage** — 所有 54 个 UI 组件预览
- **ChartsPage** — Infographic 图表模板展示

## 部署

```bash
bun x zbanx deploy            # 构建 + 部署到阿里云 OSS
bun x zbanx deploy --no-build # 仅上传已有 dist/
```

需在项目根目录配置 `deploy.json`。首次部署 `zbanx deploy` 会引导登录自动获取 OSS 凭证。无需手动配置 `.env`。

## 项目结构

```
src/
├── assets/            # 静态资源
├── components/
│   └── ui/            # 54 个 coss/shadcn 组件
├── hooks/             # useInfographic, use-media-query
├── lib/               # utils.ts (cn)
├── pages/
│   ├── dev/           # ComponentsPage, ChartsPage (DEV only)
│   └── HomePage.tsx   # 首页
├── index.css          # Tailwind v4 + 主题变量
├── main.tsx           # 入口
└── router.tsx         # HashRouter 路由
```

## 注意事项

- **HashRouter 必须** — 不支持 BrowserRouter（OSS 静态托管无法处理刷新）
- **`base: "./"`** — `vite.config.ts` 中已配置
- **typecheck 前置** — `bun run build` 先运行 `tsc -b`，类型错误会阻断构建
