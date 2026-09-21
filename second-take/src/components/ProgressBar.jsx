export default function ProgressBar({ done, total }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Lessons completed"
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p style={{ marginTop: 8, fontSize: 16 }}>
        <strong>{done} of {total} lessons done</strong> · {percent}% of the way there
      </p>
    </div>
  )
}
