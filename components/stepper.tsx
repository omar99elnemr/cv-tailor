"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-background text-primary shadow-md shadow-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "border-muted-foreground/30 bg-background text-muted-foreground/50"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-[100px] transition-colors",
                    isCurrent && "text-foreground",
                    isCompleted && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 mb-6">
                  <div
                    className={cn(
                      "h-0.5 rounded-full transition-all duration-500",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
