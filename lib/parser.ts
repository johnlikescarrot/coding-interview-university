import fs from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'interactive' | 'other';
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  resources: Resource[];
}

export interface Section {
  title: string;
  topics: Topic[];
}

interface MdNode {
  type: string;
  value?: string;
  depth?: number;
  children?: MdNode[];
  url?: string;
}

export const extractText = (node: MdNode): string => {
  if (node.value) return node.value;
  return (node.children || []).map(extractText).join('');
};

export const getResourceType = (url: string): Resource['type'] => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) return 'video';
  if (u.includes('amazon.com') || u.includes('books.google') || u.includes('oreilly.com')) return 'book';
  const interactive = ['labex.io', 'exercism.org', 'codewars.com', 'leetcode.com'];
  if (interactive.some(d => u.includes(d))) return 'interactive';
  if (u.includes('article') || u.includes('blog') || u.includes('medium.com')) return 'article';
  return 'other';
};

export function parseCurriculum(filePath: string): Section[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const tree = unified().use(remarkParse).use(remarkGfm).parse(content) as any;
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let currentTopic: Topic | null = null;
    const usedIds = new Set<string>();

    for (const node of tree.children) {
      if (node.type === 'heading') {
        const text = extractText(node);
        if (node.depth === 2) {
          currentSection = { title: text, topics: [] };
          sections.push(currentSection);
          currentTopic = null;
          continue;
        }

        if (node.depth === 3 && currentSection) {
          const baseId = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'heading';
          let id = baseId;
          let counter = 1;
          while (usedIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }
          usedIds.add(id);
          currentTopic = { id, title: text, completed: false, resources: [] };
          currentSection.topics.push(currentTopic);
          continue;
        }
      }

      if (node.type === 'list' && currentTopic) {
        for (const listItem of node.children) {
          const paragraph = listItem.children.find((c: any) => c.type === 'paragraph');
          if (!paragraph) continue;

          const link = paragraph.children.find((c: any) => c.type === 'link');
          if (link?.url && !currentTopic.resources.some(r => r.url === link.url)) {
            currentTopic.resources.push({
              title: extractText(link) || extractText(paragraph),
              url: link.url,
              type: getResourceType(link.url)
            });
          }
        }
      }
    }
    return sections;
  } catch (e) {
    console.error(`Failed to parse curriculum at ${filePath}:`, e);
    return [];
  }
}

export function parseLanguageResources(filePath: string): Record<string, Resource[]> {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`Language resources file not found: ${filePath}`);
      return {};
    }
    const sections: Record<string, Resource[]> = {};
    let currentLang = '';
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const t = line.trim();
      if (t.startsWith('- [')) {
        const match = t.match(/\[(.*?)\]\((.*?)\)/);
        if (match && currentLang && !sections[currentLang].some(r => r.url === match[2])) {
          sections[currentLang].push({ title: match[1], url: match[2], type: getResourceType(match[2]) });
        }
      } else if (t.startsWith('- ')) {
        const lang = t.replace('- ', '').trim();
        if (lang && !lang.includes('[')) {
          currentLang = lang;
          if (!sections[currentLang]) sections[currentLang] = [];
        }
      }
    }
    return sections;
  } catch (e) {
    console.error(`Failed to parse language resources at ${filePath}:`, e);
    return {};
  }
}
