"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import type { ATSScore } from "@/lib/schemas";

export function ATSScoreCard({ score }: { score: ATSScore }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-400";
    if (s >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent Match";
    if (s >= 60) return "Good Match";
    if (s >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  const getProgressColor = (s: number) => {
    if (s >= 80) return "[&>div]:bg-green-500";
    if (s >= 60) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Score Header */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
            {score.score}%
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            ATS Score
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{getScoreLabel(score.score)}</span>
            <Tooltip>
              <TooltipTrigger>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  This score estimates how well your tailored resume matches the
                  job description keywords. 70%+ is typically needed to pass ATS
                  screening.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Progress
            value={score.score}
            className={`h-2 ${getProgressColor(score.score)}`}
          />
        </div>
      </div>

      {/* Matched Keywords */}
      {score.matchedKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Matched Keywords ({score.matchedKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {score.matchedKeywords.map((kw, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {score.missingKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Missing Keywords ({score.missingKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {score.missingKeywords.map((kw, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <span>Suggestions</span>
          </div>
          <ul className="space-y-1.5">
            {score.suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground flex gap-2"
              >
                <span className="text-blue-500 shrink-0">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
