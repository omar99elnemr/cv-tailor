import mammoth from "mammoth";

/**
 * Extract text content from a PDF buffer.
 * Tries pdf-parse v2 (class API) then v1 (function API).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfModule: any = await import("pdf-parse");

    // pdf-parse v1: default export is a function
    const pdf = pdfModule.default || pdfModule;
    if (typeof pdf === "function") {
      const result = await pdf(buffer);
      return result.text || "";
    }

    // pdf-parse v2: named export PDFParse class
    if (pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text || "";
    }

    throw new Error("Incompatible pdf-parse version");
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
