import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "./models/Article.js";

dotenv.config();

const articles = [
  // ─── ATTACK LABS ───────────────────────────────────────────────────────────
  {
    title: "SQL Injection: Authentication Bypass",
    slug: "sql-injection-auth-bypass",
    category: "attack",
    difficulty: "beginner",
    description: "Exploit a vulnerable login form using SQL injection to bypass authentication entirely.",
    content: `# SQL Injection: Authentication Bypass

SQL injection is the #1 web vulnerability. When login forms concatenate user input directly into SQL queries, attackers can manipulate the query logic to bypass authentication.

## How It Works

A vulnerable login query looks like this:
\`\`\`sql
SELECT * FROM users WHERE username = 'INPUT' AND password = 'INPUT'
\`\`\`
If the app doesn't sanitize input, you can inject SQL to change the query's meaning.

## Key Payloads

\`\`\`sql
-- Always-true bypass
' OR '1'='1

-- Comment out the password check
admin'--
' OR 1=1--

-- Union-based data extraction
' UNION SELECT username, password FROM users--
\`\`\`

## Step-by-Step Attack

1. Enter \`admin'--\` as the username, anything as password
2. The query becomes: \`SELECT * FROM users WHERE username = 'admin'--' AND password = '...'\`
3. Everything after \`--\` is a comment — password check is skipped
4. You're logged in as admin

## What to Look For

- Error messages revealing database type (MySQL, PostgreSQL)
- Different responses for \`' OR 1=1--\` vs normal input
- Slow responses on time-based blind SQLi

## Prevention

1. **Parameterized queries** — Never concatenate user input into SQL
2. **ORM usage** — Sequelize, Mongoose, Hibernate handle escaping
3. **Input validation** — Reject unexpected characters
4. **Least privilege** — DB user should only have SELECT on needed tables
5. **WAF** — Block common SQLi patterns at the edge

## Practice Lab

Try bypassing the login form in our [SQL Injection Lab](/lab/sql-injection).`,
    tags: ["sql-injection", "authentication", "owasp", "web-security"],
    readTime: 8,
    author: "CyberSim Team",
    practiceLink: "/lab/sql-injection"
  },
  {
    title: "Cloud Data Breach: Exposed Storage Buckets",
    slug: "cloud-data-breach-exposed-storage",
    category: "attack",
    difficulty: "beginner",
    description: "Discover and exploit misconfigured cloud storage buckets to access sensitive data.",
    content: `# Cloud Data Breach: Exposed Storage Buckets

Misconfigured cloud storage is one of the most common causes of data breaches. Billions of records have been exposed through publicly accessible S3 buckets, Azure Blobs, and GCS buckets.

## Why This Happens

Cloud storage is private by default — but one misconfigured policy makes it world-readable. Developers often enable public access for convenience and forget to revert it.

## Discovery Techniques

\`\`\`bash
# Check if a bucket is publicly accessible
curl -s https://company-backup.s3.amazonaws.com/

# Enumerate bucket contents
aws s3 ls s3://company-backup --no-sign-request

# Google dorking for exposed buckets
site:s3.amazonaws.com "company-name"
\`\`\`

## What Attackers Find

- Customer PII (names, emails, SSNs, credit cards)
- Employee records and salary data
- API keys and database credentials
- Internal configuration files
- Backup files with full database dumps

## Attack Flow in This Lab

1. Probe the storage endpoint with \`public\` or \`storage\` in the path
2. Enumerate available buckets
3. Access sensitive data without authentication
4. Capture the flag from the exposed data

## Prevention

1. **Block public access** — Enable "Block All Public Access" at account level
2. **Bucket policies** — Explicitly deny \`s3:GetObject\` to \`*\`
3. **Encryption** — AES-256 at rest so breached data is unreadable
4. **Access logging** — CloudTrail + S3 access logs
5. **Regular audits** — Automated tools like AWS Config, Prowler

## Practice Lab

Exploit exposed storage in our [Data Breach Lab](/lab/data-breach).`,
    tags: ["cloud", "s3", "data-breach", "misconfiguration", "idor"],
    readTime: 9,
    author: "CyberSim Team",
    practiceLink: "/lab/data-breach"
  },
  {
    title: "Account Hijacking via Brute Force",
    slug: "account-hijacking-brute-force",
    category: "attack",
    difficulty: "beginner",
    description: "Exploit missing rate limiting to brute force admin credentials and hijack accounts.",
    content: `# Account Hijacking via Brute Force

When authentication endpoints have no rate limiting, attackers can try thousands of password combinations per second until they find valid credentials.

## The Vulnerability

Most login forms are vulnerable if they:
- Don't limit failed attempts per IP
- Don't implement account lockout
- Don't require CAPTCHA after failures
- Use weak or default passwords

## Attack Techniques

### Dictionary Attack
\`\`\`bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"
\`\`\`

### Credential Stuffing
Use leaked username/password pairs from previous breaches:
\`\`\`bash
# ~65% of users reuse passwords across sites
ffuf -w leaked_creds.txt -X POST -d "username=FUZZ" -u http://target.com/login
\`\`\`

## Common Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| Admin panels | admin | admin123 |
| Routers | admin | password |
| Databases | root | (empty) |
| Jenkins | admin | admin |

## Attack Flow in This Lab

1. Try \`admin\` as username with common passwords
2. The endpoint has no rate limiting — send multiple attempts
3. Try \`admin:admin123\` — a common default credential
4. Session is hijacked once authenticated

## Prevention

1. **Rate limiting** — Max 5 attempts per 15 minutes per IP
2. **Account lockout** — Lock after 5 failures, notify user
3. **MFA** — Even correct credentials need a second factor
4. **CAPTCHA** — Slow down automated tools
5. **Strong password policy** — Minimum 12 chars, complexity required

## Practice Lab

Exploit missing rate limiting in our [Account Hijacking Lab](/lab/account-hijacking).`,
    tags: ["brute-force", "authentication", "rate-limiting", "credential-stuffing"],
    readTime: 8,
    author: "CyberSim Team",
    practiceLink: "/lab/account-hijacking"
  },
  {
    title: "Security Misconfiguration: Broken Access Control",
    slug: "security-misconfiguration-broken-access",
    category: "attack",
    difficulty: "intermediate",
    description: "Exploit exposed admin routes and missing RBAC to escalate privileges and delete data.",
    content: `# Security Misconfiguration: Broken Access Control

Security misconfiguration is the most common vulnerability in the OWASP Top 10. Admin routes left unprotected, debug mode enabled in production, and default credentials unchanged are all examples.

## Common Misconfigurations

- Admin endpoints accessible without authentication
- Debug mode enabled in production (exposes stack traces, config)
- CORS set to \`*\` (any origin can make requests)
- Default credentials unchanged
- Unnecessary HTTP methods enabled (PUT, DELETE on read-only endpoints)

## Broken Access Control

When role checks are missing, any user can access admin functionality:

\`\`\`http
# Normal user accessing admin endpoint — should be 403, but isn't
GET /api/admin/deleteAllUsers HTTP/1.1
Authorization: Bearer <regular_user_token>

HTTP/1.1 200 OK
{"deleted": 1247}
\`\`\`

## Attack Flow in This Lab

1. Probe \`/api/admin/config\` — no auth check, config exposed
2. Try \`/api/admin/deleteAllUsers\` — executes without role validation
3. Access debug endpoints to find internal architecture
4. Escalate from regular user to admin-level actions

## OWASP Broken Access Control Examples

- Viewing another user's account by changing the ID in the URL
- Accessing admin pages as a regular user
- Performing privileged actions via API manipulation
- Bypassing access control checks by modifying JWT claims

## Prevention

1. **RBAC** — Define roles (admin, user, guest) and enforce on every route
2. **Middleware** — Auth + role check on every protected endpoint
3. **Deny by default** — Require explicit permission grants
4. **Disable debug mode** — Never in production
5. **Security headers** — Restrict CORS to known origins

## Practice Lab

Exploit misconfigured routes in our [Misconfiguration Lab](/lab/misconfiguration).`,
    tags: ["misconfiguration", "rbac", "access-control", "privilege-escalation", "owasp"],
    readTime: 10,
    author: "CyberSim Team",
    practiceLink: "/lab/misconfiguration"
  },
