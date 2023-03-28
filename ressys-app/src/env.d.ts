interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
