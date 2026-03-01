"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ProgressContextType {
  completedSubTopics: string[];
  toggleSubTopic: (slug: string) => void;
  isSubTopicCompleted: (slug: string) => boolean;
  getProgressForTopic: (subTopicSlugs: string[]) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedSubTopics, setCompletedSubTopics] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ciu-progress');
    if (saved) {
      try {
        setCompletedSubTopics(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ciu-progress', JSON.stringify(completedSubTopics));
    }
  }, [completedSubTopics, isInitialized]);

  const toggleSubTopic = (slug: string) => {
    setCompletedSubTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isSubTopicCompleted = (slug: string) => completedSubTopics.includes(slug);

  const getProgressForTopic = (subTopicSlugs: string[]) => {
    if (subTopicSlugs.length === 0) return 0;
    const completedCount = subTopicSlugs.filter(slug => completedSubTopics.includes(slug)).length;
    return Math.round((completedCount / subTopicSlugs.length) * 100);
  };

  return (
    <ProgressContext.Provider value={{ completedSubTopics, toggleSubTopic, isSubTopicCompleted, getProgressForTopic }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
