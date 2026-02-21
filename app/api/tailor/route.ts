import { generateObject, generateText } from "ai";
import { getModel, getModelConfig } from "@/lib/ai";
import { TailoredResultSchema } from "@/lib/schemas";
import {
  RESUME_TAILOR_PROMPT,
  COVER_LETTER_PROMPT,
} from "@/lib/prompts";
import type { ResumeData } from "@/lib/schemas";

export const maxDuration = 120;

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
    const {
      resume,
      jobDescription,
      options = { coverLetter: true },
    } = body as {
      resume: ResumeData;
      jobDescription: string;
      options?: { coverLetter?: boolean };
    };

    if (!resume || !jobDescription) {
      return Response.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    const model = getModel(modelId, apiKey);

    // Build the tailoring prompt
    const tailorPrompt = RESUME_TAILOR_PROMPT.replace(
      "{resume}",
      JSON.stringify(resume, null, 2)
    ).replace("{jobDescription}", jobDescription);

    // Generate tailored resume + ATS score in one call
    const tailorSchema = TailoredResultSchema.omit({ coverLetter: true });

    const { object: tailoredData } = await generateObject({
      model,
      schema: tailorSchema,
      prompt: tailorPrompt,
      system: `CRITICAL: The contact object in your output MUST contain these EXACT values from the input resume — copy them character-for-character:\n${JSON.stringify(resume.contact, null, 2)}\n\nDo NOT modify, omit, or add commentary to any contact field. If a field is missing from the input, omit it from the output. NEVER write explanations, reasoning, or placeholder text as field values.`,
    });

    // Safety net: force original contact data through
    tailoredData.resume.contact = {
      ...tailoredData.resume.contact,
      ...Object.fromEntries(
        Object.entries(resume.contact).filter(([_, v]) => v !== undefined && v !== "")
      ),
    };

    // Generate cover letter if requested (separate call for better quality)
    let coverLetter: string | undefined;
    if (options.coverLetter) {
      const coverPrompt = COVER_LETTER_PROMPT.replace(
        "{resume}",
        JSON.stringify(tailoredData.resume, null, 2)
      ).replace("{jobDescription}", jobDescription);

      const { text } = await generateText({
        model,
        prompt: coverPrompt,
      });
      coverLetter = text;
    }

    return Response.json({
      resume: tailoredData.resume,
      atsScore: tailoredData.atsScore,
      coverLetter,
    });
  } catch (error) {
    console.error("Tailor error:", error);

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
      { error: "An unexpected error occurred while tailoring the resume." },
      { status: 500 }
    );
  }
}
