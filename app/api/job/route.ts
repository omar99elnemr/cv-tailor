import { generateObject } from "ai";
import { getModel, getModelConfig } from "@/lib/ai";
import { JobDetailsSchema } from "@/lib/schemas";
import { JOB_ANALYSIS_PROMPT } from "@/lib/prompts";
import { scrapeJobDescription } from "@/lib/scrape-job";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { modelId, apiKey } = getModelConfig(req);
    if (!apiKey) {
      return Response.json(
        {
          error:
            "No API key configured. Add your API key in Settings.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { text, url } = body as { text?: string; url?: string };

    let jobText: string;

    if (url && url.trim().length > 0) {
      // Fetch job description from URL
      jobText = await scrapeJobDescription(url.trim());
    } else if (text && text.trim().length > 0) {
      jobText = text.trim();
    } else {
      return Response.json(
        { error: "Please provide a job description or URL." },
        { status: 400 }
      );
    }

    if (jobText.length < 30) {
      return Response.json(
        {
          error:
            "The job description seems too short. Please provide more detail.",
        },
        { status: 400 }
      );
    }

    // Use Gemini to extract structured job details
    const model = getModel(modelId, apiKey);
    const { object: jobDetails } = await generateObject({
      model,
      schema: JobDetailsSchema,
      prompt: `${JOB_ANALYSIS_PROMPT}\n\n--- JOB POSTING ---\n${jobText}`,
    });

    return Response.json({ jobDetails, rawText: jobText });
  } catch (error) {
    console.error("Job analysis error:", error);

    if (error instanceof Error) {
      if (error.message === "NO_API_KEY") {
        return Response.json(
          {
            error:
              "No API key configured. Add your API key in Settings.",
          },
          { status: 401 }
        );
      }
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      { error: "An unexpected error occurred while analyzing the job posting." },
      { status: 500 }
    );
  }
}
