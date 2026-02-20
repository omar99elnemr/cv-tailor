"use client";

export function CoverLetterPreview({ text }: { text: string }) {
  if (!text || text.trim().length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No cover letter was generated.</p>
        <p className="text-sm mt-1">
          Enable the cover letter option before tailoring.
        </p>
      </div>
    );
  }

  // Split by paragraphs and render
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className="space-y-4 text-sm leading-relaxed max-w-2xl">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
