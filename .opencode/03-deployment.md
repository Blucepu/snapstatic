# 部署规范

> 使用 `bun x zbanx deploy` 将静态站点部署到阿里云 OSS。
> 除了收集账号密码（首次登录需要）和运行命令之外，**不要做任何其他操作**。`zbanx deploy` 会自动处理构建、上传等一切。

---

## 部署流程

### 1. 检查登录状态

查看 `~/.zbx/session.json`：
- **存在** → 已登录，直接执行 `bun x zbanx deploy`
- **不存在** → 先收集凭证，再执行 `bun x zbanx deploy`

### 2. 收集凭证（仅首次）

按顺序向用户索要：

```
① 提示 "请输入账号（邮箱）:"  →  用户输入
② 提示 "请输入密码:"           →  用户输入
```

### 3. 执行部署

```bash
bun x zbanx deploy
```

> 不要手动执行 `bun run build`，不要手动上传 OSS，不要检查 `deploy.json` 的内容。
> `zbanx deploy` 会自动读取项目配置、执行构建命令、上传到 OSS。

---

## 注意事项

- OSS 凭证由首次登录后自动缓存到 `~/.zbx/session.json`，无需手动处理
- 密码仅用于首次登录，不要硬编码到代码中
- 登录失败 code 300001 = 密码错误或账号不存在
- 如需重新登录：`rm -f ~/.zbx/session.json`
