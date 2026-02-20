"use client";

import { useState, useEffect } from "react";
import { Settings, ExternalLink, Trash2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MODEL_OPTIONS,
  getDefaultModel,
  getModelOption,
  getProviderGroups,
} from "@/lib/ai";
import type { ModelOption } from "@/lib/ai";

const STORAGE_KEY_PREFIX = "cv-tailor-key-";
const MODEL_STORAGE_KEY = "cv-tailor-model";

export interface ModelSettings {
  modelId: string;
  apiKey: string;
}

export function useModelSettings(): {
  settings: ModelSettings;
  saveSettings: (settings: ModelSettings) => void;
  currentModel: ModelOption;
} {
  const [settings, setSettings] = useState<ModelSettings>({
    modelId: getDefaultModel().id,
    apiKey: "",
  });

  useEffect(() => {
    const storedModelId = localStorage.getItem(MODEL_STORAGE_KEY);
    const modelId = storedModelId || getDefaultModel().id;
    const option = getModelOption(modelId) || getDefaultModel();
    const storedKey = localStorage.getItem(STORAGE_KEY_PREFIX + option.provider) || "";
    setSettings({ modelId: option.id, apiKey: storedKey });
  }, []);

  const saveSettings = (newSettings: ModelSettings) => {
    const option = getModelOption(newSettings.modelId) || getDefaultModel();
    setSettings(newSettings);
    localStorage.setItem(MODEL_STORAGE_KEY, newSettings.modelId);
    if (newSettings.apiKey) {
      localStorage.setItem(STORAGE_KEY_PREFIX + option.provider, newSettings.apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + option.provider);
    }
  };

  const currentModel = getModelOption(settings.modelId) || getDefaultModel();

  return { settings, saveSettings, currentModel };
}

interface SettingsDialogProps {
  settings: ModelSettings;
  onSave: (settings: ModelSettings) => void;
}

export function SettingsDialog({ settings, onSave }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(settings.modelId);
  const [apiKey, setApiKey] = useState(settings.apiKey);

  const selectedModel = getModelOption(selectedModelId) || getDefaultModel();
  const providerGroups = getProviderGroups();
  const hasKey = settings.apiKey.length > 0;

  // When switching models, load the stored key for that provider
  useEffect(() => {
    if (open) {
      setSelectedModelId(settings.modelId);
      setApiKey(settings.apiKey);
    }
  }, [open, settings]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    const option = getModelOption(modelId);
    if (option) {
      const storedKey = localStorage.getItem(STORAGE_KEY_PREFIX + option.provider) || "";
      setApiKey(storedKey);
    }
  };

  const handleSave = () => {
    onSave({ modelId: selectedModelId, apiKey: apiKey.trim() });
    setOpen(false);
  };

  const handleClear = () => {
    setApiKey("");
    onSave({ modelId: selectedModelId, apiKey: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Settings className="h-4 w-4" />
              {hasKey && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
              )}
              <span className="sr-only">Settings</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings & API Key</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Model &amp; API Key
          </DialogTitle>
          <DialogDescription>
            Choose your AI model and add the corresponding API key. Keys are
            stored locally in your browser only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Model</Label>
            <div className="space-y-4">
              {providerGroups.map((group) => (
                <div key={group.provider}>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {group.label}
                  </p>
                  <div className="space-y-1.5">
                    {group.models.map((model) => {
                      const isSelected = model.id === selectedModelId;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              )}
                              <span className={`text-sm font-medium truncate ${
                                isSelected ? "text-primary" : ""
                              }`}>
                                {model.label}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] shrink-0 ml-2 ${
                                model.pricing === "Free"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : model.pricing.includes("Free")
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {model.pricing}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 pl-0">
                            {model.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2 pt-1 border-t">
            <Label htmlFor="api-key" className="pt-2 block">
              {selectedModel.provider === "google"
                ? "Google Gemini"
                : selectedModel.provider === "openai"
                ? "OpenAI"
                : selectedModel.provider === "anthropic"
                ? "Anthropic"
                : selectedModel.provider === "groq"
                ? "Groq"
                : selectedModel.provider === "deepseek"
                ? "DeepSeek"
                : "OpenRouter"}{" "}
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder={selectedModel.keyPlaceholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
            <a
              href={selectedModel.keyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {selectedModel.keyLinkLabel}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            {hasKey && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Key
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            🔒 Your API key is stored only in your browser&apos;s local storage
            and sent directly to the provider&apos;s API. It is never logged or
            persisted on our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
