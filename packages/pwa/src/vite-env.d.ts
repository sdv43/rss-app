/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SERVER_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
