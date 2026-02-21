import mammoth from "mammoth";

/**
 * Extract text content from a PDF buffer using pdfjs-dist directly.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Use pdfjs-dist legacy build directly – avoids pdf-parse wrapper issues
    // with Next.js bundling (worker threads, canvas resolution, etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const data = new Uint8Array(buffer);
    const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => "str" in item)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str)
        .join(" ");
      textParts.push(pageText);
    }

    await doc.destroy();
    return textParts.join("\n");
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
