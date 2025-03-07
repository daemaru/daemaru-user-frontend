/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
