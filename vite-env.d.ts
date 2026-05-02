/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_ENABLE_ANALYTICS: string
    readonly VITE_ENABLE_DEBUG_MODE: string
    readonly VITE_SENTRY_DSN?: string
    readonly PROD?: boolean
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
