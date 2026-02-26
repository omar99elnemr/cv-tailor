import { generateObject } from "ai";
import { getModel, getModelConfig } from "@/lib/ai";
import { extractText } from "@/lib/parse-resume";
import { ResumeDataSchema } from "@/lib/schemas";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";
import type { ResumeData } from "@/lib/schemas";

export const maxDuration = 60;

const SUSPICIOUS_PATTERNS =
  /example|omit|Based on|instruction|empty string|if you have|field|schema|reasoning|Do NOT|placeholder|not provided|not present|not required|not included|none provided|removed by|per instructions|this field|this comment|JSON output|compliance|adherence|cannot be determined|not mentioned|not specified|not found|no .* provided|hallucin/i;

const MAX_CONTACT_FIELD_LENGTH = 200;

/**
 * Validate parsed resume data against hallucination patterns.
 * Logs warnings for suspicious fields and removes items that match
 * hallucination patterns.
 */
function validateResumeData(resume: ResumeData, rawText: string): void {
  const lowerRaw = rawText.toLowerCase();

  // Warn about experience companies not found in raw text
  for (const exp of resume.experience) {
    if (
      exp.company &&
      !lowerRaw.includes(exp.company.toLowerCase()) &&
      exp.company.length > 2
    ) {
      console.warn(
        `[validate] Company not found in raw text: "${exp.company}"`
      );
    }
  }

  // Filter skills that match hallucination patterns
  resume.skills = resume.skills
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (SUSPICIOUS_PATTERNS.test(item)) {
          console.warn(`[validate] Removing suspicious skill: "${item}"`);
          return false;
        }
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  // Filter experience bullets that match hallucination patterns
  resume.experience = resume.experience.map((exp) => ({
    ...exp,
    bullets: exp.bullets.filter((bullet) => {
      if (SUSPICIOUS_PATTERNS.test(bullet)) {
        console.warn(`[validate] Removing suspicious bullet: "${bullet}"`);
        return false;
      }
      return true;
    }),
  }));

  // Filter project descriptions that match hallucination patterns
  if (resume.projects) {
    resume.projects = resume.projects.filter((project) => {
      if (SUSPICIOUS_PATTERNS.test(project.description)) {
        console.warn(
          `[validate] Removing suspicious project: "${project.name}"`
        );
        return false;
      }
      return true;
    });
  }
}

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
      for (const key of ["website", "linkedin", "github", "location", "phone", "email"] as const) {
        const val = resume.contact[key];
        if (val && (SUSPICIOUS_PATTERNS.test(val) || val.length > MAX_CONTACT_FIELD_LENGTH)) {
          resume.contact[key] = undefined;
        }
      }
    }

    // Validate all fields against hallucination patterns
    validateResumeData(resume, rawText);

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
