"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Link as LinkIcon,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModelSettings } from "@/components/settings-dialog";

interface JobStepProps {
  onComplete: (jobText: string, options: { coverLetter: boolean }) => void;
  onBack: () => void;
  modelSettings: ModelSettings;
}

export function JobStep({ onComplete, onBack, modelSettings }: JobStepProps) {
  const [mode, setMode] = useState<"paste" | "url">("paste");
  const [jobText, setJobText] = useState("");
  const [url, setUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchedText, setFetchedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchUrl = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (modelSettings.modelId) headers["x-model-id"] = modelSettings.modelId;
      if (modelSettings.apiKey) headers["x-api-key"] = modelSettings.apiKey;

      const res = await fetch("/api/job", {
        method: "POST",
        headers,
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch job description");
      }

      setFetchedText(data.rawText);
      setJobText(data.rawText);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const text = mode === "paste" ? jobText.trim() : fetchedText || jobText.trim();
    if (!text) {
      setError("Please provide a job description.");
      return;
    }
    onComplete(text, { coverLetter });
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => {
            setMode("paste");
            setError(null);
          }}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            mode === "paste"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          Paste Description
        </button>
        <button
          onClick={() => {
            setMode("url");
            setError(null);
          }}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            mode === "url"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LinkIcon className="h-4 w-4" />
          Fetch from URL
        </button>
      </div>

      {/* Paste Mode */}
      {mode === "paste" && (
        <div className="space-y-2">
          <Label htmlFor="job-text">Job Description</Label>
          <Textarea
            id="job-text"
            placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
            value={jobText}
            onChange={(e) => {
              setJobText(e.target.value);
              setError(null);
            }}
            className="min-h-[250px] text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Include the full job posting for best results — title,
            responsibilities, requirements, and preferred qualifications.
          </p>
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-url">Job Posting URL</Label>
            <div className="flex gap-2">
              <Input
                id="job-url"
                type="url"
                placeholder="https://company.com/careers/job-posting"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                className="flex-1"
              />
              <Button
                onClick={handleFetchUrl}
                disabled={loading || !url.trim()}
                variant="outline"
                className="gap-2 shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
                Fetch
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Works with most job boards. LinkedIn may require you to paste the
              text directly.
            </p>
          </div>

          {fetchedText && (
            <Card className="p-4 max-h-[250px] overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Extracted job description:
              </p>
              <p className="text-sm whitespace-pre-wrap">{fetchedText}</p>
            </Card>
          )}
        </div>
      )}

      {/* Options */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label
              htmlFor="cover-letter"
              className="text-sm font-medium cursor-pointer"
            >
              Generate Cover Letter
            </Label>
            <p className="text-xs text-muted-foreground">
              Create a tailored cover letter alongside your resume
            </p>
          </div>
          <Switch
            id="cover-letter"
            checked={coverLetter}
            onCheckedChange={setCoverLetter}
          />
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            mode === "paste" ? !jobText.trim() : !fetchedText
          }
          size="lg"
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Tailor My Resume
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
