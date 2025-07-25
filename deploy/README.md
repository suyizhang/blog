# 个人网站服务器部署指南

本指南将帮助你将个人网站部署到自己的服务器上。

## 🚀 快速开始

### 1. 服务器准备

**系统要求：**
- Ubuntu 20.04+ 或 CentOS 8+
- 至少 1GB RAM
- 至少 10GB 存储空间
- 公网IP地址

**运行服务器设置脚本：**
```bash
# 上传部署文件到服务器
scp -r deploy/ user@your-server:/tmp/

# 登录服务器
ssh user@your-server

# 运行设置脚本
cd /tmp/deploy
chmod +x setup-server.sh
sudo ./setup-server.sh
```

### 2. 配置GitHub Secrets

在GitHub仓库的 `Settings > Secrets and variables > Actions` 中添加以下secrets：

#### 服务器连接配置
- `SERVER_HOST`: 服务器IP地址或域名
- `SERVER_USER`: SSH用户名 (通常是 `root` 或 `ubuntu`)
- `SERVER_SSH_KEY`: SSH私钥内容
- `SERVER_PORT`: SSH端口 (默认22，可选)

#### 应用配置
- `DATABASE_URL`: `file:./prod.db` (SQLite) 或 PostgreSQL连接字符串
- `JWT_SECRET`: JWT密钥 (建议使用随机生成的长字符串)
- `SESSION_SECRET`: Session密钥 (建议使用随机生成的长字符串)
- `FRONTEND_URL`: 前端网站URL (如: `https://your-domain.com`)
- `VITE_API_URL`: 后端API URL (如: `https://your-domain.com/api`)

#### GitHub OAuth配置
- `GITHUB_CLIENT_ID`: GitHub OAuth应用客户端ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth应用客户端密钥
- `GITHUB_CALLBACK_URL`: GitHub OAuth回调URL (如: `https://your-domain.com/api/auth/github/callback`)

### 3. 配置域名和SSL

```bash
# 配置域名解析
# 将域名A记录指向服务器IP

# 设置SSL证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 更新Nginx配置中的域名
sudo nano /etc/nginx/sites-available/personal-website
# 将 your-domain.com 替换为你的实际域名

# 重启Nginx
sudo systemctl restart nginx
```

### 4. 创建GitHub OAuth应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: 你的网站名称
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/github/callback`
4. 创建后获取 `Client ID` 和 `Client Secret`

### 5. 触发部署

推送代码到 `main` 分支或手动触发GitHub Actions：

```bash
git add .
git commit -m "配置服务器部署"
git push origin main
```

## 📁 文件说明

- `setup-server.sh`: 服务器环境自动配置脚本
- `personal-website-backend.service`: 后端服务systemd配置
- `nginx.conf`: Nginx反向代理配置
- `deploy.yml`: GitHub Actions自动部署配置

## 🔧 手动部署步骤

如果自动部署失败，可以手动执行以下步骤：

```bash
# 1. 登录服务器
ssh user@your-server

# 2. 进入部署目录
cd /var/www/personal-website

# 3. 拉取最新代码
sudo git pull origin main

# 4. 安装依赖
sudo npm ci
cd backend && sudo npm ci && cd ..

# 5. 构建项目
sudo npm run build
cd backend && sudo npm run build && cd ..

# 6. 数据库迁移
cd backend
sudo npx prisma generate
sudo npx prisma db push
cd ..

# 7. 重启服务
sudo systemctl restart personal-website-backend
sudo systemctl restart nginx
```

## 🔍 故障排除

### 检查服务状态
```bash
# 检查后端服务
sudo systemctl status personal-website-backend

# 检查Nginx状态
sudo systemctl status nginx

# 查看服务日志
sudo journalctl -u personal-website-backend -f
sudo tail -f /var/log/nginx/personal-website.error.log
```

### 常见问题

1. **端口被占用**
   ```bash
   sudo lsof -i :5001
   sudo kill -9 <PID>
   ```

2. **权限问题**
   ```bash
   sudo chown -R www-data:www-data /var/www/personal-website
   ```

3. **SSL证书问题**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **数据库连接问题**
   - 检查 `.env` 文件中的 `DATABASE_URL`
   - 确保数据库文件权限正确

## 📊 监控和维护

### 设置自动备份
```bash
# 创建备份脚本
sudo crontab -e

# 添加每日备份任务
0 2 * * * /usr/bin/rsync -av /var/www/personal-website/ /var/backups/daily-$(date +\%Y\%m\%d)/
```

### 日志轮转
```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/personal-website
```

### 性能监控
- 使用 `htop` 监控系统资源
- 使用 `nginx -t` 检查配置
- 定期检查磁盘空间 `df -h`

## 🎉 部署完成

部署成功后，你的个人网站将在以下地址可用：
- 前端: `https://your-domain.com`
- 后端API: `https://your-domain.com/api`
- 健康检查: `https://your-domain.com/health`

享受你的个人网站吧！🚀