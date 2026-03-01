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
  // Strip control characters from the URL string itself to prevent XSS bypass
  // Use Unicode escape sequences for static analysis compliance
  const sanitized = url.replace(/[\u0000-\u001F\u007F]/g, "").trim()
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

  // Collision detection with disambiguation
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
    const headerMatch = lines[i].match(/^(#{1,6})\s+(.*)$/)

    if (headerMatch) {
      const level = headerMatch[1].length
      const title = headerMatch[2].trim()
      let id = createSlug(title)

      // Disambiguate topic ID
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
