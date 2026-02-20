import { generateObject } from "ai";
import { getModel, getApiKey } from "@/lib/ai";
import { extractText } from "@/lib/parse-resume";
import { ResumeDataSchema } from "@/lib/schemas";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const apiKey = getApiKey(req);
    if (!apiKey) {
      return Response.json(
        {
          error:
            "No API key configured. Add your Gemini API key in Settings or set GOOGLE_GENERATIVE_AI_API_KEY on the server.",
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
    const model = getModel(apiKey);
    const { object: resume } = await generateObject({
      model,
      schema: ResumeDataSchema,
      prompt: `${RESUME_PARSE_PROMPT}\n\n--- RESUME TEXT ---\n${rawText}`,
    });

    return Response.json({ resume, rawText });
  } catch (error) {
    console.error("Parse error:", error);

    if (error instanceof Error) {
      if (error.message === "NO_API_KEY") {
        return Response.json(
          {
            error:
              "No API key configured. Add your Gemini API key in Settings.",
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
