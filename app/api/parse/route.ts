import { generateObject } from "ai";
import { getModel, getModelConfig } from "@/lib/ai";
import { extractText } from "@/lib/parse-resume";
import { ResumeDataSchema } from "@/lib/schemas";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pastedText = formData.get("text") as string | null;

    let rawText: string;

    if (file) {
      // Extract text from uploaded file
      const buffer = Buffer.from(await file.arrayBuffer());
      rawText = await extractText(buffer, file.name);
    } else if (pastedText && pastedText.trim().length > 0) {
      rawText = pastedText.trim();
    } else {
      return Response.json(
        { error: "Please upload a file or paste your resume text." },
        { status: 400 }
      );
    }

    if (rawText.trim().length < 50) {
      return Response.json(
        {
          error:
            "Could not extract enough text from the file. Please try a different format or paste your resume text directly.",
        },
        { status: 400 }
      );
    }

    // Use Gemini to structure the raw text into our schema
    const model = getModel(modelId, apiKey);
    const { object: resume } = await generateObject({
      model,
      schema: ResumeDataSchema,
      prompt: `${RESUME_PARSE_PROMPT}\n\n--- RESUME TEXT ---\n${rawText}`,
      system: "You are a data extractor. Output ONLY real data from the resume. For optional fields that don't exist in the resume, omit them entirely. NEVER write explanations, reasoning, examples, or commentary as field values. Every field value must be actual data extracted from the resume text.",
    });

    // Sanitize contact fields: remove any AI-generated commentary that leaked into values
    if (resume.contact) {
      const suspiciousPatterns = /example|omit|Based on|instruction|empty string|if you have|field|schema|reasoning|Do NOT|placeholder|not provided|not present|not required|not included|none provided|removed by|per instructions|this field|this comment|JSON output|compliance|adherence/i;
      for (const key of ["website", "linkedin", "github", "location", "phone", "email"] as const) {
        const val = resume.contact[key];
        if (val && (suspiciousPatterns.test(val) || val.length > 100)) {
          resume.contact[key] = undefined;
        }
      }
    }

    return Response.json({ resume, rawText });
  } catch (error) {
    console.error("Parse error:", error);

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
      { error: "An unexpected error occurred while parsing the resume." },
      { status: 500 }
    );
  }
}
