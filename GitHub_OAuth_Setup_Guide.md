# 🔐 GitHub OAuth 应用创建指南

## 📋 创建 GitHub OAuth 应用的完整步骤

### 1. 访问 GitHub 开发者设置
1. 登录你的 GitHub 账户
2. 点击右上角头像 → Settings
3. 在左侧菜单中找到 "Developer settings"
4. 点击 "OAuth Apps"

### 2. 创建新的 OAuth 应用
1. 点击 "New OAuth App" 按钮
2. 填写应用信息：

```
Application name: Personal Website
Homepage URL: http://localhost:3000
Application description: 我的个人网站项目
Authorization callback URL: http://localhost:5001/api/auth/github/callback
```

### 3. 获取认证信息
创建成功后，你会看到：

- **Client ID**: 类似 `Ov23li2dqN2MEePj18Rd` (你已经有了)
- **Client Secret**: 需要点击 "Generate a new client secret" 获取

### 4. 生成 Client Secret
1. 在应用详情页面，找到 "Client secrets" 部分
2. 点击 "Generate a new client secret"
3. 输入你的 GitHub 密码确认
4. 复制显示的 Client Secret（格式类似：`ghp_xxxxxxxxxxxxxxxxxxxx`）
5. ⚠️ **重要**: 立即保存这个 Secret，它只会显示一次！

### 5. 更新环境变量
将获取到的 Client Secret 粘贴到 `backend/.env` 文件中：

```bash
GITHUB_CLIENT_ID=Ov23li2dqN2MEePj18Rd
GITHUB_CLIENT_SECRET=你刚才复制的Client_Secret
```

### 6. 验证配置
重启服务器并测试 GitHub 登录功能：

```bash
# 重启后端服务器
cd backend
npm run dev

# 访问前端测试登录
# http://localhost:3000 → 点击 GitHub 登录按钮
```

## 🔧 常见问题

### Q: 我忘记保存 Client Secret 了怎么办？
A: 重新生成一个新的 Client Secret：
1. 回到 OAuth 应用设置页面
2. 点击 "Generate a new client secret"
3. 旧的 Secret 会失效，使用新的 Secret

### Q: Client Secret 泄露了怎么办？
A: 立即重新生成：
1. 删除旧的 Client Secret
2. 生成新的 Client Secret
3. 更新所有使用该 Secret 的地方

### Q: 回调 URL 设置错误怎么办？
A: 在 OAuth 应用设置中修改：
1. 确保回调 URL 为：`http://localhost:5001/api/auth/github/callback`
2. 注意端口号和路径要完全匹配

## 🎯 下一步
获取 Client Secret 后：
1. 更新 `backend/.env` 文件
2. 重启开发服务器
3. 测试 GitHub 登录功能
4. 部署到生产环境时，记得更新生产环境的回调 URL