// Page 3: one page per case, at URLs like "/cases/c04".
// The folder name [id] makes this a dynamic route: the part of the URL after
// /cases/ is passed to the page as params.id.

import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerBadge from "@/components/AnswerBadge";
import { getCase, isFlaky, passCount, report } from "@/lib/results";

// Tells Next.js which case pages to build ahead of time, one per case.
export function generateStaticParams() {
  return report.cases.map((c) => ({ id: c.id }));
}

export default async function CasePage({ params }: PageProps<"/cases/[id]">) {
  const { id } = await params;
  const c = getCase(id);

  // An ID that isn't in the data shows the 404 page.
  if (!c) notFound();

  return (
    <>
      <p>
        <Link href="/cases">← All cases</Link>
      </p>
      <h1>Case {c.id}</h1>
      <blockquote>{c.input}</blockquote>
      <p>
        <strong>Expected:</strong> {c.expected ? "Person" : "Bot"} · {c.note}
      </p>
      <p>
        <strong>Result:</strong> passed {passCount(c)} of {c.runs.length} runs
        {isFlaky(c) ? " — the answer changed between runs." : "."}
      </p>

      <h2>Every run</h2>
      <ol className="runs">
        {c.runs.map((answer, i) => (
          <li key={i}>
            Run {i + 1}:{" "}
            <AnswerBadge answer={answer} correct={answer === c.expected} />
          </li>
        ))}
      </ol>
    </>
  );
}
