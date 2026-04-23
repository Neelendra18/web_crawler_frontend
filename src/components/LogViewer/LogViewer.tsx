import React from 'react'
import { LogEntry } from '@app-types/index'
import './LogViewer.css'

interface LogViewerProps {
  logs: LogEntry[]
  maxHeight?: number
}

const LogViewerComponent: React.FC<LogViewerProps> = ({ logs, maxHeight = 300 }) => {
  return (
    <div className="log-viewer" style={{ maxHeight }}>
      {logs.length === 0 ? (
        <div className="log-empty">No logs yet</div>
      ) : (
        <div className="log-list">
          {logs.map(log => (
            <div key={log.id} className={`log-entry log-${log.level}`}>
              <span className="log-timestamp">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className="log-level">{log.level.toUpperCase()}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const LogViewer = React.memo(LogViewerComponent)
