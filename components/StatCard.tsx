// A small box with one number and a label. Used four times on the summary page,
// each time with different props.

type StatCardProps = {
  label: string;
  value: string;
  help: string;
};

export default function StatCard({ label, value, help }: StatCardProps) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      <div className="card-help">{help}</div>
    </div>
  );
}
