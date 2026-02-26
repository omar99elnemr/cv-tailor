"use client";

import { useState } from "react";
import { Stepper } from "@/components/stepper";
import { UploadStep } from "@/components/upload-step";
import { JobStep } from "@/components/job-step";
import { ResultsStep } from "@/components/results-step";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog, useModelSettings } from "@/components/settings-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { FileText } from "lucide-react";
import type { ResumeData } from "@/lib/schemas";

const STEPS = [
  { label: "Upload Resume" },
  { label: "Job Description" },
  { label: "Results" },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [rawResumeText, setRawResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [tailorOptions, setTailorOptions] = useState({ coverLetter: true });
  const { settings, saveSettings, currentModel } = useModelSettings();

  const handleResumeComplete = (resumeData: ResumeData, rawText: string) => {
    setResume(resumeData);
    setRawResumeText(rawText);
    setCurrentStep(1);
  };

  const handleJobComplete = (
    jobText: string,
    options: { coverLetter: boolean }
  ) => {
    setJobDescription(jobText);
    setTailorOptions(options);
    setCurrentStep(2);
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setResume(null);
    setRawResumeText("");
    setJobDescription("");
    setTailorOptions({ coverLetter: true });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                CV Tailor
              </span>
            </div>
            <div className="flex items-center gap-1">
              <SettingsDialog settings={settings} onSave={saveSettings} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container max-w-4xl mx-auto px-4 py-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              AI-Powered Resume Tailoring
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Upload your resume, provide a job description, and get an
              ATS-optimized version that maximizes your chances of landing an
              interview.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8 max-w-md mx-auto">
            <Stepper currentStep={currentStep} steps={STEPS} />
          </div>

          {/* Step Content */}
          <div className="max-w-3xl mx-auto">
            {currentStep === 0 && (
              <UploadStep
                onComplete={handleResumeComplete}
                modelSettings={settings}
              />
            )}

            {currentStep === 1 && (
              <JobStep
                onComplete={handleJobComplete}
                onBack={() => setCurrentStep(0)}
                modelSettings={settings}
              />
            )}

            {currentStep === 2 && resume && (
              <ResultsStep
                resume={resume}
                jobDescription={jobDescription}
                rawText={rawResumeText}
                options={tailorOptions}
                modelSettings={settings}
                onStartOver={handleStartOver}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              Built with AI to help you land your dream job.{" "}
              <span className="text-foreground">Free &amp; open source.</span>
            </p>
            <p className="mt-1 text-xs">
              Your data is processed in real-time and never stored on our
              servers.
            </p>
          </div>
        </footer>
      </div>

      <Toaster />
    </TooltipProvider>
  );
}
