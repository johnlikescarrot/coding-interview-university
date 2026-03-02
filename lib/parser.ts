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
  if (node.value) {
    return node.value;
  }
  const children = node.children;
  if (children) {
    return children.map(extractText).join('');
  }
  return '';
};

const getResourceType = (url: string): Resource['type'] => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com')) {
      return 'video';
  }
  if (u.includes('youtu.be')) {
      return 'video';
  }
  if (u.includes('vimeo.com')) {
      return 'video';
  }
  if (u.includes('amazon.com')) {
      return 'book';
  }
  if (u.includes('books.google')) {
      return 'book';
  }
  if (u.includes('oreilly.com')) {
      return 'book';
  }
  if (u.includes('labex.io')) {
      return 'interactive';
  }
  if (u.includes('exercism.org')) {
      return 'interactive';
  }
  if (u.includes('codewars.com')) {
      return 'interactive';
  }
  if (u.includes('leetcode.com')) {
      return 'interactive';
  }
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

    const treeNodes = tree.children;
    if (treeNodes) {
        treeNodes.forEach((node) => {
          if (node.type === 'heading') {
            const text = extractText(node);
            if (node.depth === 2) {
              currentSection = { title: text, topics: [] };
              sections.push(currentSection);
              currentTopic = null;
            } else if (node.depth === 3) {
                if (currentSection) {
                    const rawBaseId = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    let baseId = rawBaseId;
                    if (!baseId) {
                      baseId = 'heading';
                    }
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
            }
          } else if (node.type === 'list') {
              if (currentTopic) {
                const listItems = node.children;
                if (listItems) {
                    listItems.forEach((listItem) => {
                      const listItemNodes = listItem.children;
                      if (listItemNodes) {
                          const paragraph = listItemNodes.find((c) => c.type === 'paragraph');
                          if (paragraph) {
                            const paragraphNodes = paragraph.children;
                            if (paragraphNodes) {
                                const link = paragraphNodes.find((c) => c.type === 'link');
                                if (link) {
                                    if (link.url && currentTopic) {
                                       // Deduplicate by URL
                                       const resourceExists = currentTopic.resources.some(r => r.url === link.url);
                                       if (!resourceExists) {
                                         let title = extractText(link);
                                         if (!title) {
                                           title = extractText(paragraph);
                                         }
                                         currentTopic.resources.push({
                                           title,
                                           url: link.url,
                                           type: getResourceType(link.url)
                                         });
                                       }
                                    }
                                }
                            }
                          }
                      }
                    });
                }
              }
          }
        });
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
        const content = fs.readFileSync(filePath, 'utf-8');
        const sections: Record<string, Resource[]> = {};
        const lines = content.split('\n');
        let currentLang = '';

        lines.forEach(line => {
            const t = line.trim();
            if (t.startsWith('- [')) {
                const match = t.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                  if (currentLang) {
                    // Deduplicate by URL
                    const exists = sections[currentLang].some(r => r.url === match[2]);
                    if (!exists) {
                      sections[currentLang].push({
                          title: match[1],
                          url: match[2],
                          type: getResourceType(match[2])
                      });
                    }
                  }
                }
            } else if (t.startsWith('- ')) {
                const lang = t.replace('- ', '').trim();
                if (lang) {
                  const hasLinkMarker = lang.includes('[');
                  if (!hasLinkMarker) {
                    currentLang = lang;
                    const langExists = sections[currentLang];
                    if (!langExists) {
                        sections[currentLang] = [];
                    }
                  }
                }
            }
        });

        return sections;
    } catch (e) {
        console.error(`Failed to parse language resources at ${filePath}:`, e);
        return {};
    }
}
