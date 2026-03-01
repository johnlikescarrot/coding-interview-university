import fs from 'fs'
import path from 'path'

export interface CurriculumTopic {
  id: string
  title: string
  content?: string
  subtopics: CurriculumTopic[]
  links: { title: string; url: string }[]
  checkboxes?: { text: string; completed: boolean }[]
}

export function parseMarkdownToCurriculum(markdown: string): CurriculumTopic[] {
  const lines = markdown.split('\n')
  const root: CurriculumTopic[] = []
  const stack: { level: number; topic: CurriculumTopic }[] = []

  let currentTopic: CurriculumTopic | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const headerMatch = lines[i].match(/^(#{1,6})\s+(.*)$/)

    if (headerMatch) {
      const level = headerMatch[1].length
      const title = headerMatch[2].trim()
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

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
      // Extract links
      const linkMatches = line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)
      for (const match of linkMatches) {
        currentTopic.links.push({ title: match[1], url: match[2] })
      }

      // Extract checkboxes
      const checkboxMatch = line.match(/^- \[([ xX])\] (.*)$/)
      if (checkboxMatch) {
        if (!currentTopic.checkboxes) currentTopic.checkboxes = []
        currentTopic.checkboxes.push({
          text: checkboxMatch[2].trim(),
          completed: checkboxMatch[1].toLowerCase() === 'x',
        })
      }
    }
  }

  return root
}

export function getCurriculum(lang: string = 'en'): CurriculumTopic[] {
  // Check if we are in node environment
  if (typeof window === 'undefined') {
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
