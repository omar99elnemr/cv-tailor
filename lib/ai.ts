import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

// ── Supported Providers & Models ──

export type AIProvider =
  | "google"
  | "openai"
  | "anthropic"
  | "openrouter"
  | "groq"
  | "deepseek";

export interface ModelOption {
  id: string;
  provider: AIProvider;
  label: string;
  modelId: string;
  description: string;
  pricing: string;
  keyEnvVar: string;
  keyPlaceholder: string;
  keyLink: string;
  keyLinkLabel: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  // ── Google (Free) ──
  {
    id: "gemini-2.0-flash",
    provider: "google",
    label: "Gemini 2.0 Flash",
    modelId: "gemini-2.0-flash",
    description: "Fast and capable. Great for most tasks.",
    pricing: "Free",
    keyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    keyPlaceholder: "AIza...",
    keyLink: "https://aistudio.google.com/apikey",
    keyLinkLabel: "Get free key from Google AI Studio",
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    label: "Gemini 2.5 Flash",
    modelId: "gemini-2.5-flash",
    description: "Latest & smartest Flash. Thinking model.",
    pricing: "Free",
    keyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    keyPlaceholder: "AIza...",
    keyLink: "https://aistudio.google.com/apikey",
    keyLinkLabel: "Get free key from Google AI Studio",
  },
  {
    id: "gemini-2.5-pro",
    provider: "google",
    label: "Gemini 2.5 Pro",
    modelId: "gemini-2.5-pro",
    description: "Most capable Gemini. Best quality output.",
    pricing: "Free (rate limited)",
    keyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    keyPlaceholder: "AIza...",
    keyLink: "https://aistudio.google.com/apikey",
    keyLinkLabel: "Get free key from Google AI Studio",
  },
  // ── Groq (Free) ──
  {
    id: "groq-llama-3.3-70b",
    provider: "groq",
    label: "Llama 3.3 70B (Groq)",
    modelId: "llama-3.3-70b-versatile",
    description: "Fast open-source model. Free tier.",
    pricing: "Free (rate limited)",
    keyEnvVar: "GROQ_API_KEY",
    keyPlaceholder: "gsk_...",
    keyLink: "https://console.groq.com/keys",
    keyLinkLabel: "Get free key from Groq Console",
  },
  {
    id: "groq-llama-4-scout",
    provider: "groq",
    label: "Llama 4 Scout (Groq)",
    modelId: "meta-llama/llama-4-scout-17b-16e-instruct",
    description: "Latest Meta model on Groq. Very fast.",
    pricing: "Free (rate limited)",
    keyEnvVar: "GROQ_API_KEY",
    keyPlaceholder: "gsk_...",
    keyLink: "https://console.groq.com/keys",
    keyLinkLabel: "Get free key from Groq Console",
  },
  // ── DeepSeek (Very Cheap) ──
  {
    id: "deepseek-chat",
    provider: "deepseek",
    label: "DeepSeek V3",
    modelId: "deepseek-chat",
    description: "Powerful reasoning model. Extremely cheap.",
    pricing: "~$0.001/resume",
    keyEnvVar: "DEEPSEEK_API_KEY",
    keyPlaceholder: "sk-...",
    keyLink: "https://platform.deepseek.com/api_keys",
    keyLinkLabel: "Get key from DeepSeek Platform",
  },
  // ── OpenRouter (Many Free Models) ──
  {
    id: "openrouter-free",
    provider: "openrouter",
    label: "Auto (OpenRouter Free)",
    modelId: "openrouter/auto",
    description: "Auto-routes to best free model available.",
    pricing: "Free",
    keyEnvVar: "OPENROUTER_API_KEY",
    keyPlaceholder: "sk-or-...",
    keyLink: "https://openrouter.ai/keys",
    keyLinkLabel: "Get key from OpenRouter",
  },
  {
    id: "openrouter-deepseek-r1-free",
    provider: "openrouter",
    label: "DeepSeek R1 (OpenRouter)",
    modelId: "deepseek/deepseek-r1:free",
    description: "DeepSeek R1 reasoning model, free via OpenRouter.",
    pricing: "Free",
    keyEnvVar: "OPENROUTER_API_KEY",
    keyPlaceholder: "sk-or-...",
    keyLink: "https://openrouter.ai/keys",
    keyLinkLabel: "Get key from OpenRouter",
  },
  // ── OpenAI (Cheap) ──
  {
    id: "gpt-4.1-mini",
    provider: "openai",
    label: "GPT-4.1 Mini",
    modelId: "gpt-4.1-mini",
    description: "Fast and affordable OpenAI model.",
    pricing: "~$0.003/resume",
    keyEnvVar: "OPENAI_API_KEY",
    keyPlaceholder: "sk-...",
    keyLink: "https://platform.openai.com/api-keys",
    keyLinkLabel: "Get key from OpenAI Platform",
  },
  {
    id: "gpt-4.1-nano",
    provider: "openai",
    label: "GPT-4.1 Nano",
    modelId: "gpt-4.1-nano",
    description: "Cheapest OpenAI model. Very fast.",
    pricing: "~$0.001/resume",
    keyEnvVar: "OPENAI_API_KEY",
    keyPlaceholder: "sk-...",
    keyLink: "https://platform.openai.com/api-keys",
    keyLinkLabel: "Get key from OpenAI Platform",
  },
  // ── Anthropic (Cheap) ──
  {
    id: "claude-haiku-3.5",
    provider: "anthropic",
    label: "Claude 3.5 Haiku",
    modelId: "claude-3-5-haiku-latest",
    description: "Fast, smart, great at structured output.",
    pricing: "~$0.004/resume",
    keyEnvVar: "ANTHROPIC_API_KEY",
    keyPlaceholder: "sk-ant-...",
    keyLink: "https://console.anthropic.com/settings/keys",
    keyLinkLabel: "Get key from Anthropic Console",
  },
];

/**
 * Get the default model option
 */
export function getDefaultModel(): ModelOption {
  return MODEL_OPTIONS[0]; // Gemini 2.0 Flash
}

/**
 * Find a model option by its ID
 */
export function getModelOption(modelId: string): ModelOption | undefined {
  return MODEL_OPTIONS.find((m) => m.id === modelId);
}

/**
 * Get unique providers from MODEL_OPTIONS for grouping
 */
export function getProviderGroups(): { provider: AIProvider; label: string; models: ModelOption[] }[] {
  const groups: Map<AIProvider, ModelOption[]> = new Map();
  for (const m of MODEL_OPTIONS) {
    if (!groups.has(m.provider)) groups.set(m.provider, []);
    groups.get(m.provider)!.push(m);
  }

  const providerLabels: Record<AIProvider, string> = {
    google: "Google (Free)",
    groq: "Groq (Free)",
    deepseek: "DeepSeek (Very Cheap)",
    openrouter: "OpenRouter (Free & Paid)",
    openai: "OpenAI (Paid)",
    anthropic: "Anthropic (Paid)",
  };

  return Array.from(groups.entries()).map(([provider, models]) => ({
    provider,
    label: providerLabels[provider],
    models,
  }));
}

/**
 * Create an AI model instance for the given model option and API key.
 */
export function getModel(modelOptionId: string, apiKey?: string | null): LanguageModel {
  const option = getModelOption(modelOptionId);
  if (!option) {
    throw new Error(`Unknown model: ${modelOptionId}`);
  }

  const key = apiKey || process.env[option.keyEnvVar];
  if (!key) {
    throw new Error("NO_API_KEY");
  }

  switch (option.provider) {
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey: key });
      return google(option.modelId);
    }
    case "openai": {
      const openai = createOpenAI({ apiKey: key });
      return openai(option.modelId);
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: key });
      return anthropic(option.modelId);
    }
    case "groq": {
      const groq = createOpenAI({
        apiKey: key,
        baseURL: "https://api.groq.com/openai/v1",
      });
      return groq(option.modelId);
    }
    case "deepseek": {
      const deepseek = createOpenAI({
        apiKey: key,
        baseURL: "https://api.deepseek.com",
      });
      return deepseek(option.modelId);
    }
    case "openrouter": {
      const openrouter = createOpenAI({
        apiKey: key,
        baseURL: "https://openrouter.ai/api/v1",
      });
      return openrouter(option.modelId);
    }
    default:
      throw new Error(`Unsupported provider: ${option.provider}`);
  }
}

/**
 * Extract model config from request headers.
 */
export function getModelConfig(req: Request): { modelId: string; apiKey: string | null } {
  const modelId = req.headers.get("x-model-id") || "gemini-2.0-flash";
  const apiKey = req.headers.get("x-api-key") || null;

  // Fallback to env var for the selected model
  const option = getModelOption(modelId);
  const envKey = option ? process.env[option.keyEnvVar] : process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  return {
    modelId,
    apiKey: apiKey || envKey || null,
  };
}
