#!/usr/bin/env tsx

/**
 * GitHub OAuth 配置验证脚本
 * 运行此脚本来检查你的 OAuth 配置是否正确
 */

import dotenv from 'dotenv'
import path from 'path'

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') })

console.log('🔐 GitHub OAuth 配置检查\n')

const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET
const callbackUrl = process.env.GITHUB_CALLBACK_URL

console.log('📋 当前配置:')
console.log(`Client ID: ${clientId || '❌ 未设置'}`)
console.log(`Client Secret: ${clientSecret ? '✅ 已设置 (长度: ' + clientSecret.length + ')' : '❌ 未设置'}`)
console.log(`Callback URL: ${callbackUrl || '❌ 未设置'}`)

console.log('\n🔍 配置检查:')

// 检查 Client ID
if (!clientId) {
  console.log('❌ GITHUB_CLIENT_ID 未设置')
} else if (clientId === 'your_github_client_id') {
  console.log('❌ GITHUB_CLIENT_ID 仍然是占位符，请设置真实的 Client ID')
} else if (clientId.startsWith('Ov23li')) {
  console.log('✅ GITHUB_CLIENT_ID 格式正确')
} else {
  console.log('⚠️  GITHUB_CLIENT_ID 格式可能不正确')
}

// 检查 Client Secret
if (!clientSecret) {
  console.log('❌ GITHUB_CLIENT_SECRET 未设置')
} else if (clientSecret === 'your_github_client_secret' || clientSecret.includes('请在这里粘贴')) {
  console.log('❌ GITHUB_CLIENT_SECRET 仍然是占位符，请设置真实的 Client Secret')
} else if (clientSecret.startsWith('ghp_') || clientSecret.startsWith('ghs_')) {
  console.log('✅ GITHUB_CLIENT_SECRET 格式正确')
} else {
  console.log('⚠️  GITHUB_CLIENT_SECRET 格式可能不正确')
}

// 检查回调 URL
if (!callbackUrl) {
  console.log('❌ GITHUB_CALLBACK_URL 未设置')
} else if (callbackUrl.includes('localhost:5001')) {
  console.log('✅ GITHUB_CALLBACK_URL 格式正确（开发环境）')
} else {
  console.log('✅ GITHUB_CALLBACK_URL 已设置（生产环境）')
}

console.log('\n📝 下一步操作:')

if (!clientId || clientId === 'your_github_client_id') {
  console.log('1. 访问 https://github.com/settings/developers')
  console.log('2. 创建或查看你的 OAuth 应用')
  console.log('3. 复制 Client ID 到 backend/.env 文件')
}

if (!clientSecret || clientSecret === 'your_github_client_secret' || clientSecret.includes('请在这里粘贴')) {
  console.log('1. 在 GitHub OAuth 应用页面点击 "Generate a new client secret"')
  console.log('2. 复制生成的 Client Secret')
  console.log('3. 粘贴到 backend/.env 文件中的 GITHUB_CLIENT_SECRET')
}

console.log('\n🚀 配置完成后，重启服务器并测试 GitHub 登录功能')