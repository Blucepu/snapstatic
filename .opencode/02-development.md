# 开发规范

> 供 AI 读取。在已创建的项目中开发页面和组件时遵守以下规范。
> 核心原则：**优先做出好看、合理的页面**，遇到不确定的 API 先查文档再写代码。

---

## 1. 页面设计原则

### 视觉层次
每个页面必须有清晰的主次层级，从大到小：大标题 → 副标题 → 正文 → 辅助信息。
英雄区（Hero）必须有主标题、副标题、至少一个行动按钮。

**字号参考：**
- 页面主标题：`text-4xl` 或 `text-5xl font-bold tracking-tight`
- 区块标题：`text-2xl` 或 `text-3xl font-semibold`
- 正文：`text-base`
- 辅助说明：`text-sm text-muted-foreground`

### 布局选择
根据内容类型选容器宽度：
- 阅读型（文章、关于）：`container mx-auto max-w-4xl px-4`
- 通用落地页：`container mx-auto max-w-6xl px-4`
- 数据看板：`w-full px-6`（全宽）

### 间距节奏
- 页面级区块间距：`space-y-20` 或 `space-y-24`
- 区块内部间距：`space-y-6` 或 `space-y-8`
- 卡片内部：`p-6`

### 配色
始终用语义 token，不写原始颜色值：

| Token | 用途 |
|-------|------|
| `bg-background` | 页面背景 |
| `bg-card` | 卡片背景 |
| `text-foreground` | 主文字 |
| `text-muted-foreground` | 次要文字、说明 |
| `border` | 边框（不需要加 `border-border`，已全局设置）|
| `bg-primary` / `text-primary` | 强调色 |
| `bg-destructive` | 危险/错误 |

渐变用法：
- 页面顶部装饰：`bg-gradient-to-b from-primary/5 to-background`
- 标题渐变文字：`bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent`
- 特色卡片背景：`bg-gradient-to-br from-primary/5 to-card`

---

## 2. 常用区块构建方式

不写死代码，根据以下描述自行生成合适的结构。

### 指标卡片（数据展示）
3-4 个 Card 横向排列（`grid grid-cols-1 sm:grid-cols-3 gap-4`），每张卡片包含：指标名（小字 muted）、数值（大字 bold）、变化趋势（绿色/红色小字）、可选图标。

### 功能特性区
3-6 个特性项，每项包含：图标圆形背景（`size-10 rounded-lg bg-primary/10 text-primary`）、标题、描述。布局用 `grid grid-cols-1 md:grid-cols-3 gap-6`。

### 步骤 / 流程区
纵向列表，每步包含：圆形编号（`size-12 rounded-full bg-primary text-primary-foreground`）、标题、描述。步骤之间可加连接线（绝对定位的 `w-px bg-border`）。

### 表格展示
外层 `rounded-xl border overflow-hidden`，表头用 `bg-muted/50`，状态列用 Badge 的语义 variant（`success` / `warning` / `error`），数字列右对齐。

### 引用 / 评价
`border-l-4 border-primary pl-6 italic`，正文 + 署名（`not-italic font-medium`）。

### 空状态
居中布局，大图标（`size-12 text-muted-foreground/40`）、标题、说明文字、可选操作按钮。

---

## 3. 组件使用规范

### 3.1 查文档优先

遇到不确定的组件 API，先查对应文档再写代码：

**coss 组件文档索引：** `https://coss.com/ui/llms.txt`
**单个组件：** `https://coss.com/ui/docs/components/{组件名}.md`

以 `src/components/ui/` 下的实际文件为准，不要按标准 shadcn 文档猜测。

### 3.2 coss 与 shadcn 的关键差异

| 场景 | 标准 shadcn | coss 实际写法 |
|------|------------|--------------|
| Dialog / Menu 触发器 | `asChild` | `render={<Button />}` |
| Alert 错误 variant | `"destructive"` | `"error"` |
| Card 内容区 | `CardContent` | `CardPanel`（`CardContent` 是别名）|
| Tabs 子组件 | `TabsTrigger` / `TabsContent` | `TabsTab` / `TabsPanel` |
| Badge 语义色 | 无 | 多了 `success` / `warning` / `error` / `info` |
| Slider 回调值 | `number[]` | `number \| readonly number[]` |
| Button size | `sm / default / lg` | `xs / sm / default / lg / xl` + icon 系列 |

### 3.3 复合组件组合原则

Dialog / Card / Accordion / Menu / Select 这类复合组件，
从 `https://coss.com/ui/docs/components/{组件名}.md` 读取 Examples 部分，
按官方示例的子组件组合顺序写，不要自己猜嵌套结构。

---

## 4. 图标使用规范

**只用 `lucide-react`，具名导入，不用其他图标库。**

```
import { ZapIcon, ShieldCheckIcon } from "lucide-react"
```

**尺寸用 Tailwind class，不用数字 size prop：**

| 场景 | class |
|------|-------|
| 行内小图标、Badge 内 | `size-3` |
| Button 内、列表内（标准） | `size-4` |
| 特性区图标 | `size-5` |
| 空状态、装饰图标 | `size-6` ~ `size-12` |

**aria 处理：**
- 旁边有文字说明的装饰图标 → 加 `aria-hidden="true"`
- Alert 中表达语义的图标（错误、警告、成功）→ 不加 `aria-hidden`
- 仅图标的按钮 → 按钮加 `aria-label`，图标加 `aria-hidden="true"`

---

## 5. 信息图表规范

> 仅安装了 `@antv/infographic` 的项目适用。

**统一通过 `useInfographic` hook 使用，不直接 `new Infographic()`。**

```
import { useInfographic } from "@/hooks/useInfographic"
const chartRef = useInfographic({ syntax: `...`, height: "300px" })
return <div ref={chartRef} className="w-full" />
```

**选模板原则（查画廊后决定）：**

| 场景 | 类别 |
|------|------|
| 步骤、流程、时间线 | `sequence-*` |
| 要点列举、功能清单 | `list-*` |
| 数据对比、占比、趋势 | `chart-*` |
| SWOT、双方对比 | `compare-*` |
| 组织架构、层级树 | `hierarchy-*` |
| 系统架构、节点关系 | `relation-*` |
| 四象限决策 | `compare-quadrant-*` |

**模板画廊：** `https://infographic.antv.vision/gallery`
**语法文档：** `https://infographic.antv.vision/learn/infographic-syntax`

**语法核心规则：**
- 第一行必须是 `infographic <模板名>`
- `palette` 颜色裸写，空格分隔，不加引号不加逗号
- `icon` 使用语义关键词（空格分隔），如 `rocket`、`shield check`
- `value` 用纯数值，单位放 label 或 desc

---

## 6. 新增页面流程

**每次新增页面只做两件事：**

① 在 `src/pages/` 创建页面文件（文件名 PascalCase + Page 后缀，如 `AboutPage.tsx`）

② 在 `src/router.tsx` 追加路由：
```
<Route path="/about" element={<AboutPage />} />
```

完成后 `bun dev` 验证，访问 `http://localhost:5173/#/about`。

---

## 7. 多页面导航

多个页面时在页面顶部加导航栏，作为独立组件放在 `src/components/blocks/Navbar.tsx`。

**导航栏要素：**
- `sticky top-0 z-50 border-b bg-background/80 backdrop-blur`（毛玻璃效果）
- 左侧品牌名，右侧导航链接
- 当前页高亮：HashRouter 下用 `window.location.hash` 判断当前路径
- 链接用 `react-router-dom` 的 `<Link to="..." />`

---

## 8. 美化技巧

以下效果可按需组合使用，不需要全部用上：

- **卡片悬停**：`transition-all hover:shadow-md hover:-translate-y-0.5`
- **图标背景圆**：`flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary`
- **数字大字**：`text-6xl font-bold text-primary`，下方配小字说明
- **深色穿插区块**：`bg-muted/40 py-16`，在白色区块间形成节奏
- **标题渐变**：`bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent`
- **毛玻璃卡片**：`backdrop-blur bg-card/60 border`

---

## 9. 不要做的事

- 不用 `npm` / `yarn`，统一用 `bun`
- 不手动修改 `src/components/ui/` 下的文件
- 不用 `BrowserRouter`，统一用 `HashRouter`
- 不在业务页面 import `ComponentsPage` 或 `ChartsPage`
- 不写原始颜色值（`text-gray-500`），用语义 token
- Dialog / Menu 触发器不用 `asChild`，用 `render={<Button />}`
- Alert 错误不用 `variant="destructive"`，用 `variant="error"`
- 图标不用数字 `size` prop，用 Tailwind class
- 不用 `echarts` / `recharts` 等其他图表库，统一用 `@antv/infographic`