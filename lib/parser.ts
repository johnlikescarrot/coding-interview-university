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

const extractText = (node: MdNode): string => {
  if (node.value) return node.value;
  if (node.children) return node.children.map(extractText).join('');
  return '';
};

const getResourceType = (url: string): Resource['type'] => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) return 'video';
  if (u.includes('amazon.com') || u.includes('books.google') || u.includes('oreilly.com')) return 'book';
  if (u.includes('interactive') || u.includes('labex.io') || u.includes('exercism.org')) return 'interactive';
  return 'article';
};

export function parseCurriculum(filePath: string): Section[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const processor = unified().use(remarkParse).use(remarkGfm);
    const tree = processor.parse(content) as unknown as MdNode;

    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let currentTopic: Topic | null = null;

    const usedIds = new Set<string>();

    tree.children?.forEach((node) => {
      if (node.type === 'heading') {
        const text = extractText(node);
        if (node.depth === 2) {
          currentSection = { title: text, topics: [] };
          sections.push(currentSection);
          currentTopic = null;
        } else if (node.depth === 3 && currentSection) {
          const rawBaseId = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          const baseId = rawBaseId || 'heading';
          let id = baseId;
          let counter = 1;

          while (usedIds.has(id)) {
            counter++;
            id = `${baseId}-${counter}`;
          }
          usedIds.add(id);

          currentTopic = {
            id,
            title: text,
            completed: false,
            resources: []
          };
          currentSection.topics.push(currentTopic);
        }
      } else if (node.type === 'list' && currentTopic) {
        node.children?.forEach((listItem) => {
          // Standard pattern: listItem -> paragraph -> link
          const paragraph = listItem.children?.find((c) => c.type === 'paragraph');
          if (paragraph) {
            const link = paragraph.children?.find((c) => c.type === 'link');
            if (link && link.url) {
               currentTopic?.resources.push({
                 title: extractText(link) || extractText(paragraph),
                 url: link.url,
                 type: getResourceType(link.url)
               });
            }
          }
        });
      }
    });

    return sections;
  } catch (e) {
    console.error(`Failed to parse curriculum at ${filePath}:`, e);
    return [];
  }
}

export function parseLanguageResources(filePath: string): Record<string, Resource[]> {
    try {
        if (!fs.existsSync(filePath)) return {};
        const content = fs.readFileSync(filePath, 'utf-8');
        const sections: Record<string, Resource[]> = {};
        const lines = content.split('\n');
        let currentLang = '';

        lines.forEach(line => {
            const t = line.trim();
            if (t.startsWith('- [')) {
                const match = t.match(/\[(.*?)\]\((.*?)\)/);
                if (match && currentLang) {
                    sections[currentLang].push({
                        title: match[1],
                        url: match[2],
                        type: getResourceType(match[2])
                    });
                }
            } else if (t.startsWith('- ')) {
                const lang = t.replace('- ', '').trim();
                if (!lang.includes('[')) {
                    currentLang = lang;
                    sections[currentLang] = [];
                }
            }
        });

        return sections;
    } catch (e) {
        console.error(`Failed to parse language resources at ${filePath}:`, e);
        return {};
    }
}
