export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'cn', name: '简体中文' },
  { code: 'ja', name: '日本語' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']
