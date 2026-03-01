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

    const idCounts: Record<string, number> = {};

    tree.children?.forEach((node) => {
      if (node.type === 'heading') {
        const text = extractText(node);
        if (node.depth === 2) {
          currentSection = { title: text, topics: [] };
          sections.push(currentSection);
          currentTopic = null;
        } else if (node.depth === 3 && currentSection) {
          let id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

          if (idCounts[id]) {
             idCounts[id]++;
             id = `${id}-${idCounts[id]}`;
          } else {
             idCounts[id] = 1;
          }

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
          const paragraph = listItem.children?.find((c) => c.type === 'paragraph');
          if (paragraph) {
            const link = paragraph.children?.find((c) => c.type === 'link');
            const text = extractText(paragraph);

            if (link && link.url) {
               currentTopic?.resources.push({
                 title: text || extractText(link),
                 url: link.url,
                 type: link.url.includes('youtube') || link.url.includes('vimeo') ? 'video' : 'article'
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
            if (line.startsWith('- ')) {
                const lang = line.replace('- ', '').trim();
                if (!lang.includes('[')) {
                    currentLang = lang;
                    sections[currentLang] = [];
                }
            } else if (line.trim().startsWith('- [') && currentLang) {
                const match = line.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                    sections[currentLang].push({
                        title: match[1],
                        url: match[2],
                        type: match[2].includes('youtube') || match[2].includes('vimeo') ? 'video' : 'article'
                    });
                }
            }
        });

        return sections;
    } catch (e) {
        console.error(`Failed to parse language resources at ${filePath}:`, e);
        return {};
    }
}
