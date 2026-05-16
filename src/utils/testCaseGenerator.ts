// Utility to generate test cases from a parsed document prototype
// This is a simple example; expand as needed for real-world use

export function generateTestCases(doc: any) {
  const tests = [];

  // Navigation tests
  tests.push({
    description: 'All sections are navigable',
    steps: doc.sections.map((section: any) => `Navigate to section: ${section.heading}`),
  });

  // Content presence tests
  doc.sections.forEach((section: any) => {
    tests.push({
      description: `Section "${section.heading}" is rendered`,
      steps: [`Check that content for "${section.heading}" is visible`],
    });
  });

  // Example: Add more test types (forms, tables, etc.)

  return tests;
}
