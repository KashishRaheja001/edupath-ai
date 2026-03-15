import { streamText } from "ai";
import { gemini } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages, userSkills, careerGoal } = await req.json();

  const skillsContext = userSkills?.length
    ? `The user's current skills: ${userSkills.join(", ")}.`
    : "The user hasn't specified their skills yet.";

  const goalContext = careerGoal
    ? `Their career goal: ${careerGoal}.`
    : "They haven't specified a career goal yet.";

  try {
    const result = streamText({
      model: gemini,
      system: `You are EduPath Mentor — a friendly, knowledgeable AI career advisor for students and aspiring professionals.

${skillsContext}
${goalContext}

Your role:
- Give specific, actionable career and learning advice
- Suggest real projects they can build to strengthen their portfolio
- Recommend free learning resources (YouTube channels, documentation, courses)
- When recommending YouTube content, include real YouTube video/channel links when possible
- Help them understand which skills connect to which career roles
- Be encouraging but honest about the effort required
- Keep responses concise and scannable (use bullet points, bold key terms)

Always relate advice back to the user's specific skills and goals.`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to start chat stream" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
