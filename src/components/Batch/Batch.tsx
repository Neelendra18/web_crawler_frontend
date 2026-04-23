import { BatchStatus } from '@types/index'
import './Batch.css'

interface BatchesProps {
  batches: BatchStatus[]
}

export const Batches: React.FC<BatchesProps> = ({ batches }) => {
  if (batches.length === 0) {
    return null
  }

  return (
    <div className="batches">
      {batches.map(batch => (
        <div key={batch.id} className={`batch batch-${batch.status}`}>
          <div className="batch-name">{batch.name}</div>
          <div className="batch-progress">
            <div className="batch-progress-bar" style={{ width: `${batch.progress}%` }}></div>
          </div>
          <div className="batch-status">{batch.progress}%</div>
        </div>
      ))}
    </div>
  )
}
