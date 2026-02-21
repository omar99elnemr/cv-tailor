"use client";

import type { ResumeData } from "@/lib/schemas";

export function ResumePreview({ data }: { data: ResumeData }) {
  const { contact, summary, experience, education, skills, projects, certifications, languages } = data;

  return (
    <div className="space-y-5 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">{contact.fullName}</h2>
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 mt-2 text-xs text-muted-foreground">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && (
            <>
              <span className="text-border">|</span>
              <span>{contact.phone}</span>
            </>
          )}
          {contact.location && (
            <>
              <span className="text-border">|</span>
              <span>{contact.location}</span>
            </>
          )}
          {contact.linkedin && (
            <>
              <span className="text-border">|</span>
              <a
                href={
                  contact.linkedin.startsWith("http")
                    ? contact.linkedin
                    : `https://linkedin.com/in/${contact.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {contact.linkedin.startsWith("http")
                  ? contact.linkedin.replace(/^https?:\/\//, "").replace(/\/$/, "")
                  : `linkedin.com/in/${contact.linkedin}`}
              </a>
            </>
          )}
          {contact.github && (
            <>
              <span className="text-border">|</span>
              <a
                href={
                  contact.github.startsWith("http")
                    ? contact.github
                    : `https://github.com/${contact.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {contact.github.startsWith("http")
                  ? contact.github.replace(/^https?:\/\//, "").replace(/\/$/, "")
                  : `github.com/${contact.github}`}
              </a>
            </>
          )}
          {contact.website && (
            <>
              <span className="text-border">|</span>
              <a
                href={
                  contact.website.startsWith("http")
                    ? contact.website
                    : `https://${contact.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {contact.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </>
          )}
        </div>
      </div>

      <hr className="border-border" />

      {/* Summary */}
      {summary && summary.trim() && (
        <p className="italic text-muted-foreground text-[13px] leading-relaxed">
          {summary}
        </p>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] border-b border-border pb-1 mb-3">
            Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-[13px]">{exp.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="flex gap-2 text-[12.5px]">
                      <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] border-b border-border pb-1 mb-3">
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-[13px]">{edu.degree}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {edu.startDate ? `${edu.startDate} — ` : ""}
                    {edu.endDate}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {edu.institution}
                  {edu.location ? ` · ${edu.location}` : ""}
                </p>
                {edu.details && edu.details.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.details.map((detail, j) => (
                      <li key={j} className="flex gap-2 text-[12.5px]">
                        <span className="text-muted-foreground shrink-0">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] border-b border-border pb-1 mb-3">
            Skills
          </h3>
          <div className="space-y-1.5">
            {skills.map((cat, i) => (
              <div key={i} className="flex gap-2 text-[12.5px]">
                <span className="font-semibold min-w-[100px] shrink-0">
                  {cat.category}:
                </span>
                <span className="text-muted-foreground">
                  {cat.items.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] border-b border-border pb-1 mb-3">
            Projects
          </h3>
          <div className="space-y-3">
            {projects.map((proj, i) => (
              <div key={i}>
                <h4 className="font-semibold text-[13px]">{proj.name}</h4>
                <p className="text-[12.5px] text-muted-foreground">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-muted-foreground italic mt-0.5">
                    Tech: {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] border-b border-border pb-1 mb-3">
            Certifications
          </h3>
          <ul className="space-y-1">
            {certifications.map((cert, i) => (
              <li key={i} className="flex gap-2 text-[12.5px]">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] border-b border-border pb-1 mb-3">
            Languages
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
            {languages.map((lang, i) => (
              <span key={i}>
                <span className="font-semibold">{lang.language}</span>
                <span className="text-muted-foreground"> ({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
