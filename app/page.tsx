// Page 1: the summary, at the URL "/".

import Link from "next/link";
import StatCard from "@/components/StatCard";
import { isFlaky, percent, report, summarise } from "@/lib/results";

export default function SummaryPage() {
  const s = summarise(report.cases);
  const flaky = report.cases.filter(isFlaky);

  return (
    <>
      <h1>{report.name}</h1>
      <p className="lead">{report.description}</p>
      <p className="muted">
        {report.cases.length} cases · {s.totalRuns} runs · {report.runDate}
      </p>

      <div className="cards">
        <StatCard
          label="Accuracy"
          value={percent(s.accuracy)}
          help="Share of all runs that gave the right answer."
        />
        <StatCard
          label="Over-fire"
          value={percent(s.overFire)}
          help="Sent to a person when the bot could have handled it."
        />
        <StatCard
          label="Under-fire"
          value={percent(s.underFire)}
          help="Kept with the bot when it should have gone to a person."
        />
        <StatCard
          label="Flaky cases"
          value={`${s.flakyCases} of ${report.cases.length}`}
          help="Cases where the runs didn't all agree."
        />
      </div>

      <h2>Why run each case more than once?</h2>
      <p>
        AI answers can change from run to run. A single run of these cases
        could look perfect by luck. Running each one {report.cases[0]?.runs.length} times
        shows which answers are stable and which ones flip.
      </p>

      {flaky.length > 0 && (
        <>
          <h2>Cases to look at first</h2>
          <ul>
            {flaky.map((c) => (
              <li key={c.id}>
                <Link href={`/cases/${c.id}`}>{c.id}</Link>: {c.input}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
