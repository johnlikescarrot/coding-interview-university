import fs from 'fs'
import path from 'path'
import {
  CurriculumTopic,
  parseMarkdownToCurriculum,
  isValidLanguage
} from './curriculum-logic'

export type { CurriculumTopic }

export function getCurriculum(lang: string = 'en'): CurriculumTopic[] {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    if (!isValidLanguage(lang)) {
      console.error(`Invalid language requested: ${lang}`)
      return []
    }

    const filePath = lang === 'en'
      ? path.join(process.cwd(), 'README.md')
      : path.join(process.cwd(), 'translations', `README-${lang}.md`)

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      return parseMarkdownToCurriculum(content)
    } catch (error) {
      console.error(`Error reading curriculum for ${lang}:`, error)
      return []
    }
  }
  return []
}
