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
