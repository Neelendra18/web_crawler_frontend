// Simple Markdown parser for demo purposes only
// Converts a markdown string into a structure compatible with the prototype renderer
export function parseMarkdownDemo(md: string) {
  const lines = md.split('\n');
  let title = '';
  const sections: { heading: string; content: string }[] = [];
  let currentSection: any = null;
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
    } else if (line.startsWith('## ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: line.replace('## ', '').trim(), content: '' };
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? '\n' : '') + line;
    }
  }
  if (currentSection) sections.push(currentSection);
  return { title, sections };
}