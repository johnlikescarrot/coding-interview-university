import { LanguageCode, SUPPORTED_LANGUAGES } from './constants'

export interface CurriculumTopic {
  id: string
  title: string
  content?: string
  subtopics: CurriculumTopic[]
  links: { title: string; url: string }[]
  checkboxes?: { id: string; text: string; completed: boolean }[]
}

export function sanitizeUrl(url: string): string {
  const forbiddenProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:']

  // Exhaustive Unicode-aware sanitization: Normalize and strip all whitespace,
  // control chars, and zero-width characters that can bypass protocol checks.
  const sanitized = Array.from(url.normalize())
    .filter(char => {
      const code = char.charCodeAt(0)
      // ASCII Control: 0-31, 127
      // Unicode Whitespace: U+00A0 (NBSP), U+1680, U+2000-U+200A, U+202F, U+205F, U+3000
      // Zero-width/Separators: U+200B-U+200D (ZWSP variants), U+2028-U+2029, U+FEFF (BOM)
      const isControl = code <= 0x1F || code === 0x7F
      const isUnicodeWhitespace = code === 0x00A0 || code === 0x1680 ||
                                 (code >= 0x2000 && code <= 0x200A) ||
                                 code === 0x202F || code === 0x205F || code === 0x3000
      const isSpecialChar = (code >= 0x200B && code <= 0x200D) ||
                            code === 0x2028 || code === 0x2029 || code === 0xFEFF

      return !isControl && !isUnicodeWhitespace && !isSpecialChar
    })
    .join('')
    .trim()

  const normalized = sanitized.toLowerCase()

  if (forbiddenProtocols.some(proto => normalized.startsWith(proto))) {
    return '#'
  }
  return sanitized
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uac00-\ud7af]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'topic'
}

export function generateCheckboxId(topicId: string, text: string, existingIds: Set<string>): string {
  let hash = 0
  const str = `${topicId}:${text}`
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  let id = `check-${Math.abs(hash).toString(36)}`

  if (existingIds.has(id)) {
    let counter = 1
    while (existingIds.has(`${id}-${counter}`)) {
      counter++
    }
    id = `${id}-${counter}`
  }
  existingIds.add(id)
  return id
}

export function parseMarkdownToCurriculum(markdown: string): CurriculumTopic[] {
  const content = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = content.split('\n')
  const root: CurriculumTopic[] = []
  const stack: { level: number; topic: CurriculumTopic }[] = []
  const usedTopicIds = new Set<string>()
  const usedCheckboxIds = new Set<string>()

  let currentTopic: CurriculumTopic | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const headerMatch = lines[i].match(/^[ ]{0,3}(#{1,6})\s+(.*)$/)

    if (headerMatch) {
      const level = headerMatch[1].length
      const title = headerMatch[2].trim()
      let id = createSlug(title)

      if (usedTopicIds.has(id)) {
        let counter = 1
        while (usedTopicIds.has(`${id}-${counter}`)) {
          counter++
        }
        id = `${id}-${counter}`
      }
      usedTopicIds.add(id)

      const newTopic: CurriculumTopic = {
        id,
        title,
        subtopics: [],
        links: [],
      }

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }

      if (stack.length === 0) {
        root.push(newTopic)
      } else {
        stack[stack.length - 1].topic.subtopics.push(newTopic)
      }

      stack.push({ level, topic: newTopic })
      currentTopic = newTopic
      continue
    }

    if (currentTopic) {
      const checkboxMatch = line.match(/^- \[([ xX])\] (.*)$/)
      if (checkboxMatch) {
        if (!currentTopic.checkboxes) currentTopic.checkboxes = []
        const text = checkboxMatch[2].trim()
        currentTopic.checkboxes.push({
          id: generateCheckboxId(currentTopic.id, text, usedCheckboxIds),
          text,
          completed: checkboxMatch[1].toLowerCase() === 'x',
        })
        continue
      }

      const linkMatches = line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)
      for (const match of linkMatches) {
        currentTopic.links.push({
          title: match[1],
          url: sanitizeUrl(match[2])
        })
      }
    }
  }

  return root
}

export function isValidLanguage(lang: string): lang is LanguageCode {
  return SUPPORTED_LANGUAGES.some(l => l.code === lang)
}
