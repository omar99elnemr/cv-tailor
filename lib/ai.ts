import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Create a Google Generative AI model instance.
 * Uses the provided API key or falls back to the server-side env var.
 */
export function getModel(apiKey?: string | null) {
  const key = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) {
    throw new Error("NO_API_KEY");
  }
  const google = createGoogleGenerativeAI({ apiKey: key });
  return google("gemini-2.0-flash");
}

/**
 * Extract the API key from request headers or env.
 */
export function getApiKey(req: Request): string | null {
  const userKey = req.headers.get("x-gemini-key");
  return userKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || null;
}
