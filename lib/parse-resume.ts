import mammoth from "mammoth";
import { extractText as extractPdfText } from "unpdf";

/**
 * Extract text content from a PDF buffer using unpdf (serverless-compatible).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const { text } = await extractPdfText(new Uint8Array(buffer));
    return Array.isArray(text) ? text.join("\n") : text || "";
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(
      "Failed to extract text from PDF. Please try a DOCX file or paste your resume text directly."
    );
  }
}

/**
 * Extract text content from a DOCX buffer.
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
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
