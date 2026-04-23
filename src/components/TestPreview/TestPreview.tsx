import React from 'react'
import { TestCase } from '@app-types/index'
import './TestPreview.css'

interface TestPreviewProps {
  tests: TestCase[]
  isLoading?: boolean
}

const TestPreviewComponent: React.FC<TestPreviewProps> = ({ tests, isLoading = false }) => {
  return (
    <div className="test-preview">
      <h4 className="test-preview-title">Generated Test Cases</h4>
      {isLoading && <div className="test-preview-loading">Generating tests...</div>}
      {tests.length === 0 && !isLoading && (
        <div className="test-preview-empty">No test cases yet. Start a crawl to generate tests.</div>
      )}
      {tests.length > 0 && (
        <div className="test-list">
          {tests.map(test => (
            <div key={test.id} className="test-item">
              <div className="test-header">
                <h5>{test.name}</h5>
              </div>
              {test.description && <p className="test-description">{test.description}</p>}
              {test.code && (
                <pre className="test-code">
                  <code>{test.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const TestPreview = React.memo(TestPreviewComponent)
