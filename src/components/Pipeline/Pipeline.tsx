import { PipelineStep } from '@types/index'
import './Pipeline.css'

interface PipelineProps {
  steps: PipelineStep[]
}

export const Pipeline: React.FC<PipelineProps> = ({ steps }) => {
  return (
    <div className="pipeline">
      {steps.map(step => (
        <div
          key={step.id}
          className={`pipeline-step ${step.active ? 'active' : ''} ${
            step.completed ? 'completed' : ''
          }`}
        >
          {step.completed && <span className="pipeline-checkmark">✓</span>}
          <span className="pipeline-step-name">{step.name}</span>
        </div>
      ))}
    </div>
  )
}
