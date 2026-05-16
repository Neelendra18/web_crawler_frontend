import React from 'react';

// Accepts parsed document structure and renders React elements
export function renderDocumentPrototype(doc: any) {
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', color: '#232347', background: '#f8f9fb', borderRadius: 12, boxShadow: '0 2px 16px rgba(70,79,235,0.08)', padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: '#464feb' }}>{doc.title}</h1>
      {doc.sections.map((section: any, idx: number) => (
        <section key={idx} style={{ marginBottom: 32, background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px rgba(70,79,235,0.04)', padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#3b3b5b', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{getSectionIcon(section.heading)}</span>
            {section.heading}
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.7 }}>{renderSectionContent(section.content)}</div>
        </section>
      ))}
    </div>
  );
}

function getSectionIcon(heading: string) {
  // Add more icons as needed
  if (/feature/i.test(heading)) return '✨';
  if (/usage|how to/i.test(heading)) return '📝';
  if (/contact|support/i.test(heading)) return '📞';
  if (/introduction/i.test(heading)) return '👋';
  if (/dashboard|analytics/i.test(heading)) return '📊';
  if (/test case/i.test(heading)) return '🧪';
  if (/security|audit/i.test(heading)) return '🔒';
  if (/workflow/i.test(heading)) return '🔄';
  if (/document/i.test(heading)) return '📄';
  if (/user/i.test(heading)) return '👤';
  if (/scenario/i.test(heading)) return '🎯';
  return '📁';
}

function renderSectionContent(content: any) {
  // If content is a string, try to render lists and markdown-like formatting
  if (typeof content === 'string') {
    // Render bullet lists
    if (/^- /m.test(content)) {
      return (
        <ul style={{ paddingLeft: 24, margin: 0 }}>
          {content.split(/\n/).map((line: string, idx: number) =>
            line.trim().startsWith('- ')
              ? <li key={idx} style={{ marginBottom: 6, listStyle: 'disc', color: '#464feb' }}>{line.replace(/^- /, '')}</li>
              : null
          )}
        </ul>
      );
    }
    // Render numbered lists
    if (/^\d+\. /m.test(content)) {
      return (
        <ol style={{ paddingLeft: 24, margin: 0 }}>
          {content.split(/\n/).map((line: string, idx: number) =>
            /^\d+\. /.test(line.trim())
              ? <li key={idx} style={{ marginBottom: 6 }}>{line.replace(/^\d+\. /, '')}</li>
              : null
          )}
        </ol>
      );
    }
    // Otherwise, render as paragraph
    return <p>{content}</p>;
  }
  // If content is already React or array, render as is
  return content;
}
