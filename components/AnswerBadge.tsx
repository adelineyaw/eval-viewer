// Shows a classifier answer as a coloured label: green if it was right, red if wrong.

type AnswerBadgeProps = {
  answer: boolean;
  correct: boolean;
};

export default function AnswerBadge({ answer, correct }: AnswerBadgeProps) {
  return (
    <span className={correct ? "badge pass" : "badge fail"}>
      {answer ? "Person" : "Bot"}
    </span>
  );
}
