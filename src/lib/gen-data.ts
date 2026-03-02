import fs from 'fs';
import path from 'path';
import { parseMarkdownToCurriculum } from './curriculum-utils';
import { SUPPORTED_LANGUAGES } from './constants';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

SUPPORTED_LANGUAGES.forEach((lang) => {
  try {
    const filePath = lang.code === 'en'
      ? path.join(process.cwd(), 'README.md')
      : path.join(process.cwd(), 'translations', `README-${lang.code}.md`);

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Shared logic between build generation and runtime parser
      const curriculum = parseMarkdownToCurriculum(content);

      fs.writeFileSync(
        path.join(DATA_DIR, `curriculum-${lang.code}.json`),
        JSON.stringify(curriculum, null, 2)
      );
      console.log(`✅ Pre-generated curriculum for ${lang.name} (${lang.code})`);
    } else {
      console.warn(`⚠️ Missing README for ${lang.code} at ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to generate data for ${lang.name} (${lang.code}):`, error);
  }
});
