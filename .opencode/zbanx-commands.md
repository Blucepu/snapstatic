# zbanx 命令总览

> ⚠️ 本文件是 zbanx CLI 命令的**唯一权威**规范，AI 必须严格遵守。
> 执行任何命令前，确保当前目录为 zbanx 项目（含 `deploy.json`），`init` 除外。
> 密码输入必须交互式（用户在终端完成），AI 不得硬编码或记录密码。
> **不得**使用其他命令、脚本或手动操作替代本文件中规定的命令。

---

## 命令一览

| 命令 | 作用 | 是否需要交互 |
|------|------|-------------|
| `bun x zbanx login` | 登录账号并保存凭证 | 是 |
| `bun x zbanx logout` | 清除缓存的登录凭证 | 否 |
| `bun x zbanx init <name>` | 创建新项目 | 否（可能需代理） |
| `bun x zbanx deploy` | 构建 + 部署到 OSS | 首次需登录 |
| `bun x zbanx list` | 列出当前账号所有已部署项目 | 否 |
| `bun x zbanx delete <name>` | 删除指定项目 | 需密码验证 |

---

## 1. 创建项目：`init`

> ⚠️ 必须严格按以下步骤执行，不得跳过、不得调换、不得用其他命令替代。
> 创建项目的**唯一正确方式**是 `bun x zbanx init`。

### 步骤 1：收集并校验项目名

询问用户想要的项目名，校验规则：
- 仅允许：小写字母、数字、连字符 `-`
- 必须以字母或数字开头
- 不能包含空格、大写、下划线或特殊字符
- 合法示例：`my-blog`、`client-report`、`portfolio-2024`
- 非法示例：`My Blog`、`client_report`、`-bad-start`

如果用户没有提供项目名，**主动询问**。
如果项目名不合法，**提示用户修改**，不要自行"修正"后执行。

> 若用户想在当前目录创建，项目名使用 `.`。

### 步骤 2：执行创建命令

```bash
bun x zbanx init <project-name>
```

等待命令完成。该命令**自动完成**以下所有工作，AI **不得**手动执行其中任何一步：
- 从 GitHub 下载 snapstatic 模板 ZIP 包（`zbanx-ai/snapstatic`）
- 解压并写入项目文件（包含 Vite + React + TypeScript + Tailwind v4 + coss/shadcn + @antv/infographic 全套配置）
- 运行 `bun install` 安装依赖
- 运行 `bun run build` 验证构建

**可选参数**
- `--overwrite`：目标目录已存在时覆盖

### 步骤 3：监控执行过程

- 若命令 **30 秒内无输出**，或用户反馈"卡住了"、"下不了"、"太慢了"
- **立即停止等待**，参考本文「GitHub 下载问题」章节，主动询问用户代理端口

### 步骤 4：验证成功

CLI 输出包含以下字样即表示成功：
```
[SUCCESS] Project "<name>" created!
```

若输出错误信息（如 `Failed to download template`、`bun install failed`、`Build verification failed`），参考本文「常见错误总览」章节处理。

### 步骤 5：告知用户下一步

明确告知用户：
```
cd <project-name>
bun dev
```

然后浏览器访问 `http://localhost:5173` 查看效果。

### 🚫 禁止行为

- ❌ 不要使用 `bun create vite@latest`、`create-react-app`、`npm init vite` 等其他脚手架命令
- ❌ 不要手动下载 GitHub 模板 ZIP 并解压
- ❌ 不要跳过 `bun x zbanx init` 而直接写文件
- ❌ 不要在 init 后手动运行 `bun install` 或 `bun run build`（init 已自动完成）
- ❌ 不要在 init 后追加安装 Tailwind、shadcn 等依赖（模板已内置）

---

## 2. 部署项目：`deploy`

> **不要**手动构建、**不要**手动上传 OSS、**不要**在对话中收集账号密码 — `zbanx deploy` 全部自动处理。

```bash
bun x zbanx deploy              # 构建 + 上传
bun x zbanx deploy --no-build   # 跳过构建，仅上传已有 dist/
```

**前置**
- 当前目录含 `deploy.json`（仅含 `build` 配置）
- 首次部署需在终端交互式登录（账号密码）

**登录交互（仅首次）**

首次部署时，`zbanx deploy` 会自动在终端提示用户输入账号密码：

```
  +--- ZBX Login -----------------------------+
  |  Server: https://abx-api.tbanx.cn         |
  +------------------------------------------+
  |  Account: user@example.com
  |  Password: ******
  +------------------------------------------+
```

**AI 行为**：
- **不要**在对话中询问账号密码
- 提示用户："请在终端中完成登录"
- 登录成功后会话缓存到 `~/.zbx/session.json`，后续部署无需重复登录

**完成后**
- CLI 输出访问 URL，AI **必须**明确告知用户

```
  [OK] Deploy complete! 42 files, 1.2 MB
  > Access URL: https://t.tbanx.cn/web/12345/my-site/index.html
```

---

## 3. 查看已部署项目：`list`

```bash
bun x zbanx list
```

**输出格式**
```
  Account: myaccount (ID: 12345)

  my-app               https://t.tbanx.cn/web/12345/my-app/index.html
  another-site         https://t.tbanx.cn/web/12345/another-site/index.html

  2 project(s) found.
```

**AI 行为**
- 解析输出，向用户呈现项目名 + 访问 URL
- 若输出 `No projects found`，告知用户当前账号下无已部署项目

---

## 4. 删除项目：`delete`

```bash
bun x zbanx delete <project-name>        # 交互式确认
bun x zbanx delete <project-name> -f     # 跳过确认（CI 用）
```

**前置**
- 当前目录含 `deploy.json`
- 需要用户在终端交互式输入密码进行二次验证
- 只能删除当前登录用户自己的项目（OSS 路径含 `accountId`，天然隔离）

**执行流程**
1. 提示用户在终端输入密码
2. 服务端验证
3. 列出该项目文件数量
4. 询问 `Delete N file(s)? (y/N)`
5. 确认后执行删除

**AI 行为**
- **必须先向用户确认项目名**，避免误删
- 建议先执行 `zbanx list` 展示列表，再让用户选择
- 删除是不可逆操作，需明确告知用户

---

## 5. 登录账号：`login`

> 在列项目或删除项目之前，若提示 `No login session found`，先让用户执行 `login`。

```bash
bun x zbanx login
```

**执行流程**
1. `zbanx login` 会在终端提示输入账号（邮箱）和密码
2. 验证通过后，凭证缓存到 `~/.zbx/session.json`
3. 后续 `deploy`、`list`、`delete` 自动使用缓存的凭证

**AI 行为**
- **不要**在对话中询问账号密码
- 提示用户："请在终端中完成登录"

---

## 6. 退出登录：`logout`

清除缓存的登录凭证。

```bash
bun x zbanx logout
```

等价于手动删除 `rm -f ~/.zbx/session.json`。

---

## GitHub 下载问题（中国大陆用户常见）

`zbanx init` 会从 GitHub 下载模板 ZIP 包，国内网络常常卡住或超时。
`bun install` 也可能因 npm registry 访问慢而卡顿。

### AI 行为

1. 若 `zbanx init` 执行超过 **30 秒** 无输出，或用户反馈"卡住了"、"下不了"、"太慢了"
2. **停止等待**，主动询问：
   > "下载模板需要从 GitHub 拉取，国内网络可能受阻。你是否开启了代理客户端（如 Clash、V2ray、小飞机等）？如有，请告诉我代理端口号（常见：7890、1080、10808）。"
3. 询问用户使用的系统和终端类型

### 设置代理命令

确认用户代理端口 `<PORT>` 后，按用户系统执行：

**macOS / Linux（bash/zsh）**
```bash
export https_proxy=http://127.0.0.1:<PORT>
export http_proxy=http://127.0.0.1:<PORT>
bun x zbanx init <project-name>
```

**Windows CMD**
```cmd
set https_proxy=http://127.0.0.1:<PORT>
set http_proxy=http://127.0.0.1:<PORT>
bun x zbanx init <project-name>
```

**Windows PowerShell**
```powershell
$env:https_proxy="http://127.0.0.1:<PORT>"
$env:http_proxy="http://127.0.0.1:<PORT>"
bun x zbanx init <project-name>
```

### 判断用户系统

优先询问："你当前使用的是什么系统？macOS 还是 Windows？Windows 用的是 CMD 还是 PowerShell？"

也可通过环境变量或 shell 特征判断：
- macOS：`uname -s` 输出 `Darwin`
- Windows CMD：路径形如 `C:\Users\...`，使用 `set`
- Windows PowerShell：`$PSVersionTable` 存在，使用 `$env:`

### 常见代理端口

| 客户端 | 默认 HTTP 端口 |
|--------|---------------|
| Clash / ClashX | 7890 |
| V2rayN | 10808 |
| Shadowsocks | 1080 |
| Surge | 6152 |

### 如果代理后仍然失败

- 让用户检查代理客户端是否真的在运行，并开启"系统代理"或"TUN 模式"
- 让用户浏览器访问 `https://github.com/zbanx-ai/snapstatic/archive/refs/heads/main.zip` 测试是否可下载
- 若仍不行，建议用户手动下载 ZIP 后解压，手动执行 `bun install`

### 注意

- 代理环境变量**只在当前终端会话生效**，关闭终端后失效
- 不要永久写入 `~/.zshrc` 或 `~/.bashrc`，避免影响其他工具
- `bun install` 慢时同样需要 `https_proxy`（bun 会继承）

---

## 常见错误总览

| 错误信息 | 含义 | AI 应对 |
|---------|------|--------|
| `Config file deploy.json not found` | 当前目录非 zbanx 项目 | 引导进入项目目录，或执行 `init` |
| `No login session found` | 未登录 | 引导执行 `zbanx login` |
| `Missing OSS credentials` | 未登录或 session 失效 | 引导执行 `zbanx login` |
| `密码错误，请重试` | delete 密码验证失败 | 提示检查密码，或 `rm -f ~/.zbx/session.json` 重新登录 |
| `Invalid password or account not found` | deploy 登录失败 | 提示检查账号密码 |
| `Project "xxx" not found or already deleted` | 项目不存在 | 建议 `zbanx list` 查看可用项目 |
| `Build verification failed` | 构建失败 | 让用户先执行 `bun run build` 查看具体报错 |
| `Failed to download template` | GitHub 下载失败 | 参考本文「GitHub 下载问题」章节 |

---

## 用户对话示例

**用户**："帮我创建一个博客项目"
→ AI：确认项目名 `my-blog` → 执行 `bun x zbanx init my-blog` → 提示 `bun dev`

**用户**："帮我部署"
→ AI：执行 `bun x zbanx deploy` → 提示用户在终端完成登录 → 告知访问 URL

**用户**："我有哪些在线项目"
→ AI：执行 `bun x zbanx list` → 格式化输出呈现给用户

**用户**："帮我删掉 my-blog"
→ AI：先 `zbanx list` 确认存在 → 二次确认 → `zbanx delete my-blog` → 提示用户终端输入密码

**用户**："帮我登录"
→ AI：执行 `bun x zbanx login` → 提示用户在终端输入账号密码

**用户**："退出登录"
→ AI：执行 `bun x zbanx logout`
