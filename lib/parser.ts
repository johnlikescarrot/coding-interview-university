import { Section, FlattenedTopic } from './types';

export function flattenTopics(sections: Section[]): FlattenedTopic[] {
  return sections.flatMap((section) =>
    section.topics.map((topic) => ({
      title: topic.title,
      id: topic.id,
      section: section.title,
    }))
  );
}
