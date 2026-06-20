# Security Architecture
## CarbonQuest — Gamified Carbon Footprint Coach

---

## 1. Threat Model & Mitigations

| Threat | Mitigation |
|--------|-----------|
| **XSS (Cross-Site Scripting)** | Custom Content-Security-Policy (CSP) header restricts script sources; React 19 automatically escapes all dynamic expressions in JSX output. |
| **Clickjacking** | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` prevent embedding the platform in unauthorized frames. |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` header forces browser to respect content types declared in headers. |
| **Man-in-the-Middle (MITM)** | HTTP Strict Transport Security (HSTS) with `max-age=63072000; includeSubDomains; preload` forces SSL connections. |
| **API key exposure** | API keys (like `GROQ_API_KEY`) are kept server-side in Next.js backend environment variables; client-side overrides use memory variables rather than storing keys long-term. |
| **Excessive Data Exposure** | Next.js API route handlers act as a proxy, scrubbing backend errors and exposing only sanitized message content to the user interface. |

---

## 2. Security Headers (next.config.ts)

Applied to every HTTP response via Next.js configuration middleware:

```
Content-Security-Policy: default-src 'self';
                         script-src 'self' 'unsafe-eval' 'unsafe-inline';
                         style-src 'self' 'unsafe-inline';
                         img-src 'self' blob: data:;
                         connect-src 'self' https://api.groq.com;
                         font-src 'self';
                         object-src 'none';
                         frame-ancestors 'none';

X-Content-Type-Options:  nosniff
X-Frame-Options:          DENY
X-XSS-Protection:         1; mode=block
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy:          strict-origin-when-cross-origin
Permissions-Policy:       geolocation=(), microphone=(), camera=()
```

---

## 3. Input Validation

Two levels of input checks ensure system integrity:
1. **Frontend Validation**: Forms validate fields (e.g. baseline quiz inputs, activity quantities) before dispatching to state or routes.
2. **API Type Enforcement**: Next.js route handlers validate parameters on incoming requests, checking JSON bodies and falling back gracefully on invalid schema or empty keys.

---

## 4. Privacy by Design

Privacy is a core architectural pillar of CarbonQuest:

- **No PII Stored**: No personal names, emails, addresses, or phone numbers are collected.
- **Local Browser Persistence**: All logged activities, level progress, unlocked achievements, and chat histories are stored strictly in the user's browser `localStorage`.
- **Zero Backend Logs with PII**: API requests to `/api/ai-coach` only transmit current context variables (streaks, today's metrics, diet, and transport preference) without any user identifiers, keeping them entirely anonymous.
