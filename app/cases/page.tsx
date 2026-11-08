// Page 2: a table of every case, at the URL "/cases".

import Link from "next/link";
import { isFlaky, passCount, report } from "@/lib/results";

export default function CasesPage() {
  return (
    <>
      <h1>All cases</h1>
      <p className="muted">Click a case ID to see every run.</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Expected</th>
            <th>Passed</th>
            <th>Stable?</th>
          </tr>
        </thead>
        <tbody>
          {report.cases.map((c) => (
            <tr key={c.id}>
              <td>
                <Link href={`/cases/${c.id}`}>{c.id}</Link>
              </td>
              <td>{c.input}</td>
              <td>{c.expected ? "Person" : "Bot"}</td>
              <td>
                {passCont(c)} / {c.runs.length}
              </td>
              <td>{isFlaky(c) ? "Flaky" : "Stable"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
