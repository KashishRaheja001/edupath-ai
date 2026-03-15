import { z } from "zod";

export const LearningPathSchema = z.object({
  goalTitle: z.string().describe("The career goal title"),
  estimatedWeeks: z.number().describe("Total estimated weeks"),
  phases: z.array(
    z.object({
      name: z.string().describe("Phase name like 'Foundation' or 'Advanced'"),
      weekRange: z.string().describe("e.g. 'Week 1-3'"),
      skills: z.array(
        z.object({
          name: z.string(),
          category: z.string(),
          difficulty: z.enum(["beginner", "intermediate", "advanced"]),
          description: z.string(),
          prerequisites: z.array(z.string()),
          suggestedResources: z.array(
            z.object({
              title: z.string().describe("Name of the resource"),
              type: z.enum(["video", "article", "course", "project"]),
              url: z.string().describe("Full URL to the resource, YouTube links preferred for videos"),
            })
          ),
        })
      ),
      milestone: z.string().describe("A tangible project or deliverable"),
    })
  ),
});

export const CareerSimulationSchema = z.object({
  targetRole: z.string(),
  totalWeeks: z.number(),
  weeklyPlan: z.array(
    z.object({
      week: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
      hoursPerDay: z.number(),
      checkpoint: z.string(),
      resources: z.array(
        z.object({
          title: z.string().describe("Name of the learning resource"),
          url: z.string().describe("Full URL, preferably YouTube video or playlist link"),
          type: z.enum(["video", "article", "course", "documentation"]),
        })
      ),
    })
  ),
  keyMilestones: z.array(
    z.object({
      week: z.number(),
      milestone: z.string(),
      deliverable: z.string(),
    })
  ),
  expectedOutcome: z.string(),
});

export type LearningPath = z.infer<typeof LearningPathSchema>;
export type CareerSimulation = z.infer<typeof CareerSimulationSchema>;
