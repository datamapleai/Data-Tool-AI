import { safeFetch } from "./ssrf";

interface PreviewResult {
  title: string | null;
  description: string | null;
  favicon: string | null;
  image: string | null;
}

async function fetchGitHubMetadata(
  url: string
): Promise<PreviewResult | null> {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  try {
    const apiUrl = `https://api.github.com/repos/${match[1]}/${match[2]}`;
    const res = await safeFetch(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      title: data.full_name,
      description: data.description,
      favicon: data.owner?.avatar_url ?? null,
      image: null,
    };
  } catch {
    return null;
  }
}

function extractMeta(html: string, baseUrl: string): PreviewResult {
  const getMeta = (name: string): string | null => {
    const patterns = [
      new RegExp(`<meta[^>]*property="${name}"[^>]*content="([^"]*)"`, "i"),
      new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`, "i"),
      new RegExp(`<meta[^>]*content="([^"]*)"[^>]*property="${name}"`, "i"),
      new RegExp(`<meta[^>]*content="([^"]*)"[^>]*name="${name}"`, "i"),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const title =
    getMeta("og:title") ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? null;

  const description =
    getMeta("og:description") ?? getMeta("description") ?? null;

  const image = getMeta("og:image") ?? null;

  let favicon = html.match(
    /<link[^>]*rel="icon"[^>]*href="([^"]*)"/i
  )?.[1] ?? null;
  if (!favicon) {
    favicon = html.match(
      /<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"/i
    )?.[1] ?? null;
  }
  if (favicon && !favicon.startsWith("http")) {
    try {
      favicon = new URL(favicon, baseUrl).href;
    } catch {
      favicon = null;
    }
  }

  return { title, description, favicon, image };
}

export async function previewUrl(url: string): Promise<PreviewResult> {
  // Try specialized APIs first
  if (url.includes("github.com")) {
    const githubResult = await fetchGitHubMetadata(url);
    if (githubResult) return githubResult;
  }

  // Generic fallback: fetch HTML and extract meta tags
  try {
    const res = await safeFetch(url, {
      headers: {
        "User-Agent": "DataToolAI/1.0 (bookmark-preview)",
      },
    });
    if (!res.ok) return { title: null, description: null, favicon: null, image: null };

    const html = await res.text();
    return extractMeta(html, url);
  } catch {
    return { title: null, description: null, favicon: null, image: null };
  }
}
