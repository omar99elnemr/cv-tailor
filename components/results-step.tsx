"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumePreview } from "@/components/resume-preview";
import { CoverLetterPreview } from "@/components/cover-letter-preview";
import { ATSScoreCard } from "@/components/ats-score";
import {
  Loader2,
  RotateCcw,
  FileText,
  Mail,
  BarChart3,
  Copy,
  Check,
} from "lucide-react";
import type { ResumeData, ATSScore } from "@/lib/schemas";

// Dynamic import for PDF download (heavy, client-only)
const PDFDownloadButton = dynamic(
  () =>
    import("@/components/pdf-download").then((mod) => mod.PDFDownloadButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading PDF...
      </Button>
    ),
  }
);

interface ResultsStepProps {
  resume: ResumeData;
  jobDescription: string;
  options: { coverLetter: boolean };
  apiKey: string;
  onStartOver: () => void;
}

export function ResultsStep({
  resume,
  jobDescription,
  options,
  apiKey,
  onStartOver,
}: ResultsStepProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tailoredResume, setTailoredResume] = useState<ResumeData | null>(null);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your resume...");
  const [copied, setCopied] = useState(false);

  const tailorResume = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Rotate loading messages
    const messages = [
      "Analyzing your resume...",
      "Matching keywords with job requirements...",
      "Optimizing for ATS screening...",
      "Tailoring experience bullets...",
      "Crafting your professional summary...",
      "Generating cover letter...",
      "Almost there...",
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, messages.length - 1);
      setLoadingMessage(messages[msgIdx]);
    }, 4000);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) headers["x-gemini-key"] = apiKey;

      const res = await fetch("/api/tailor", {
        method: "POST",
        headers,
        body: JSON.stringify({
          resume,
          jobDescription,
          options: { coverLetter: options.coverLetter },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to tailor resume");
      }

      setTailoredResume(data.resume);
      setAtsScore(data.atsScore);
      if (data.coverLetter) setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [resume, jobDescription, options, apiKey]);

  useEffect(() => {
    tailorResume();
  }, [tailorResume]);

  const handleCopyCoverLetter = async () => {
    if (coverLetter) {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <p className="font-medium text-lg">{loadingMessage}</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take 30-60 seconds. Our AI is carefully optimizing your
            resume for maximum impact.
          </p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive max-w-md mx-auto">
          <p className="font-medium">Tailoring Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onStartOver} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
          <Button onClick={tailorResume} className="gap-2">
            <Loader2 className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!tailoredResume) return null;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="outline" onClick={onStartOver} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
        <PDFDownloadButton
          data={tailoredResume}
          fileName={`${tailoredResume.contact.fullName.replace(/\s+/g, "-")}-tailored-resume.pdf`}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resume" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cover Letter</span>
          </TabsTrigger>
          <TabsTrigger value="ats-score" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ATS Score</span>
          </TabsTrigger>
        </TabsList>

        {/* Resume Tab */}
        <TabsContent value="resume" className="mt-4">
          <Card className="p-6 md:p-8">
            <ResumePreview data={tailoredResume} />
          </Card>
        </TabsContent>

        {/* Cover Letter Tab */}
        <TabsContent value="cover-letter" className="mt-4">
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Cover Letter</h3>
              {coverLetter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCoverLetter}
                  className="gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <CoverLetterPreview text={coverLetter || ""} />
          </Card>
        </TabsContent>

        {/* ATS Score Tab */}
        <TabsContent value="ats-score" className="mt-4">
          <Card className="p-6 md:p-8">
            {atsScore ? (
              <ATSScoreCard score={atsScore} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                ATS score data is not available.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
