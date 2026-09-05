import dns from "dns";
import { URL } from "url";

const BLOCKED_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^localhost$/i,
  /^::1$/,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i,
];

function isPrivateIP(hostname: string): boolean {
  return BLOCKED_RANGES.some((pattern) => pattern.test(hostname));
}

export async function validateUrl(urlString: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const parsed = new URL(urlString);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" };
    }

    if (isPrivateIP(parsed.hostname)) {
      return { valid: false, error: "Private/loopback URLs are not allowed" };
    }

    const addresses = await dns.promises.resolve4(parsed.hostname);
    for (const addr of addresses) {
      if (isPrivateIP(addr)) {
        return {
          valid: false,
          error: "Resolved to a private/loopback address",
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid URL",
    };
  }
}

export async function safeFetch(
  urlString: string,
  options?: RequestInit
): Promise<Response> {
  const validation = await validateUrl(urlString);
  if (!validation.valid) {
    throw new Error(`SSRF guard: ${validation.error}`);
  }
  return fetch(urlString, options);
}
