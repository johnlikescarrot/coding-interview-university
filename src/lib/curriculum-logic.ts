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

function generateId(text: string): string {
  // Enhanced ID generation for non-latin characters
  const base = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u3130-\u318f\uac00-\ud7af-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base || 'topic-' + Math.random().toString(36).substring(2, 9)
}

export function parseMarkdownToCurriculum(markdown: string): CurriculumTopic[] {
  const lines = markdown.split('\n')
  const root: CurriculumTopic[] = []
  const stack: CurriculumTopic[] = []

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const title = headingMatch[2].trim()
      const topic: CurriculumTopic = {
        id: generateId(title),
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
        const parentIdx = level - 2
        while (stack.length > parentIdx + 1) {
          stack.pop()
        }

        const parent = stack[parentIdx]
        if (parent) {
          parent.subtopics.push(topic)
          stack[parentIdx + 1] = topic
        } else {
          // Fallback for skipped levels
          const lastRoot = root[root.length - 1]
          if (lastRoot) {
            lastRoot.subtopics.push(topic)
            stack[1] = topic
          } else {
            root.push(topic)
            stack[0] = topic
          }
        }
      }
    }

    const currentTopic = stack[stack.length - 1]
    if (currentTopic) {
      // Link extraction
      const linkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)
      if (linkMatch) {
        linkMatch.forEach(m => {
          const parts = m.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/)
          if (parts) {
            currentTopic.links.push({ title: parts[1], url: parts[2] })
          }
        })
      }

      // Checkbox extraction
      const checkboxMatch = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/)
      if (checkboxMatch) {
        const text = checkboxMatch[2].trim()
        currentTopic.checkboxes.push({
          id: generateId(text + '-' + currentTopic.id),
          text,
          completed: checkboxMatch[1].toLowerCase() === 'x',
        })
      }
    }
  })

  return root
}
