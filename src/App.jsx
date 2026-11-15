import { useState } from "react";
import Button from "./components/Button.jsx";
import DropZone from "./components/DropZone.jsx";
import JobDescriptionInput from "./components/JobDescriptionInput.jsx";
import ScoreCard from "./components/ScoreCard.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { useAnalysis } from "./hooks/useAnalysis.js";
import { useTheme } from "./hooks/useTheme.js";
import { MIN_JD_LENGTH } from "./lib/constants.js";
import { SAMPLE_RESULT } from "./lib/sampleResult.js";

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [inputError, setInputError] = useState("");
  const { status, result, error, isLoading, run, report, reportError, reportLoading } = useAnalysis();
  const { theme, toggle } = useTheme();

  // Check the inputs first, then hand the work to the hook.
  const handleCompare = () => {
    setInputError("");
    if (!file) return setInputError("Add your resume first.");
    if (jobDescription.trim().length < MIN_JD_LENGTH) {
      return setInputError("Paste a fuller job description (at least a few sentences).");
    }
    run(file, jobDescription);
  };

  const message = inputError || (status === "error" ? error : "");

  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12 space-y-16">
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <p className="font-display text-xl font-bold tracking-tight">Resume Parser</p>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>

        <header className="space-y-6 max-w-3xl">
          <h1 className="font-display font-bold text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-tight [font-stretch:75%]">
            See how well your resume fits the job
          </h1>
          <p className="text-lg leading-relaxed text-muted max-w-[65ch]">
            Drop in your resume (PDF or Word) and paste a job description. You get a scorecard showing
            what matches, what is missing, and where your resume is strong or weak.
          </p>
        </header>

        <section className="grid gap-10 md:grid-cols-2">
          <div className="space-y-3">
            <p className="font-display text-lg font-semibold">1. Your resume</p>
            <DropZone file={file} onFile={setFile} />
          </div>

          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

          <div className="md:col-span-2 flex flex-col items-start gap-3">
            <Button onClick={handleCompare} loading={isLoading}>
              Compare resume to job
            </Button>
            <p className="text-sm text-accent-ink min-h-[1.25rem]">{message}</p>
          </div>
        </section>

        {status === "done" && result ? (
          <>
            <ScoreCard result={result} />
            <section className="space-y-4">
              <p className="font-display text-lg font-semibold">Written fit report</p>
              {reportLoading && <p className="text-muted">Writing your report…</p>}
              {reportError && <p className="text-accent-ink">{reportError}</p>}
              {report && (
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-ink">{report}</pre>
              )}
            </section>
          </>
        ) : (
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-sm uppercase tracking-widest text-accent">Example results</p>
              <p className="text-sm text-muted">
                This is a sample, not your resume. Upload yours above to see your own scorecard.
              </p>
            </div>
            <ScoreCard result={SAMPLE_RESULT} />
          </section>
        )}
      </div>
    </main>
  );
}
