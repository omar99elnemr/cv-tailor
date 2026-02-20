"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Upload,
  FileText,
  X,
  Loader2,
  ClipboardPaste,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResumeData } from "@/lib/schemas";
import type { ModelSettings } from "@/components/settings-dialog";

interface UploadStepProps {
  onComplete: (resume: ResumeData, rawText: string) => void;
  modelSettings: ModelSettings;
}

export function UploadStep({ onComplete, modelSettings }: UploadStepProps) {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 4 * 1024 * 1024,
    maxFiles: 1,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message || "File rejected";
      if (msg.includes("larger")) {
        setError("File is too large. Maximum size is 4 MB.");
      } else {
        setError("Please upload a PDF or DOCX file (max 4 MB).");
      }
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (mode === "upload" && file) {
        formData.append("file", file);
      } else if (mode === "paste" && pastedText.trim()) {
        formData.append("text", pastedText.trim());
      } else {
        setError(
          mode === "upload"
            ? "Please upload a file first."
            : "Please paste your resume text."
        );
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = {};
      if (modelSettings.modelId) headers["x-model-id"] = modelSettings.modelId;
      if (modelSettings.apiKey) headers["x-api-key"] = modelSettings.apiKey;

      const res = await fetch("/api/parse", {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse resume");
      }

      onComplete(data.resume, data.rawText);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setMode("upload")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            mode === "upload"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
        <button
          onClick={() => setMode("paste")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            mode === "paste"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ClipboardPaste className="h-4 w-4" />
          Paste Text
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          {!file ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {isDragActive
                      ? "Drop your resume here..."
                      : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF or DOCX, max 4 MB
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Paste Mode */}
      {mode === "paste" && (
        <div className="space-y-2">
          <Label htmlFor="resume-text">Resume Text</Label>
          <Textarea
            id="resume-text"
            placeholder="Paste your full resume text here..."
            value={pastedText}
            onChange={(e) => {
              setPastedText(e.target.value);
              setError(null);
            }}
            className="min-h-[250px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Paste the full text of your resume. Our AI will structure it
            automatically.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={
            loading ||
            (mode === "upload" && !file) ||
            (mode === "paste" && !pastedText.trim())
          }
          size="lg"
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
