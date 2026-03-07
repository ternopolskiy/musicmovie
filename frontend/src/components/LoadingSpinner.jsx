import './LoadingSpinner.css'

export default function LoadingSpinner({ size = 40, text = '' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" style={{ width: size, height: size }}>
        <svg viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="90, 150"
            strokeDashoffset="0"
          />
        </svg>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}
