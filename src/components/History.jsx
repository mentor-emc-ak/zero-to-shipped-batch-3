import { useEffect, useState } from "react";
import { fetchFitHistory } from "../lib/fitReport.js";

// Lists earlier saved runs, newest first. Loads once when the page opens.
// Each row shows the score and the counts; the feedback text stays out of the list.
export default function History() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchFitHistory()
      .then(({ reports }) => {
        if (!cancelled) {
          setReports(reports);
          setStatus("done");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return <p className="text-muted">Loading your history…</p>;
  if (status === "error") return <p className="text-accent-ink">{error}</p>;
  if (reports.length === 0) return <p className="text-muted">No saved runs yet.</p>;

  return (
    <ul className="divide-y divide-ink border-t border-ink">
      {reports.map((r) => (
        <li key={r._id} className="py-4 grid gap-2 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-6">
          <span className="font-display text-3xl font-bold text-accent-ink">{r.overallScore}</span>
          <div className="text-sm text-muted space-y-1">
            <p>
              Keyword {r.breakdown.match} · Structure {r.breakdown.structure} · Impact {r.breakdown.impact}
            </p>
            <p>
              {r.matchedTerms.length} matched · {r.missingTerms.length} missing · {r.weaknesses.length} changes to make
            </p>
          </div>
          <time className="text-sm text-muted" dateTime={r.createdAt}>
            {new Date(r.createdAt).toLocaleString()}
          </time>
        </li>
      ))}
    </ul>
  );
}
