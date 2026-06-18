# 开发预览页规范

> 供 AI 读取。描述如何生成组件展示页（ComponentsPage）和图表示例页（ChartsPage）。
> 这两个页面仅开发时可访问，构建时完全不打包。

---

## 触发时机

用户说以下内容时执行本规范：
- "生成组件展示页" / "更新 ComponentsPage"
- "生成图表示例页" / "更新 ChartsPage"
- 创建项目时用户选择生成预览页

---

## 一、组件展示页（ComponentsPage）

**访问地址：** `http://localhost:5173/#/dev/components`
**文件路径：** `src/pages/dev/ComponentsPage.tsx`

### 生成原则

不要把展示代码写死在规范里。每次生成时：

1. **扫描实际安装的组件**：列出 `src/components/ui/` 下所有 `.tsx` 文件
2. **读取每个组件文件**：提取导出名、variant 值、size 值、props
3. **查阅 coss 文档**：对不确定的 API，访问对应文档页获取准确用法
4. **生成展示代码**：覆盖所有已安装组件，不遗漏，不留占位符

**coss 组件文档索引：** `https://coss.com/ui/llms.txt`
**单个组件文档：** `https://coss.com/ui/docs/components/{组件名}.md`
例：`https://coss.com/ui/docs/components/button.md`

---

### 页面布局规则

```
固定顶栏
  - sticky top-0 z-10 border-b bg-card/80 backdrop-blur
  - 左侧：标题"组件预览"
  - 右侧：Badge variant="outline"，文字"仅开发环境 · 构建时不打包"，橙色

内容区
  - container mx-auto px-6 py-8 space-y-12
  - 每个组件一个 <section>
  - 区块之间用 <Separator /> 分隔

每个 section 结构
  - <h2> 中英文标题，如"Button 按钮"
  - <p> 简短说明，text-sm text-muted-foreground
  - 展示区：flex flex-wrap gap-2 或 grid，视组件类型而定
```

---

### 各组件展示要求

#### 有 variant 的组件（Button、Badge、Alert 等）
- 为每个 variant 值生成一个示例
- 读取 `src/components/ui/{组件}.tsx` 中 `cva()` 的 `variants.variant` 对象，获取全部 variant key
- 参考：`https://coss.com/ui/docs/components/button.md` 的 Examples 部分

#### 有 size 的组件（Button 等）
- 为每个 size 值生成一个示例
- 同样从组件文件的 `cva()` 读取 `variants.size` 对象

#### 需要交互的组件
用局部函数组件隔离 `useState`，避免主组件 state 混乱：

```
Switch、Checkbox     → checked + onCheckedChange
Slider               → value + onValueChange（注意回调是 number | readonly number[]，不能直接传 setState）
Progress             → 配合 +/- 按钮演示
Button loading       → onClick 触发 setTimeout 模拟
Input                → value + onChange，实时显示输入内容
Dialog、Menu         → 直接使用组件自带的开关控制
```

#### 复合组件（Dialog、Card、Accordion、Select、Menu）
按 `02-development.md` 第 3 节的组合写法生成，不要猜测 API。

**关键差异提醒（从组件文件读取实际 API）：**

| 组件 | 注意点 |
|------|--------|
| Dialog | 触发用 `render={<Button />}`，不用 `asChild` |
| Alert | 错误状态是 `variant="error"`，不是 `"destructive"` |
| Card | 内容区是 `CardPanel`，`CardContent` 是别名 |
| Tabs | 子组件是 `TabsTab` / `TabsPanel` |
| Badge | coss 多了 `success` / `warning` / `error` / `info` 四个语义 variant |
| Select | 可以传 `items` prop 配合 `SelectItem value={item}` |

#### 图标使用
- 只用 `lucide-react`，具名导入
- 尺寸用 Tailwind class：`size-3`（小）、`size-4`（标准）、`size-5`（中）、`size-6`（大）
- 装饰性图标（旁边有文字）加 `aria-hidden="true"`
- Alert 中的语义图标不加 `aria-hidden`

---

### 展示完整性要求

生成的文件必须覆盖 `src/components/ui/` 下的**全部**组件，不得跳过。
若某组件用法不确定，先访问文档再生成，不要用猜测的写法。

---

## 二、图表示例页（ChartsPage）

> 仅安装了 `@antv/infographic` 的项目适用。
> 使用前确认 `package.json` 中有该依赖，且 `src/hooks/useInfographic.ts` 已创建。

**访问地址：** `http://localhost:5173/#/dev/charts`
**文件路径：** `src/pages/dev/ChartsPage.tsx`

---

### 生成原则

同样不写死代码，而是按以下规则**现场生成**：

- 图表内容使用**真实可用的中文业务场景**，不用"示例 A / 示例 B"这类无意义占位
- 每个图表旁边标注模板名称（小字，text-xs text-muted-foreground）
- 每类 2 个代表性示例，覆盖 7 大类别

**模板文档：** `https://infographic.antv.vision/learn/infographic-syntax`
**模板画廊：** `https://infographic.antv.vision/gallery`

---

### 页面布局规则

与 ComponentsPage 相同：
- 固定顶栏，标题"图表示例"，Badge 标注"仅开发环境"
- `container mx-auto px-6 py-8 space-y-12`
- 每类别一个 `<section>`，`<h2>` 中英文标题 + 用途说明
- 图表容器：`<div ref={chartRef} className="w-full rounded-xl border p-2" />`
- 同类 2 个示例用 `grid grid-cols-1 lg:grid-cols-2 gap-6` 并排

---

### 7 大类别与选模板规则

| 类别 | 适用场景 | 推荐模板（各选 1-2 个） |
|------|---------|----------------------|
| **List 列表** | 要点列举、功能清单、特性介绍 | `list-row-horizontal-icon-arrow`、`list-grid-badge-card` |
| **Sequence 序列** | 步骤流程、时间线、路线图 | `sequence-ascending-steps`、`sequence-timeline-simple` |
| **Chart 数据图** | 数值对比、占比分析、趋势变化 | `chart-column-simple`、`chart-pie-compact-card` |
| **Comparison 对比** | SWOT 分析、方案对比、双向对比 | `compare-swot`、`compare-binary-horizontal-simple-fold` |
| **Hierarchy 层级** | 组织架构、分类树、思维导图 | `hierarchy-structure`、`hierarchy-tree-curved-line-rounded-rect-node` |
| **Relation 关系** | 系统架构、流程依赖、节点关系 | `relation-dagre-flow-tb-simple-circle-node` |
| **Quadrant 象限** | 优先级矩阵、四象限决策分析 | `compare-quadrant-quarter-simple-card` |

---

### 图表内容生成规则

每个图表的 `syntax` 内容必须是**有意义的中文业务数据**，参考方向：

```
List       → 产品优势、技术栈清单、服务亮点
Sequence   → 项目交付流程、公司发展历程、用户使用路径
Chart      → 季度营收、用户来源分布、各部门占比
Comparison → 产品 SWOT、自建 vs 采购、两种方案对比
Hierarchy  → 公司组织架构、产品功能模块树
Relation   → 系统架构图、前后端调用关系
Quadrant   → 功能优先级矩阵、需求四象限
```

**语法核心规则（写 syntax 时必须遵守）：**

```
第一行：infographic <模板名>（必须是第一行）
data
  title  图表标题
  lists / sequences / values / nodes+relations / compares / root+children
    根据模板类型选择对应字段

theme
  palette #hex1 #hex2 #hex3   颜色裸写，空格分隔，不加引号不加逗号
```

- `icon` 使用语义关键词，空格分隔，如 `rocket`、`shield check`、`chart line`
- `value` 使用纯数值，单位放在 label 或 desc 中
- 缩进统一用两个空格

---

### useInfographic 使用方式

```
import { useInfographic } from "@/hooks/useInfographic"

const chartRef = useInfographic({ syntax: `...`, height: "280px" })
return <div ref={chartRef} className="w-full rounded-xl border p-2" />
```

每个图表独立一个变量，同一组件里多个图表用不同变量名（`chart1`、`chart2`...）。

---

## 三、验证

```bash
# 开发时查看
bun dev
# 访问 http://localhost:5173/#/dev/components
# 访问 http://localhost:5173/#/dev/charts

# 构建验证：不进生产包
bun run build
grep -r "ComponentsPage\|ChartsPage\|仅开发环境" dist/
# 输出为空 → 验证通过
```