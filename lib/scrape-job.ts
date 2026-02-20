import * as cheerio from "cheerio";

/**
 * Fetch a job posting URL and extract the job description text.
 * Works for many job boards that render content server-side.
 * Falls back gracefully if the URL can't be fetched or parsed.
 */
export async function scrapeJobDescription(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $(
      "script, style, nav, footer, header, aside, iframe, noscript, .cookie-banner, .nav, .footer, .header"
    ).remove();

    // Try common job description selectors (most specific first)
    const selectors = [
      // Common job board selectors
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '[class*="job_description"]',
      '[id*="job-description"]',
      '[id*="jobDescription"]',
      '[class*="posting-description"]',
      '[class*="description__text"]',
      // Greenhouse
      "#content",
      ".content",
      // Lever
      '[class*="posting-"]',
      // Workday
      '[data-automation-id="jobPostingDescription"]',
      // Generic
      '[class*="description"]',
      '[role="main"]',
      "article",
      "main",
    ];

    for (const selector of selectors) {
      const el = $(selector);
      if (el.length > 0) {
        const text = el.first().text().trim();
        // Only use if it has substantial content (>100 chars)
        if (text.length > 100) {
          return cleanText(text);
        }
      }
    }

    // Fallback: get all body text
    const bodyText = $("body").text().trim();
    if (bodyText.length > 100) {
      return cleanText(bodyText);
    }

    throw new Error("Could not extract job description from this URL");
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError" || error.name === "TimeoutError") {
        throw new Error(
          "Request timed out. The website may be blocking automated access. Please paste the job description manually."
        );
      }
      throw new Error(
        `Could not fetch job description: ${error.message}. Please paste the job description manually.`
      );
    }
    throw new Error(
      "Failed to fetch job description. Please paste the job description manually."
    );
  }
}

/**
 * Clean extracted text: normalize whitespace, remove excessive blank lines
 */
function cleanText(text: string): string {
  return text
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();
}
