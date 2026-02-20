"use client";

import { useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { ProfessionalTemplate } from "@/components/pdf-templates/professional";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { ResumeData } from "@/lib/schemas";

interface PDFDownloadProps {
  data: ResumeData;
  fileName?: string;
}

export function PDFDownloadButton({ data, fileName = "tailored-resume.pdf" }: PDFDownloadProps) {
  const [generating, setGenerating] = useState(false);

  return (
    <BlobProvider document={<ProfessionalTemplate data={data} />}>
      {({ blob, loading, error }) => {
        if (error) {
          return (
            <Button variant="outline" disabled>
              PDF Error
            </Button>
          );
        }

        return (
          <Button
            onClick={() => {
              if (blob) {
                setGenerating(true);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setTimeout(() => setGenerating(false), 1000);
              }
            }}
            disabled={loading || generating}
            className="gap-2"
          >
            {loading || generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {loading ? "Generating PDF..." : "Downloading..."}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        );
      }}
    </BlobProvider>
  );
}
