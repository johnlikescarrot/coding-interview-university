import { LanguageCode, SUPPORTED_LANGUAGES } from './constants'

export interface CurriculumLink {
  title: string
  url: string
}

export interface CheckboxItem {
  id: string
  text: string
  completed: boolean
}

export interface CurriculumTopic {
  id: string
  title: string
  links: CurriculumLink[]
  checkboxes: CheckboxItem[]
  subtopics: CurriculumTopic[]
}

export function isValidLanguage(lang: string): lang is LanguageCode {
  return SUPPORTED_LANGUAGES.some(l => l.code === lang)
}
