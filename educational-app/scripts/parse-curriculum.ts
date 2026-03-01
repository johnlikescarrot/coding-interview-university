import fs from 'fs';
import path from 'path';

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'other';
}

export interface SubTopic {
  title: string;
  slug: string;
  items: string[];
  resources: Resource[];
}

export interface Topic {
  title: string;
  slug: string;
  subtopics: SubTopic[];
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

function parseMarkdown(filePath: string): Topic[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const topics: Topic[] = [];
  let currentTopic: Topic | null = null;
  let currentSubTopic: SubTopic | null = null;
  let inTopicsSection = false;

  for (const line of lines) {
    // Start parsing from Algorithmic complexity
    if (line.includes('## Algorithmic complexity')) {
      inTopicsSection = true;
    }

    if (!inTopicsSection) continue;

    // Matches H2 topics (e.g., ## Data Structures)
    const h2Match = line.match(/^## (.+)/);
    if (h2Match) {
      const title = h2Match[1].trim();
      if (title === 'Final Review' || title === 'Getting the Job') {
        // Skip these sections as major topics
        continue;
      }
      currentTopic = {
        title,
        slug: slugify(title),
        subtopics: [],
      };
      topics.push(currentTopic);
      currentSubTopic = null;
      continue;
    }

    // Matches H3 subtopics (e.g., - ### Arrays)
    const h3Match = line.match(/^- ### (.+)/) || line.match(/^### (.+)/) || line.match(/^\s+- ### (.+)/);
    if (h3Match && currentTopic) {
      const title = h3Match[1].trim();
      currentSubTopic = {
        title,
        slug: slugify(title),
        items: [],
        resources: [],
      };
      currentTopic.subtopics.push(currentSubTopic);
      continue;
    }

    // Matches list items with links
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && currentSubTopic) {
      const title = linkMatch[1].trim();
      let url = linkMatch[2].trim();

      // Filter out navigation artifacts
      if (url.startsWith('#') || title.toLowerCase().includes('back to top')) {
        continue;
      }

      // Fix Wikipedia URLs (markdown parser might strip trailing paren)
      if (url.includes('wikipedia.org') && url.includes('(') && !url.endsWith(')')) {
        url += ')';
      }

      let type: Resource['type'] = 'article';
      if (url.includes('youtube.com') || url.includes('youtu.be')) type = 'video';
      else if (url.includes('amazon.')) type = 'book';

      currentSubTopic.resources.push({ title, url, type });
    } else if (line.trim().startsWith('- [ ]') || line.trim().startsWith('-')) {
      if (currentSubTopic) {
        const itemText = line.trim().replace(/^- \[ \] |^- /, '').trim();
        if (itemText && !itemText.startsWith('#')) {
            currentSubTopic.items.push(itemText);
        }
      }
    }
  }

  // Use the correct slugify output for the filter
  const bigOSlug = slugify('Algorithmic complexity / Big-O / Asymptotic analysis');
  return topics.filter(t => t.subtopics.length > 0 || t.slug === bigOSlug);
}

const readmePath = path.join(__dirname, '../../README.md');
const curriculum = parseMarkdown(readmePath);

fs.writeFileSync(
  path.join(__dirname, '../src/data/curriculum.json'),
  JSON.stringify(curriculum, null, 2)
);

console.log(`Successfully parsed ${curriculum.length} major topics into curriculum.json`);
