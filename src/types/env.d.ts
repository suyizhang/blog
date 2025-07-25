/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GITHUB_CLIENT_ID: string
  // 添加更多环境变量类型定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}