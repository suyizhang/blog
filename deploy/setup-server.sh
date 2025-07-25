#!/bin/bash

# 个人网站服务器部署脚本
# 使用方法: chmod +x setup-server.sh && sudo ./setup-server.sh

set -e

echo "🚀 开始设置个人网站服务器环境..."

# 更新系统
echo "📦 更新系统包..."
apt update && apt upgrade -y

# 安装必要软件
echo "📦 安装必要软件..."
apt install -y curl wget git nginx certbot python3-certbot-nginx nodejs npm build-essential

# 安装Node.js 18
echo "📦 安装Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 创建部署目录
echo "📁 创建部署目录..."
mkdir -p /var/www/personal-website
mkdir -p /var/backups
chown -R www-data:www-data /var/www/personal-website

# 配置防火墙
echo "🔥 配置防火墙..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 复制并启用systemd服务
echo "⚙️ 配置系统服务..."
cp personal-website-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable personal-website-backend

# 配置Nginx
echo "🌐 配置Nginx..."
cp nginx.conf /etc/nginx/sites-available/personal-website
ln -sf /etc/nginx/sites-available/personal-website /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# 设置SSL证书 (需要手动配置域名)
echo "🔒 SSL证书配置提醒:"
echo "请手动运行以下命令来设置SSL证书:"
echo "sudo certbot --nginx -d your-domain.com -d www.your-domain.com"

# 创建环境变量文件模板
echo "📝 创建环境变量模板..."
cat > /var/www/personal-website/backend/.env.example << 'EOF'
# 生产环境配置
DATABASE_URL="file:./prod.db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
SESSION_SECRET="your-super-secret-session-key-change-this"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="https://your-domain.com/api/auth/github/callback"
PORT=5001
NODE_ENV=production
FRONTEND_URL="https://your-domain.com"
EOF

echo "✅ 服务器环境设置完成！"
echo ""
echo "📋 接下来的步骤:"
echo "1. 在GitHub仓库设置中配置以下Secrets:"
echo "   - SERVER_HOST: 服务器IP地址"
echo "   - SERVER_USER: SSH用户名"
echo "   - SERVER_SSH_KEY: SSH私钥"
echo "   - SERVER_PORT: SSH端口 (默认22)"
echo "   - DATABASE_URL: 数据库连接字符串"
echo "   - JWT_SECRET: JWT密钥"
echo "   - SESSION_SECRET: Session密钥"
echo "   - GITHUB_CLIENT_ID: GitHub OAuth客户端ID"
echo "   - GITHUB_CLIENT_SECRET: GitHub OAuth客户端密钥"
echo "   - GITHUB_CALLBACK_URL: GitHub OAuth回调URL"
echo "   - FRONTEND_URL: 前端网站URL"
echo "   - VITE_API_URL: 后端API URL"
echo ""
echo "2. 配置域名和SSL证书:"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo ""
echo "3. 推送代码到main分支触发自动部署"
echo ""
echo "🎉 部署配置完成！"