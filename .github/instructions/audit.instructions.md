---
name: audit-framework
description: "Use when: auditing code quality, generating weekly audit reports, analyzing architecture, security, and performance. For: project context, code audits, performance analysis, security assessments."
---

# Audit Framework for Web Crawler Frontend

This instruction file guides Copilot to generate comprehensive weekly audit reports for the Web Crawler Frontend project. It ensures consistent, high-quality audit output for your quality nexus team.

## Audit Scope & Methodology

### 1. **Project Context Auditor**
Summarizes project health, recent changes, dependencies, and overall status.

**Checklist:**
- Project version & status
- Recent changes & commits
- Dependency health (outdated packages)
- Build status & performance
- Team activity & contributions

### 2. **Architecture Auditor**
Validates design patterns, code organization, scalability, and maintainability.

**Checklist:**
- Component hierarchy & relationships
- Service layer design
- State management patterns
- Type safety coverage
- Path aliases & imports structure
- Separation of concerns

### 3. **Code Auditor**
Reviews code quality, standards compliance, and technical debt.

**Checklist:**
- ESLint violations count
- TypeScript errors
- TODO/FIXME comments
- Code complexity metrics
- Dead code detection
- Testing coverage

### 4. **Performance Auditor**
Analyzes build times, bundle size, runtime performance, and optimization opportunities.

**Checklist:**
- Build time (dev & prod)
- Bundle size analysis
- Component re-render count
- Memory usage patterns
- API response times
- Optimization recommendations

### 5. **Security Auditor**
Assesses vulnerabilities, dependencies, and security best practices.

**Checklist:**
- Dependency vulnerabilities (npm audit)
- CORS configuration
- Environment variable handling
- Secret exposure risks
- Input validation
- XSS/CSRF prevention

---

## Report Generation Guidelines

When generating audit reports, follow this structure:

```
# Weekly Audit Report - Week of [DATE]

## Executive Summary
- Overall health score
- Critical issues count
- Key metrics

## 1. Project Context
- Version & status
- Recent activity
- Key metrics

## 2. Architecture Health
- Design patterns compliance
- Issues & risks
- Recommendations

## 3. Code Quality
- Quality metrics
- Issues found
- Next steps

## 4. Performance Status
- Build metrics
- Bundle analysis
- Optimization opportunities

## 5. Security Review
- Vulnerability assessment
- Risk mitigation
- Action items

## Action Items
- Priority 1 (Critical)
- Priority 2 (High)
- Priority 3 (Medium)
- Priority 4 (Low)

## Trend Analysis
- Compared to previous week
- Improvement areas
- Regressing areas
```

---

## Using This Framework

### With Copilot Chat

1. **Request a full audit:**
   ```
   Generate a complete weekly audit report for the web crawler frontend project.
   Include: project context, architecture review, code audit, performance analysis, 
   and security assessment.
   ```

2. **Request specific audit:**
   ```
   Perform a security audit of the web crawler frontend and generate a report.
   ```

3. **Request comparison:**
   ```
   Generate a weekly audit report and compare it to last week's findings.
   ```

### With Prompts

Use `/weekly-audit` prompt for guided report generation.

---

## Audit Report Templates

See the templates in `.copilot/templates/` directory:
- `project-context-template.md`
- `architecture-template.md`
- `code-auditor-template.md`
- `performance-auditor-template.md`
- `security-auditor-template.md`

---

## Success Criteria

Each audit report should:
- ✅ Be actionable (specific issues with solutions)
- ✅ Be measurable (include metrics & numbers)
- ✅ Be comparable (track trends over time)
- ✅ Be complete (cover all 5 audit areas)
- ✅ Be professional (suitable for executive review)

---

## Integration with Quality Nexus Team

Reports should include:
1. **Metric Dashboard** - Key performance indicators
2. **Risk Assessment** - Critical, High, Medium, Low items
3. **Trend Analysis** - Week-over-week comparison
4. **Action Items** - Prioritized tasks
5. **Executive Summary** - High-level overview

---

For detailed audit templates and examples, see:
- `.copilot/templates/project-context-template.md`
- `.copilot/templates/architecture-template.md`
- `.copilot/templates/code-auditor-template.md`
- `.copilot/templates/performance-auditor-template.md`
- `.copilot/templates/security-auditor-template.md`
