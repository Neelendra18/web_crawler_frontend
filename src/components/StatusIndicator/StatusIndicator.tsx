import './StatusIndicator.css'

interface StatusIndicatorProps {
  status: 'idle' | 'running' | 'completed' | 'failed'
  label?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const statusMap = {
    idle: 'Idle',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  }

  return (
    <div className="status-indicator">
      <span className={`status-dot status-dot-${status}`}></span>
      <span className="status-text">{label || statusMap[status]}</span>
    </div>
  )
}
