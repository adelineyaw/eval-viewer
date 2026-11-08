// Loads the sample results and works out the numbers the pages show.
// Everything here runs at build time, so there's no database or API.

import data from "@/data/results.json";

// The shape of one test case in results.json.
export type EvalCase = {
  id: string;
  input: string;
  expected: boolean; // true = this message should go to a person
  note: string;
  runs: boolean[]; // what the classifier answered on each run
};

export type EvalReport = {
  name: string;
  description: string;
  runDate: string;
  cases: EvalCase[];
};

export const report: EvalReport = data;

export function getCase(id: string): EvalCase | undefined {
  return report.cases.find((c) => c.id === id);
}

// How many runs of this case got the right answer.
export function passCount(c: EvalCase): number {
  return c.runs.filter((answer) => answer === c.expected).length;
}

// A case is "flaky" when its runs don't all give the same answer.
export function isFlaky(c: EvalCase): boolean {
  return new Set(c.runs).size > 1;
}

export type Summary = {
  totalRuns: number;
  accuracy: number; // share of all runs that were right
  overFire: number; // said "send to a person" when it shouldn't have
  underFire: number; // said "keep with the bot" when it should have sent it
  flakyCases: number; // cases where the runs disagreed
};

export function summarise(cases: EvalCase[]): Summary {
  let totalRuns = 0;
  let correct = 0;
  let shouldNotFire = 0;
  let firedWrongly = 0;
  let shouldFire = 0;
  let missed = 0;

  for (const c of cases) {
    for (const answer of c.runs) {
      totalRuns++;
      if (answer === c.expected) correct++;
      if (c.expected) {
        shouldFire++;
        if (!answer) missed++;
      } else {
        shouldNotFire++;
        if (answer) firedWrongly++;
      }
    }
  }

  return {
    totalRuns,
    accuracy: totalRuns ? correct / totalRuns : 0,
    overFire: shouldNotFire ? firedWrongly / shouldNotFire : 0,
    underFire: shouldFire ? missed / shouldFire : 0,
    flakyCases: cases.filter(isFlaky).length,
  };
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
