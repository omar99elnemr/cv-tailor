import mammoth from "mammoth";
import { extractText as extractPdfText } from "unpdf";

/**
 * Extract hyperlinks from a DOCX buffer by converting to HTML and parsing anchor tags.
 */
async function extractLinksFromDOCX(buffer: Buffer): Promise<string[]> {
  try {
    const result = await mammoth.convertToHtml({ buffer });
    const links: string[] = [];
    const hrefRegex = /href="([^"]+)"/gi;
    let match;
    while ((match = hrefRegex.exec(result.value)) !== null) {
      const url = match[1];
      if (url && !url.startsWith("#")) {
        links.push(url);
      }
    }
    return [...new Set(links)];
  } catch {
    return [];
  }
}

/**
 * Normalize extracted text: clean garbage characters, collapse excessive
 * whitespace, and append a hyperlinks section when links are present.
 */
function normalizeExtractedText(text: string, links: string[]): string {
  const normalized = text
    // Remove null bytes and non-printable control characters (keep \n and \t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize Windows/old Mac line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Collapse 3+ consecutive blank lines into two
    .replace(/\n{3,}/g, "\n\n")
    // Collapse multiple spaces/tabs on a single line into one space
    .replace(/[ \t]{2,}/g, " ")
    // Trim each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

  if (links.length === 0) return normalized;

  return (
    normalized +
    "\n\n--- HYPERLINKS FOUND IN DOCUMENT ---\n" +
    links.join("\n")
  );
}

/**
 * Extract text content from a PDF buffer using unpdf (serverless-compatible).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const { text } = await extractPdfText(new Uint8Array(buffer));
    const rawText = Array.isArray(text) ? text.join("\n") : text || "";
    return normalizeExtractedText(rawText, []);
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(
      "Failed to extract text from PDF. Please try a DOCX file or paste your resume text directly."
    );
  }
}

/**
 * Extract text content from a DOCX buffer, including hyperlinks.
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const [rawResult, links] = await Promise.all([
      mammoth.extractRawText({ buffer }),
      extractLinksFromDOCX(buffer),
    ]);
    return normalizeExtractedText(rawResult.value || "", links);
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error(
      "Failed to extract text from DOCX. Please try a PDF file or paste your resume text directly."
    );
  }
}

/**
 * Extract text from a file based on its extension.
 */
export async function extractText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop();

  switch (ext) {
    case "pdf":
      return extractTextFromPDF(buffer);
    case "docx":
      return extractTextFromDOCX(buffer);
    case "doc":
      throw new Error(
        "Legacy .doc format is not supported. Please convert to .docx or .pdf first."
      );
    default:
      throw new Error(
        `Unsupported file format: .${ext}. Please upload a PDF or DOCX file.`
      );
  }
}
