"use client";

import { useState, useEffect } from "react";
import { Settings, ExternalLink, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const STORAGE_KEY = "cv-tailor-gemini-key";

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, []);

  const saveKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return { apiKey, saveKey };
}

interface SettingsDialogProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export function SettingsDialog({ apiKey, onSaveKey }: SettingsDialogProps) {
  const [key, setKey] = useState(apiKey);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey]);

  const hasKey = apiKey.length > 0;

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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </DialogTitle>
          <DialogDescription>
            Add your Google Gemini API key to use the AI features. Your key is
            stored locally in your browser and never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="font-mono text-sm"
            />
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Get a free API key from Google AI Studio
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                onSaveKey(key.trim());
                setOpen(false);
              }}
              className="flex-1"
            >
              Save Key
            </Button>
            {hasKey && (
              <Button
                variant="outline"
                onClick={() => {
                  setKey("");
                  onSaveKey("");
                  setOpen(false);
                }}
                className="gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            🔒 Your API key is stored only in your browser&apos;s local storage.
            It is sent directly to Google&apos;s API through our server and is
            never logged or persisted.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
