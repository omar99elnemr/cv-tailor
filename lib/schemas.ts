import { z } from "zod";

// ── Contact Information ──
export const ContactInfoSchema = z.object({
  fullName: z.string().describe("The candidate's full name"),
  email: z.string().optional().describe("Email address. Only include if present in the resume."),
  phone: z.string().optional().describe("Phone number with country code. Only include if present in the resume."),
  linkedin: z.string().optional().describe("LinkedIn profile URL exactly as it appears in the resume (e.g. 'linkedin.com/in/johndoe'). Only include if present."),
  github: z.string().optional().describe("GitHub profile URL exactly as it appears in the resume (e.g. 'github.com/johndoe'). Only include if present."),
  website: z.string().optional().describe("Personal website URL exactly as it appears in the resume. OMIT this field entirely if the resume has no website. Never put explanations or placeholder text here."),
  location: z.string().optional().describe("City and country/state exactly as written in the resume (e.g. 'Cairo, Egypt'). Only include if present."),
});

// ── Experience Entry ──
export const ExperienceSchema = z.object({
  title: z.string().describe("Job title — ONLY as written in the resume"),
  company: z.string().describe("Company or organization name — ONLY as written in the resume"),
  location: z.string().optional().describe("Job location. OMIT entirely if not present in the resume."),
  startDate: z.string().describe("Start date (e.g., 'Jan 2023' or '2023') — ONLY as written"),
  endDate: z.string().describe("End date (e.g., 'Present' or 'Dec 2024') — ONLY as written"),
  bullets: z
    .array(z.string())
    .describe("Achievement/responsibility bullet points — copy verbatim from the resume, do NOT rephrase or invent"),
});

// ── Education Entry ──
export const EducationSchema = z.object({
  degree: z.string().describe("Degree name (e.g., 'BSc Computer Science') — ONLY as written in the resume"),
  institution: z.string().describe("University or school name — ONLY as written in the resume"),
  location: z.string().optional().describe("Institution location. OMIT entirely if not present in the resume."),
  startDate: z.string().optional().describe("Start date. OMIT if not present."),
  endDate: z.string().describe("End date or expected graduation — ONLY as written"),
  details: z
    .array(z.string())
    .optional()
    .describe("Relevant coursework, honors, GPA, activities. OMIT entirely if not present in the resume."),
});

// ── Skill Category ──
export const SkillCategorySchema = z.object({
  category: z.string().describe("Skill category name (e.g., 'Programming Languages', 'Frameworks')"),
  items: z.array(z.string()).describe("List of skills in this category"),
});

// ── Project Entry ──
export const ProjectSchema = z.object({
  name: z.string().describe("Project name — ONLY as written in the resume"),
  description: z.string().describe("Brief project description and impact — copy from the resume, do NOT invent details"),
  technologies: z
    .array(z.string())
    .optional()
    .describe("Technologies/tools used. OMIT entirely if not listed in the resume."),
  url: z.string().optional().describe("Project URL or repository link. OMIT entirely if not present in the resume — do NOT guess or construct a URL."),
});

// ── Certification Entry ──
export const CertificationSchema = z.object({
  name: z.string().describe("Certification name — ONLY as written in the resume"),
  url: z
    .string()
    .optional()
    .describe(
      "Verification or badge URL for this certification (e.g., Credly link). OMIT if not present in the resume — do NOT guess or construct a URL."
    ),
});

// ── Language Entry ──
export const LanguageEntrySchema = z.object({
  language: z.string().describe("Language name"),
  proficiency: z
    .string()
    .describe("Proficiency level (e.g., 'Native', 'Fluent', 'Intermediate')"),
});

// ── Full Resume Data ──
export const ResumeDataSchema = z.object({
  contact: ContactInfoSchema,
  summary: z
    .string()
    .describe(
      "Professional summary or objective statement (2-3 sentences). Use empty string if not present — do NOT generate a summary."
    ),
  experience: z
    .array(ExperienceSchema)
    .describe("Work experience entries, most recent first. ONLY include entries that appear in the resume."),
  education: z
    .array(EducationSchema)
    .describe("Education entries, most recent first. ONLY include entries that appear in the resume."),
  skills: z
    .array(SkillCategorySchema)
    .describe("Skills grouped by category. ONLY include skills explicitly listed in the resume."),
  projects: z
    .array(ProjectSchema)
    .optional()
    .describe("Notable projects. OMIT entirely if no projects section exists in the resume."),
  certifications: z
    .array(CertificationSchema)
    .optional()
    .describe(
      "Professional certifications with optional verification URLs. OMIT entirely if not present in the resume."
    ),
  languages: z
    .array(LanguageEntrySchema)
    .optional()
    .describe("Spoken/written languages. OMIT entirely if not listed in the resume."),
});

// ── Job Description Details ──
export const JobDetailsSchema = z.object({
  title: z.string().describe("Job title from the posting"),
  company: z.string().describe("Company name"),
  location: z.string().optional().describe("Job location"),
  requirements: z
    .array(z.string())
    .describe("Required qualifications and skills"),
  preferredSkills: z
    .array(z.string())
    .describe("Preferred/nice-to-have skills"),
  responsibilities: z
    .array(z.string())
    .describe("Key job responsibilities"),
  keywords: z
    .array(z.string())
    .describe(
      "Important keywords and phrases for ATS matching (technical skills, tools, methodologies, certifications)"
    ),
});

// ── ATS Score ──
export const ATSScoreSchema = z.object({
  score: z
    .number()
    .describe("ATS match score from 0 to 100"),
  matchedKeywords: z
    .array(z.string())
    .describe("Keywords from the job that appear in the tailored resume"),
  missingKeywords: z
    .array(z.string())
    .describe(
      "Important keywords from the job that are NOT in the candidate's background"
    ),
  suggestions: z
    .array(z.string())
    .describe("Actionable suggestions to further improve the resume"),
});

// ── Tailored Result ──
export const TailoredResultSchema = z.object({
  resume: ResumeDataSchema.describe("The tailored resume"),
  atsScore: ATSScoreSchema.describe("ATS keyword match analysis"),
  coverLetter: z
    .string()
    .optional()
    .describe("Tailored cover letter if requested"),
});

// ── Type Exports ──
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;
export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type JobDetails = z.infer<typeof JobDetailsSchema>;
export type ATSScore = z.infer<typeof ATSScoreSchema>;
export type TailoredResult = z.infer<typeof TailoredResultSchema>;
