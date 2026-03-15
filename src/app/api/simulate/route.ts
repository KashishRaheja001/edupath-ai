import { generateObject } from "ai";
import { gemini } from "@/lib/ai";
import { CareerSimulationSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const { currentRole, targetRole, timeframe, hoursPerWeek } = await req.json();

  try {
    const { object } = await generateObject({
      model: gemini,
      schema: CareerSimulationSchema,
      prompt: `Create a detailed career simulation plan:

Current situation: ${currentRole || "Student with basic programming knowledge"}
Target role: ${targetRole || "Full-Stack Developer"}
Timeframe: ${timeframe || "6 months"}
Available hours per week: ${hoursPerWeek || 15}

Requirements:
- Create a realistic week-by-week plan (at least 12 weeks)
- Each week should have a clear focus area and 3-5 specific tasks
- Include checkpoints that measure real progress (not just "study more")
- Add key milestones with concrete deliverables (projects, certifications, portfolio pieces)
- Be realistic about the hours allocated
- The expected outcome should be specific and achievable

IMPORTANT - For EACH week, include 2-3 learning resources with REAL, working URLs:
- Use real YouTube URLs from channels like: Traversy Media, freeCodeCamp, Fireship, Web Dev Simplified, The Coding Train, Programming with Mosh, Academind, Net Ninja
- Use course URLs from freeCodeCamp.org, Codecademy, Khan Academy
- Use documentation from MDN Web Docs, official docs sites
- NEVER leave a URL empty - always include a real, clickable link`,
    });

    return Response.json(object);
  } catch (error: any) {
    console.error("Simulation API Error:", error);
    return Response.json({ error: error.message || "Unknown error occurred" }, { status: 500 });
  }
}
