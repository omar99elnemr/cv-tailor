# CV Tailor — AI-Powered Resume Tailoring

Upload your resume, provide a job description, and get an ATS-optimized tailored version with a matching cover letter. **Free and open source.**

## Features

- **📄 Resume Parsing** — Upload PDF or DOCX, or paste text directly. AI structures your resume automatically.
- **🎯 ATS Optimization** — Mirrors job keywords, reorders skills, rewrites bullets using STAR method with quantified achievements.
- **📊 ATS Score** — See keyword match percentage, matched/missing keywords, and improvement suggestions.
- **✉️ Cover Letter** — Auto-generated 3-paragraph cover letter tailored to the specific role.
- **📥 PDF Export** — Download a clean, professional, ATS-friendly PDF resume.
- **🔑 Bring Your Own Key** — Use your own Google Gemini API key (stored in browser only).
- **🌙 Dark Mode** — System-aware theme switching.
- **📱 Responsive** — Works on desktop, tablet, and mobile.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | shadcn/ui + Tailwind CSS |
| AI | Google Gemini 2.0 Flash via Vercel AI SDK |
| Resume Parsing | pdf-parse (PDF) + mammoth (DOCX) |
| Job Scraping | cheerio + fetch |
| PDF Generation | @react-pdf/renderer |
| Hosting | Vercel (free tier) |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/omar99elnemr/cv-tailor.git
cd cv-tailor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Get a **free** Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
cp .env.example .env.local
# Edit .env.local and add your key
```

Or use the in-app Settings ⚙️ to add your key (stored in browser only).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/omar99elnemr/cv-tailor&env=GOOGLE_GENERATIVE_AI_API_KEY&envDescription=Get%20a%20free%20API%20key%20from%20Google%20AI%20Studio&envLink=https://aistudio.google.com/apikey)

1. Click the button above or import the repo in Vercel
2. Add `GOOGLE_GENERATIVE_AI_API_KEY` as an environment variable
3. Deploy — that's it!

## How It Works

1. **Upload** your resume (PDF/DOCX) or paste the text
2. **Provide** a job description (paste text or fetch from URL)
3. **AI tailors** your resume: rewrites summary, optimizes bullets, reorders skills, matches keywords
4. **Review** the tailored resume, cover letter, and ATS score
5. **Download** as a professional PDF

## Privacy

- Your resume and job description are processed in real-time and **never stored** on our servers
- API keys entered in Settings are stored **only in your browser's localStorage**
- All AI processing goes directly to Google's Gemini API

## License

MIT
