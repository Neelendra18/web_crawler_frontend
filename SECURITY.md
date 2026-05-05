# Security Guidelines and Risk Documentation

## Secure Usage Guidelines
- Always deploy behind HTTPS with HSTS, CSP, and X-Content-Type-Options headers (see public/_headers).
- Never expose .env or sensitive config files to the client.
- Use strong, unique secrets for all environment variables.
- Keep all dependencies up to date and run `npm audit` regularly.
- Do not log or display PII or sensitive data in the UI or logs.
- Validate and sanitize all user input on both frontend and backend.
- Use Sentry for error monitoring and disable debug logs in production.

## Accepted Risks
- Authentication and authorization are handled by the backend; frontend assumes API is protected.
- No explicit CSRF or rate limiting in frontend; must be enforced by backend.
- PII handling is minimal in frontend, but always review new features for PII exposure.

## Security Checklist
- [x] Security headers set in public/_headers
- [x] Sentry and loglevel for error monitoring
- [x] No direct DOM injection or untrusted scripts
- [x] .env and secrets not exposed to client
- [ ] Add npm audit and Snyk to CI
- [ ] Add more input validation and log masking as code evolves

---
For more, see OWASP Top 10 and React security best practices.
