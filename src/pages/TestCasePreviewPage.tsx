import React from 'react';
import { generateTestCases } from '../utils/testCaseGenerator';
import { parseMarkdownDemo } from '../utils/parseMarkdownDemo';
import { useEffect, useState } from 'react';


const TestCasePreviewPage: React.FC = () => {
  const [testCases, setTestCases] = useState<any[]>([]);

  useEffect(() => {
    fetch('/demo-doc.md')
      .then(res => res.text())
      .then(md => {
        const doc = parseMarkdownDemo(md);
        setTestCases(generateTestCases(doc));
      });
  }, []);

  if (!testCases.length) return <div style={{ padding: 32 }}>Loading test cases...</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>Generated Test Cases</h2>
      <ul>
        {testCases.map((test, idx) => (
          <li key={idx} style={{ marginBottom: 24 }}>
            <strong>{test.description}</strong>
            <ul>
              {test.steps.map((step: string, sidx: number) => (
                <li key={sidx}>{step}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestCasePreviewPage;
