import fs from 'fs';
import { Resource, Topic, Section } from './types';

/**
 * CIU High-Fidelity Parser
 * Captures 100% of the curriculum data using a structure-aware line-by-line
 * approach that handles headers, indented headers, and nested list structures.
 */

// Unicode-aware slugify that preserves international letters and numbers
const slugify = (text: string) =>
  text
    .toLowerCase() // Locale-invariant
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep Unicode letters, numbers, spaces, hyphens
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-'); // Consolidate multiple hyphens

const normalizeTitle = (title: string, fallback: string = '') => {
  return title.replace(/\[(.*?)\]\(.*?\)/, '$1').replace(/\*+/g, '').trim() || fallback;
};

export const getResourceType = (url: string): Resource['type'] => {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) return 'video';
  if (u.includes('amazon.com') || u.includes('books.google') || u.includes('oreilly.com')) return 'book';
  if (u.includes('labex.io') || u.includes('exercism.org') || u.includes('codewars.com') || u.includes('leetcode.com')) return 'interactive';
  return 'other';
};

export function parseCurriculum(filePath: string): Section[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Curriculum file not found at ${filePath}`);
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let currentTopic: Topic | null = null;
    const usedIds = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const h2Match = trimmed.match(/^(?:-\s+)?##\s+(.*)/);
      const h3Match = trimmed.match(/^(?:-\s+)?###\s+(.*)/);
      const boldListMatch = trimmed.match(/^-\s+\*\*(.*)\*\*/);

      if (h2Match && h2Match[1]) {
         const title = normalizeTitle(h2Match[1]);
         // Fix: explicitly clear context for excluded sections to prevent link leaking
         if (title.startsWith('[⬆') || title === 'LICENSE' || title === 'Table of Contents' || title.includes('---')) {
            currentSection = null;
            currentTopic = null;
            return;
         }

         currentSection = { title, topics: [] };
         sections.push(currentSection);

         const baseId = slugify(title) || 'section';
         let id = baseId;
         let counter = 0;
         while (usedIds.has(id)) {
           id = `${baseId}-${++counter}`;
         }
         usedIds.add(id);
         currentTopic = { id, title: "Overview", completed: false, resources: [] };
         currentSection.topics.push(currentTopic);
      } else if (currentSection && ((h3Match && h3Match[1]) || (boldListMatch && boldListMatch[1]))) {
         const rawTitle = h3Match ? h3Match[1] : boldListMatch![1];
         const title = normalizeTitle(rawTitle);

         const tMatch = title.trim();
         if (!tMatch || tMatch.startsWith('#')) return;

         const baseId = slugify(title) || 'topic';
         let id = baseId;
         let counter = 0;
         while (usedIds.has(id)) {
           id = `${baseId}-${++counter}`;
         }
         usedIds.add(id);

         currentTopic = { id, title, completed: false, resources: [] };
         currentSection.topics.push(currentTopic);
      } else if (currentTopic) {
        // Tightened regex: handles optional angle brackets and requires https? protocol
        const linkMatch = trimmed.match(/\[(.*?)\]\((?:<)?(https?:\/\/[^\s>)]+)(?:>)?\)/i);
        if (linkMatch && linkMatch[1] && linkMatch[2]) {
           const url = linkMatch[2];
           if (!currentTopic.resources.some(r => r.url === url)) {
             currentTopic.resources.push({
               title: normalizeTitle(linkMatch[1], url),
               url: url,
               type: getResourceType(url)
             });
           }
        }
      }
    });

    // Cleanup: Remove empty overview topics and empty sections
    const filteredSections = sections.filter(s => {
       if (s.topics.length > 1 && s.topics[0].title === "Overview" && s.topics[0].resources.length === 0) {
          s.topics.shift();
       }
       return s.topics.some(t => t.resources.length > 0);
    });

    return filteredSections.filter(s => s.title !== 'The Study Plan');
  } catch (e) {
    console.error(`Failed to parse curriculum at ${filePath}:`, e);
    return [];
  }
}

export function parseLanguageResources(filePath: string): Record<string, Resource[]> {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Language resources file not found at ${filePath}`);
      return {};
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections: Record<string, Resource[]> = {};
    const lines = content.split('\n');
    let currentLang = '';

    lines.forEach(line => {
      const t = line.trim();
      if (!t) return;

      // Handle links with potential angle brackets and protocol validation
      const linkMatch = t.match(/\[(.*?)\]\((?:<)?(https?:\/\/[^\s>)]+)(?:>)?\)/i);

      if (linkMatch && linkMatch[1] && linkMatch[2] && currentLang) {
        const url = linkMatch[2];
        if (!sections[currentLang].some(r => r.url === url)) {
          sections[currentLang].push({
            title: normalizeTitle(linkMatch[1], url),
            url: url,
            type: getResourceType(url)
          });
        }
      } else if (line.startsWith('- ')) {
        // Only treat top-level bullets (not indented) as language headers
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
