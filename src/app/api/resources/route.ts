import { NextResponse } from "next/server";

// Mock Database of Curated Resources
// In a real application, we would scrape this live or fetch from Supabase.
const CURATED_RESOURCES = [
  {
    id: "1",
    title: "Next.js App Router Full Course 2024",
    url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
    source: "youtube",
    type: "video",
    difficulty: "beginner",
    category: "nextjs",
  },
  {
    id: "2",
    title: "React Official Documentation",
    url: "https://react.dev/learn",
    source: "docs",
    type: "article",
    difficulty: "beginner",
    category: "react",
  },
  {
    id: "3",
    title: "Vercel AI SDK Tutorial",
    url: "https://sdk.vercel.ai/docs/introduction",
    source: "docs",
    type: "article",
    difficulty: "intermediate",
    category: "ai",
  },
  {
    id: "4",
    title: "Build a Full-stack Next.js App with Prisma & PostgreSQL",
    url: "https://www.youtube.com/watch?v=QXxiKx0iEbw",
    source: "youtube",
    type: "video",
    difficulty: "intermediate",
    category: "fullstack",
  },
  {
    id: "5",
    title: "Tailwind CSS Tutorial for Beginners",
    url: "https://www.youtube.com/watch?v=UBOj6rqRUME",
    source: "youtube",
    type: "video",
    difficulty: "beginner",
    category: "css",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  
  // Strategy A/B Hybrid Implementation for Demo
  // 1. If we have it in our curated DB, return it.
  // 2. Otherwise, we simulate fetching from YouTube Data API
  
  if (!query) {
    return NextResponse.json({ resources: CURATED_RESOURCES });
  }

  const exactMatches = CURATED_RESOURCES.filter(
    (res) => res.category.includes(query) || res.title.toLowerCase().includes(query)
  );

  if (exactMatches.length > 0) {
    return NextResponse.json({ resources: exactMatches });
  }

  // Simulated Web Scraping / API Fetching delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    resources: [
      {
        id: "mock-1",
        title: `Complete ${query} Tutorial for Beginners`,
        url: `https://www.youtube.com/results?search_query=${query}+tutorial`,
        source: "youtube",
        type: "video",
        difficulty: "beginner",
        category: query,
      },
      {
        id: "mock-2",
        title: `Advanced ${query} Concepts You Need to Know`,
        url: `https://dev.to/search?q=${query}`,
        source: "article",
        type: "article",
        difficulty: "advanced",
        category: query,
      }
    ]
  });
}
