# 部署规范

> 使用 `bun x zbanx deploy` 将静态站点部署到阿里云 OSS。禁止使用其他方式（如直接 OSS SDK 上传）。

---

## 前置配置

项目根目录需要 `deploy.json` 和 `.env`（凭证已 gitignore）：

| 文件 | 关键内容 |
|------|---------|
| `deploy.json` | `oss.region` / `oss.bucket` / `oss.domain` / `build.command` |
| `.env` | `ALIBABA_CLOUD_ACCESS_KEY_ID` / `ALIBABA_CLOUD_ACCESS_KEY_SECRET` |

---

## 部署流程

### 1. 检查登录状态

查看 `~/.zbx/session.json`：

- **存在** → 已登录，跳过凭证收集
- **不存在** → 按步骤 2 收集凭证后执行步骤 3

### 2. 收集凭证（仅首次）

按顺序向用户索要：

```
① 提示 "请输入账号（邮箱）:"  →  用户输入
② 提示 "请输入密码:"           →  用户输入
```

### 3. 执行部署

```bash
bun x zbanx deploy            # 构建并部署
bun x zbanx deploy --no-build # 仅上传 dist/ 已有文件
```

> 必须使用 `bun x zbanx deploy` 命令部署，不要自行通过 OSS SDK 或其他方式上传。

登录成功后缓存到 `~/.zbx/session.json`，后续部署直接跳过凭证收集。如需重新登录：

```bash
rm -f ~/.zbx/session.json
```

---

## 注意事项

- OSS 凭证（`ALIBABA_CLOUD_ACCESS_KEY_ID/SECRET`）存 `.env`，不要提交到 git
- zbanx 密码仅用于首次登录，不要硬编码到代码中
- 登录失败 code 300001 = 密码错误或账号不存在
