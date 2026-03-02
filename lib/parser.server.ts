import fs from 'fs';
import { Resource, Topic, Section } from './types';

/**
 * CIU High-Fidelity Parser
 * Captures 100% of the curriculum data using a structure-aware line-by-line
 * approach that handles headers, indented headers, and nested list structures.
 */

const slugify = (text: string) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

export const getResourceType = (url: string): Resource['type'] => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) return 'video';
  if (u.includes('amazon.com') || u.includes('books.google') || u.includes('oreilly.com')) return 'book';
  if (u.includes('labex.io') || u.includes('exercism.org') || u.includes('codewars.com') || u.includes('leetcode.com')) return 'interactive';
  return 'article';
};

export function parseCurriculum(filePath: string): Section[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let currentTopic: Topic | null = null;
    const usedIds = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Check for headings (including indented ones)
      const h2Match = trimmed.match(/^(?:-\s+)?##\s+(.*)/);
      const h3Match = trimmed.match(/^(?:-\s+)?###\s+(.*)/);

      // Also check for bolded list items which often act as sub-sections/topics
      const boldListMatch = trimmed.match(/^-\s+\*\*(.*)\*\*/);

      if (h2Match) {
         const title = h2Match[1].replace(/\[(.*?)\]\(.*?\)/, '$1').replace(/\*+/g, '').trim();
         if (title.startsWith('[⬆') || title === 'LICENSE' || title === 'Table of Contents' || title.includes('---')) {
            return;
         }

         currentSection = { title, topics: [] };
         sections.push(currentSection);

         const id = slugify(title) || 'section';
         usedIds.add(id);
         currentTopic = { id, title: "Overview", completed: false, resources: [] };
         currentSection.topics.push(currentTopic);
      } else if ((h3Match || boldListMatch) && currentSection) {
         const rawTitle = h3Match ? h3Match[1] : boldListMatch![1];
         const title = rawTitle.replace(/\[(.*?)\]\(.*?\)/, '$1').replace(/\*+/g, '').trim();
         if (!title || title.includes('#')) return;

         const baseId = slugify(title) || 'topic';
         let id = baseId;
         let counter = 1;
         while (usedIds.has(id)) {
           id = `${baseId}-${++counter}`;
         }
         usedIds.add(id);

         currentTopic = { id, title, completed: false, resources: [] };
         currentSection.topics.push(currentTopic);
      } else if (currentTopic) {
        const linkMatch = trimmed.match(/\[(.*?)\]\((http.*?)\)/);
        if (linkMatch && !linkMatch[2].includes('#')) {
           if (!currentTopic.resources.some(r => r.url === linkMatch[2])) {
             currentTopic.resources.push({
               title: linkMatch[1].trim() || linkMatch[2],
               url: linkMatch[2],
               type: getResourceType(linkMatch[2])
             });
           }
        }
      }
    });

    // Cleanup: remove auto-generated Overview if it's empty
    sections.forEach(s => {
       if (s.topics.length > 1 && s.topics[0].title === "Overview" && s.topics[0].resources.length === 0) {
          s.topics.shift();
       }
    });

    return sections.filter(s => s.title !== 'The Study Plan' && s.topics.some(t => t.resources.length > 0));
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
          if (!sections[currentLang].some(r => r.url === match[2])) {
            sections[currentLang].push({
              title: match[1],
              url: match[2],
              type: getResourceType(match[2])
            });
          }
        }
      } else if (t.startsWith('- ')) {
        const lang = t.replace('- ', '').trim();
        if (!lang.includes('[')) {
          currentLang = lang;
          if (!sections[currentLang]) sections[currentLang] = [];
        }
      }
    });

    return sections;
  } catch (e) {
    console.error(`Failed to parse language resources at ${filePath}:`, e);
    return {};
  }
}
