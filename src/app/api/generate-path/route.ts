import { generateObject } from "ai";
import { gemini } from "@/lib/ai";
import { LearningPathSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const { currentSkills, goalRole, timeframe } = await req.json();

  try {
    const { object } = await generateObject({
      model: gemini,
      schema: LearningPathSchema,
      prompt: `Create a comprehensive, structured learning path for a student.

Current skills: ${currentSkills?.join(", ") || "None specified"}
Career goal: ${goalRole || "Software Developer"}
Timeframe: ${timeframe || "6 months"}

Requirements:
- Break the journey into 3-5 phases (Foundation → Intermediate → Advanced → Portfolio → Job Ready)
- Each phase should have 2-4 specific skills to learn
- Include prerequisites showing how skills connect
- Add real, actionable milestone projects for each phase
- Suggest a mix of resource types (videos, articles, courses, hands-on projects)

IMPORTANT - For EVERY suggested resource, you MUST provide a real, working URL:
- For video resources: Use real YouTube URLs like https://www.youtube.com/watch?v=... (from channels like Traversy Media, freeCodeCamp, Fireship, The Coding Train, Web Dev Simplified, Academind, Net Ninja, Programming with Mosh)
- For course resources: Use URLs from freeCodeCamp.org, Codecademy, Khan Academy, or Coursera
- For article resources: Use URLs from MDN Web Docs, W3Schools, or official documentation sites
- For project resources: Use GitHub trending or project tutorial URLs
- NEVER leave the URL field empty - always provide a real link

- Make the difficulty progression gradual and realistic
- Ensure skills build on each other logically`,
    });

    return Response.json(object);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: error.message || "Unknown error occurred" }, { status: 500 });
  }
}
