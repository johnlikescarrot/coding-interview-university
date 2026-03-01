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
  const forbiddenProtocols = ['javascript:', 'data:', 'vbscript:']
  // Strip control characters before checking the protocol to prevent XSS bypass
  const normalizedUrl = url.replace(/[\x00-\x1F\x7F]/g, "").trim().toLowerCase()
  if (forbiddenProtocols.some(proto => normalizedUrl.startsWith(proto))) {
    return '#'
  }
  return url
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uac00-\ud7af]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'topic'
}

export function generateCheckboxId(topicId: string, text: string): string {
  let hash = 0
  const str = `${topicId}:${text}`
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return `check-${Math.abs(hash).toString(36)}`
}

export function parseMarkdownToCurriculum(markdown: string): CurriculumTopic[] {
  const content = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = content.split('\n')
  const root: CurriculumTopic[] = []
  const stack: { level: number; topic: CurriculumTopic }[] = []

  let currentTopic: CurriculumTopic | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const headerMatch = lines[i].match(/^(#{1,6})\s+(.*)$/)

    if (headerMatch) {
      const level = headerMatch[1].length
      const title = headerMatch[2].trim()
      const id = createSlug(title)

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
          id: generateCheckboxId(currentTopic.id, text),
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
