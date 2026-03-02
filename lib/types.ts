export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'interactive';
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

export interface FlattenedTopic {
  title: string;
  id: string;
  section: string;
}
