# 部署规范

> 供 AI 读取。使用 `bun x zbanx deploy` 部署静态站点到阿里云 OSS。
> **不要**手动构建、**不要**手动上传 OSS、**不要**在对话中收集账号密码 — `zbanx deploy` 全部自动处理。

---

## 部署流程

### 1. 前置检查

```bash
ls deploy.json
```

- **存在 `deploy.json`** → 进入步骤 2
- **不存在** → 提示用户先执行 `bun x zbanx init` 创建项目，或进入正确的项目目录

### 2. 执行部署

```bash
bun x zbanx deploy
```

> 不要手动执行 `bun run build`，不要手动上传 OSS。
> `zbanx deploy` 会自动读取项目配置、执行构建命令、上传到 OSS。

**可选：跳过构建**

如果用户只想上传已有 `dist/`，无需重新构建：

```bash
bun x zbanx deploy --no-build
```

### 3. 登录交互（仅首次）

首次部署时，`zbanx deploy` 会自动在终端提示用户输入账号密码：

```
  +--- ZBX Login -----------------------------+
  |  Server: https://v2-api.zbanx.com         |
  +------------------------------------------+
  |  Account: user@example.com
  |  Password: ******
  +------------------------------------------+
```

**AI 行为**：
- **不要**在对话中询问账号密码
- 提示用户："请在终端中完成登录"
- 登录成功后会话缓存到 `~/.zbx/session.json`，后续部署无需重复登录

### 4. 告知结果

部署完成后，CLI 会输出访问 URL：

```
  [OK] Deploy complete! 42 files, 1.2 MB
  > Access URL: https://example.com/web/12345/my-site/index.html
```

**AI 必须**将这个 URL 明确告知用户。

---

## 常见错误

| 错误信息 | 含义 | AI 应对 |
|---------|------|--------|
| `Config file deploy.json not found` | 当前目录非 zbanx 项目 | 引导进入项目目录，或执行 `init` |
| `Invalid password or account not found` | 登录失败 | 提示用户检查账号密码，重试 |
| `Build verification failed` | 构建失败 | 让用户先执行 `bun run build` 查看具体报错 |
| `Missing OSS credentials` | 会话失效 | 执行 `rm -f ~/.zbx/session.json` 后重新 `deploy` |

---

## 注意事项

- OSS 凭证由首次登录后自动缓存到 `~/.zbx/session.json`，无需手动处理
- 密码仅用于登录，不要硬编码到代码中
- 如需重新登录：`rm -f ~/.zbx/session.json`
- 更多命令（`list`、`delete`）详见 `zbanx-commands.md`
