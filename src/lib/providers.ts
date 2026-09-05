import { decrypt } from "./crypto";
import { db } from "./db";
import { safeFetch } from "./ssrf";

export type AIProvider =
  | "openrouter"
  | "openai"
  | "anthropic"
  | "ollama"
  | "litellm"
  | "custom";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  content: string;
  model: string;
}

const PROVIDER_BASE_URLS: Record<string, string> = {
  openrouter: "https://openrouter.ai/api/v1",
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  ollama: "http://localhost:11434/v1",
  litellm: "http://localhost:4000/v1",
};

export async function chatCompletion(
  userId: string,
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const settings = await db.userSettings.findUnique({
    where: { userId },
  });

  if (!settings?.aiProvider || !settings?.aiApiKeyEncrypted) {
    throw new Error("AI provider not configured");
  }

  const apiKey = decrypt(settings.aiApiKeyEncrypted);
  const baseUrl =
    settings.aiBaseUrl ||
    PROVIDER_BASE_URLS[settings.aiProvider] ||
    PROVIDER_BASE_URLS.openai;
  const model =
    (settings.aiDefaultModel as string) ||
    ((settings.aiModels as string[])?.[0] as string) ||
    "gpt-4o-mini";

  const res = await safeFetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`AI provider error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return {
    content: data.choices[0]?.message?.content ?? "",
    model: data.model ?? model,
  };
}

export async function getCatalogContext(userId: string): Promise<string> {
  const resources = await db.resource.findMany({
    where: { userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    take: 500,
    orderBy: { updatedAt: "desc" },
  });

  if (resources.length === 0) {
    return "The user's catalog is empty.";
  }

  const catalog = resources.map((r) => ({
    title: r.title,
    url: r.url,
    description: r.description,
    category: r.category?.name ?? "Uncategorized",
    tags: r.tags.map((t) => t.tag.name),
    status: r.status,
  }));

  return `The user has ${resources.length} resources in their catalog:\n${JSON.stringify(catalog, null, 2)}`;
}
