# 🚀 Deployment Guide

This guide explains how to deploy your personal website using GitHub Actions to various platforms.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Platform Accounts**: Create accounts on your chosen deployment platforms
3. **Environment Variables**: Configure secrets in GitHub repository settings

## 🔧 Deployment Platforms

### Frontend Deployment Options

#### Option 1: Vercel (Recommended)
1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Install Vercel CLI**: `npm i -g vercel`
3. **Link Project**: Run `vercel` in your project root
4. **Get Project Details**: Run `vercel project ls` to get project ID and org ID

#### Option 2: Netlify
1. **Create Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Get Site ID**: Create a new site and copy the Site ID
3. **Generate Auth Token**: Go to User Settings > Applications > Personal access tokens

### Backend Deployment Options

#### Option 1: Railway (Recommended)
1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Install Railway CLI**: `npm i -g @railway/cli`
3. **Login**: `railway login`
4. **Create Project**: `railway init`

#### Option 2: Render
1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **Connect GitHub**: Link your GitHub repository
3. **Create Web Service**: Choose your repository and configure

## 🔐 GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions

### Required Secrets

#### For Vercel Deployment:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
VITE_API_URL=https://your-backend-url.railway.app
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
```

#### For Railway Deployment:
```
RAILWAY_TOKEN=your_railway_token
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

#### For Netlify (Alternative):
```
NETLIFY_SITE_ID=your_netlify_site_id
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
```

## 🔑 GitHub OAuth App Setup

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Create New OAuth App**:
   - Application name: `Your Personal Website`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-backend-url.railway.app/api/auth/github/callback`
3. **Copy Client ID and Secret**: Add them to your GitHub secrets

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL
1. **Add Database**: In Railway dashboard, click "Add Service" → "Database" → "PostgreSQL"
2. **Get Connection String**: Copy the DATABASE_URL from the database service
3. **Update Environment**: Add DATABASE_URL to your backend environment variables

### Option 2: Supabase (Alternative)
1. **Create Supabase Project**: Sign up at [supabase.com](https://supabase.com)
2. **Get Database URL**: Go to Settings → Database → Connection string
3. **Update Schema**: Run your Prisma migrations

## 🚀 Deployment Process

### Automatic Deployment
1. **Push to Main**: Every push to the `main` branch triggers deployment
2. **Pull Request Previews**: PRs automatically create preview deployments
3. **CI/CD Pipeline**: Runs tests, builds, and deploys automatically

### Manual Deployment
```bash
# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway
railway up
```

## 📊 Monitoring and Logs

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Logs**: View deployment and function logs
- **Analytics**: Monitor performance and usage

### Railway
- **Dashboard**: https://railway.app/dashboard
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and network usage

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Backend (.env)
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
CORS_ORIGIN=http://localhost:3000
PORT=5001
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

2. **API Connection Issues**:
   - Ensure CORS_ORIGIN matches your frontend URL
   - Verify API_URL in frontend environment
   - Check network policies and firewall settings

3. **Database Connection**:
   - Verify DATABASE_URL format
   - Check database service is running
   - Ensure migrations are applied

### Debug Commands
```bash
# Check Vercel deployment logs
vercel logs

# Check Railway deployment logs
railway logs

# Test API endpoints
curl https://your-backend-url.railway.app/health
```

## 📈 Performance Optimization

1. **Enable Caching**: Configure CDN and browser caching
2. **Optimize Images**: Use WebP format and proper sizing
3. **Bundle Analysis**: Monitor bundle size and optimize imports
4. **Database Indexing**: Add indexes for frequently queried fields

## 🔒 Security Checklist

- [ ] Environment variables are properly secured
- [ ] CORS is configured correctly
- [ ] HTTPS is enforced
- [ ] Database credentials are not exposed
- [ ] JWT secrets are strong and unique
- [ ] Rate limiting is implemented
- [ ] Input validation is in place

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)