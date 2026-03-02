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

function generateId(text: string, usedIds: Set<string>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    // Support non-latin characters while stripping punctuation
    .replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u3130-\u318f\uac00-\ud7af-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  let candidate = base || 'topic'
  let counter = 1

  while (usedIds.has(candidate)) {
    candidate = `${base || 'topic'}-${counter++}`
  }

  usedIds.add(candidate)
  return candidate
}

export function parseMarkdownToCurriculum(markdown: string): CurriculumTopic[] {
  // Strip BOM and normalize line endings
  const normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')

  const root: CurriculumTopic[] = []
  const stack: (CurriculumTopic | null)[] = []
  const usedIds = new Set<string>()

  lines.forEach((line) => {
    // ATX headings allow up to 3 leading spaces
    const headingMatch = line.match(/^[ \t]{0,3}(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const title = headingMatch[2].trim()

      const topic: CurriculumTopic = {
        id: generateId(title, usedIds),
        title,
        links: [],
        checkboxes: [],
        subtopics: [],
      }

      if (level === 1) {
        root.push(topic)
        stack.length = 0
        stack[0] = topic
      } else {
        // Find the nearest ancestor (downward search)
        let parent = null
        for (let i = level - 2; i >= 0; i--) {
          if (stack[i]) {
            parent = stack[i]
            break
          }
        }

        if (parent) {
          parent.subtopics.push(topic)
          stack[level - 1] = topic
          // Clear children deeper than current level
          stack.length = level
        } else {
          // If no parent found, treat as root
          root.push(topic)
          stack.length = 0
          stack[0] = topic
        }
      }
    }

    // Process content for the current deepest topic in stack
    const currentTopic = stack[stack.length - 1]
    if (currentTopic) {
      // Link extraction (supporting multiple links per line)
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
      let m
      while ((m = linkRegex.exec(line)) !== null) {
        currentTopic.links.push({ title: m[1], url: m[2] })
      }

      // Checkbox extraction
      const checkboxMatch = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/)
      if (checkboxMatch) {
        const text = checkboxMatch[2].trim()
        currentTopic.checkboxes.push({
          id: generateId(`${text}-${currentTopic.id}`, usedIds),
          text,
          completed: checkboxMatch[1].toLowerCase() === 'x',
        })
      }
    }
  })

  return root
}
