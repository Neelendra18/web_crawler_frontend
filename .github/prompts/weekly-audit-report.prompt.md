---
name: weekly-audit
description: "Generate a comprehensive weekly audit report covering project context, architecture, code quality, performance, and security for the quality nexus team."
---

# Weekly Audit Report Generator

Generate a comprehensive weekly audit report for the Web Crawler Frontend project.

## Report Parameters

- **Week of**: [Current Week Date]
- **Project**: Web Crawler Frontend
- **Team**: Quality Nexus Team
- **Report Type**: Weekly Comprehensive Audit

## Audit Dimensions

### 1. Project Context & Health
- Current version and deployment status
- Recent changes and commits
- Dependency health and updates
- Build artifacts and sizes
- Team and contributor activity

### 2. Architecture & Design
- Component structure integrity
- Design pattern compliance
- Service layer validation
- State management health
- Type safety coverage
- Code organization assessment

### 3. Code Quality
- Linting results (ESLint violations)
- TypeScript errors and warnings
- Code complexity analysis
- Test coverage metrics
- Technical debt identification
- Code duplication analysis

### 4. Performance Analysis
- Build times (development & production)
- Bundle size analysis and trends
- Component rendering performance
- API response times
- Memory usage patterns
- Optimization opportunities

### 5. Security Assessment
- Dependency vulnerabilities (npm audit)
- CORS and authentication checks
- Environment variable exposure risks
- Input validation coverage
- XSS/CSRF prevention measures
- Secrets management

## Report Structure

```
# Weekly Audit Report - Web Crawler Frontend
## Week of: [DATE]

### Executive Summary
[Brief overview of health, critical issues, and key metrics]

### 1. Project Context
[Version, status, recent activity, key metrics]

### 2. Architecture Health Score
[Design patterns, structure, maintainability assessment]

### 3. Code Quality Metrics
[Quality metrics, issues, recommendations]

### 4. Performance Status
[Build metrics, optimization opportunities]

### 5. Security Review
[Vulnerability assessment, risks, remediation]

### Action Items
[Prioritized list of tasks]

### Trend Analysis
[Week-over-week comparison and trends]
```

## Metrics to Include

**Key Performance Indicators:**
- Build time (seconds)
- Bundle size (KB gzipped)
- TypeScript errors
- ESLint violations
- Test coverage percentage
- Vulnerability count
- Performance score

**Health Indicators:**
- Critical issues
- High priority items
- Medium priority items
- Technical debt ratio
- Dependency freshness

## Output Format

Generate the report in Markdown format suitable for:
- Executive review
- Quality nexus team submission
- Trend tracking over weeks
- Historical archiving

## Success Criteria

✅ Actionable - Specific issues with solutions
✅ Measurable - Includes metrics and numbers
✅ Comparable - Can track trends over time
✅ Complete - Covers all 5 audit dimensions
✅ Professional - Executive-ready quality

## Next Steps After Report

1. Save report with timestamp: `audit-report-YYYY-WW.md`
2. Submit to quality nexus team
3. Schedule follow-up on action items
4. Track metrics for trend analysis
5. Archive for historical reference

---

Use this prompt to generate consistent, professional audit reports weekly.
