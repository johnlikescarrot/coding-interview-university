import { CurriculumTopic, CurriculumLink, CheckboxItem } from './curriculum-logic'

/**
 * Normalizes text to a stable ID.
 * Uses slugification with support for common CJK characters.
 */
export function generateStableId(text: string, contextId: string = ''): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    // Support non-latin characters while stripping punctuation
    .replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u3130-\u318f\uac00-\ud7af-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  const finalBase = base || 'item'
  if (!contextId) return finalBase

  // Simple hash-like suffix for context uniqueness without massive bloat
  let hash = 0
  for (let i = 0; i < contextId.length; i++) {
    hash = (hash << 5) - hash + contextId.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return `${finalBase}-${Math.abs(hash).toString(36)}`
}

/**
 * Sanitizes input language string to prevent path traversal.
 */
export function sanitizeLang(lang: string): string {
  return lang.replace(/[^a-z0-9-]/gi, '').toLowerCase()
}

/**
 * Shared Markdown-to-Curriculum parsing logic.
 * DRY implementation for both build-time generation and runtime parsing.
 */
export function parseMarkdownToCurriculum(markdown: string): CurriculumTopic[] {
  // Strip BOM and normalize line endings
  const normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')

  const root: CurriculumTopic[] = []
  const stack: (CurriculumTopic | null)[] = []
  const usedTopicIds = new Set<string>()

  lines.forEach((line) => {
    // ATX headings allow up to 3 leading spaces
    const headingMatch = line.match(/^[ \t]{0,3}(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const title = headingMatch[2].trim()

      const topic: CurriculumTopic = {
        id: generateUniqueId(title, usedTopicIds),
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
          stack.length = level
        } else {
          root.push(topic)
          stack.length = 0
          stack[0] = topic
        }
      }
    }

    const currentTopic = stack[stack.length - 1]
    if (currentTopic) {
      // Link extraction
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
      let m
      while ((m = linkRegex.exec(line)) !== null) {
        currentTopic.links.push({ title: m[1], url: m[2] })
      }

      // Checkbox extraction
      const checkboxMatch = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/)
      if (checkboxMatch) {
        const text = checkboxMatch[2].trim()
        // Checkboxes use stable IDs based on text + parent topic ID
        currentTopic.checkboxes.push({
          id: generateStableId(text, currentTopic.id),
          text,
          completed: checkboxMatch[1].toLowerCase() === 'x',
        })
      }
    }
  })

  return root
}

function generateUniqueId(text: string, usedIds: Set<string>): string {
  const base = generateStableId(text)
  let candidate = base
  let counter = 1
  while (usedIds.has(candidate)) {
    candidate = `${base}-${counter++}`
  }
  usedIds.add(candidate)
  return candidate
}
