# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅        |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues by emailing the maintainer directly.
Include a description of the vulnerability, steps to reproduce, and the potential impact.

Expected response time: within 72 hours.
Responsible disclosure is appreciated and will be credited.

## Security Architecture

See [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md) for full details on:
- Threat model and mitigations
- Security headers (CSP, HSTS, X-Frame-Options)
- Input validation (TypeScript + Zod validation schema)
- LocalStorage privacy design
- API security and mock parameters
