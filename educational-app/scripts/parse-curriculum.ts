import fs from 'fs';
import path from 'path';

interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'other';
}

interface SubTopic {
  title: string;
  slug: string;
  items: string[];
  resources: Resource[];
}

interface Topic {
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
        // We can stop or continue, let's continue for now but mark end later if needed
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
    const h3Match = line.match(/^- ### (.+)/) || line.match(/^### (.+)/) || line.match(/^ - ### (.+)/);
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
      const title = linkMatch[1];
      const url = linkMatch[2];
      let type: Resource['type'] = 'article';
      if (url.includes('youtube.com') || url.includes('youtu.be')) type = 'video';
      else if (url.includes('amazon.com')) type = 'book';

      currentSubTopic.resources.push({ title, url, type });
    } else if (line.trim().startsWith('- [ ]') || line.trim().startsWith('-')) {
      if (currentSubTopic) {
        const itemText = line.replace(/^- \[ \] |^- /, '').trim();
        if (itemText && !itemText.startsWith('#')) {
            currentSubTopic.items.push(itemText);
        }
      }
    }
  }

  return topics.filter(t => t.subtopics.length > 0 || ['algorithmic-complexity--big-o--asymptotic-analysis'].includes(t.slug));
}

const readmePath = path.join(__dirname, '../../README.md');
const curriculum = parseMarkdown(readmePath);

fs.writeFileSync(
  path.join(__dirname, '../src/data/curriculum.json'),
  JSON.stringify(curriculum, null, 2)
);

console.log(`Successfully parsed ${curriculum.length} major topics into curriculum.json`);
