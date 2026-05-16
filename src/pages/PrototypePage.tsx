import React from 'react';
import { renderDocumentPrototype } from '../utils/prototypeRenderer';
import { parseMarkdownDemo } from '../utils/parseMarkdownDemo';
import { useEffect, useState } from 'react';


const PrototypePage: React.FC = () => {
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    fetch('/demo-doc-complex.md')
      .then(res => res.text())
      .then(md => setDoc(parseMarkdownDemo(md)));
  }, []);

  if (!doc) return <div style={{ padding: 32 }}>Loading prototype...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 220, background: '#f5f5f5', padding: 16 }}>
        <h2>{doc.title}</h2>
        <ul>
          {doc.sections.map((sec: any, idx: number) => (
            <li key={idx}>{sec.heading}</li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1, padding: 32 }}>
        {renderDocumentPrototype(doc)}
      </main>
    </div>
  );
};

export default PrototypePage;
