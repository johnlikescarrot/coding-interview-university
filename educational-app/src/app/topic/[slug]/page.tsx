import Link from "next/link";
import curriculum from "@/data/curriculum.json";
import { TopicContent } from "@/components/curriculum/topic-content";
import { Metadata } from "next";
import { Topic } from "@/types/curriculum";

export async function generateStaticParams() {
  return curriculum.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = curriculum.find((t) => t.slug === slug);
  return {
    title: `${topic?.title || "Topic"} | CIU Academy`,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = curriculum.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold text-destructive">Topic Not Found</h1>
        <Link href="/" className="mt-4 text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return <TopicContent topic={topic as unknown as Topic} />;
}
