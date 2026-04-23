# Instructions:
1. For code generation and review: Refer to 'Project Context', 'Documentation', 'Technology Stack' sections.
2. For component development: Follow React best practices, TypeScript strict mode, component composition patterns.
3. For state management: Use Zustand stores as demonstrated in the project (useCrawlerStore, useProcessingStore).
4. For API integration: Use the service layer pattern (crawlerService, apiClient with Axios interceptors).
5. For testing: Refer to 'Testing' section. Use Vitest + React Testing Library for all tests.
6. For styling: Use CSS Modules + CSS variables. Follow the design system defined in ARCHITECTURE.md.
7. For debugging: Reference QUICK_REFERENCE.md for common development tasks and patterns.

# Project Context
1. Project Name: Web Crawler Frontend (Web Crawler Test Generator)
2. Project Description: Production-ready React TypeScript frontend for web crawling and automated test case generation. Provides UI for managing crawl jobs, viewing progress, and downloading generated test files.
3. Additional Info: This is a frontend-only application (React SPA). Backend is a separate Python REST API. Frontend integrates with Python backend via REST endpoints. Follows enterprise-grade architecture patterns and best practices.
4. Project Type: Web Application (SPA)
5. Project Category: Frontend Development
6. Project Subcategory: React Application
7. Project Stage: Production Ready

# Documentation
1. Documentation: README.md, ARCHITECTURE.md, SETUP.md, API_INTEGRATION.md, QUICK_REFERENCE.md, PROJECT_SUMMARY.md, FILE_TREE.md

# Technology Stack
1. Architecture: Single Page Application (SPA)
2. Frontend Technology: React 18.2.0
3. Backend Technology: Python (REST API - separate service)
4. Programming Language: TypeScript (strict mode), JavaScript
5. Framework: React, React Router v6, Zustand, Axios
6. Database: N/A (Frontend only)
7. ORM: N/A (Frontend only)
8. Build Tool: Vite 5.0.0
9. Styling: CSS Modules, CSS Variables
10. State Management: Zustand

# Testing
1. Testing: "Vitest"
2. Testing Framework: "Vitest"
3. Testing Library: "React Testing Library"
4. Testing Type: "Unit Testing, Component Testing, Integration Testing"

# Code Repository
1. Code Repository: "GitHub / Git"
2. Package Manager: "npm"

# Deployment
1. Deployment: "Docker, Static Hosting"
2. CI/CD: "GitHub Actions (recommended)"
3. CI/CD Pipeline: "GitHub Actions"
4. CI/CD Tools: "GitHub Actions"
5. Environment: "Development, Production"
6. Hosting: "AWS S3, Netlify, Vercel, AWS EC2, or any static host"
7. Hosting Type: "Static SPA, Docker Container"