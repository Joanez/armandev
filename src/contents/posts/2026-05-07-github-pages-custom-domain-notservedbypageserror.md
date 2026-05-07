---
title: "Fix: GitHub Pages custom domain shows NotServedByPagesError"
date: "2026-05-07"
type: "Troubleshooting"
summary: "When GitHub Pages says your domain is not served (NotServedByPagesError), it’s almost always DNS A/CNAME misconfiguration or partial DNS propagation. Here’s the exact fix and how to verify."
tags: ["GitHub Pages", "DNS", "Vite", "Troubleshooting"]
products: ["GitHub Pages", "Custom Domain"]
errorCodes: ["NotServedByPagesError"]
---

## Problem
GitHub Pages shows:

- “Both **armandev.tech** and its alternate name are improperly configured”
- “Domain does not resolve to the GitHub Pages server”
- `NotServedByPagesError`

## Symptoms
- Site works on `username.github.io` or `username.github.io/repo`, but not on the custom domain.
- DNS checker tools show correct IPs in *some* regions but missing/incorrect results in others.
- GitHub Pages “Custom domain” does not validate, and HTTPS cannot be enforced yet.

## Root cause
One of these is happening:

1. **Apex/root DNS not pointing to GitHub Pages IPs**
2. **Using a CNAME at the root** (not supported by many DNS providers)
3. **Partial DNS propagation** (some resolvers updated, others not yet)
4. **Conflicting DNS records** (parking records, old A records, proxying)

## Fix (recommended DNS setup)
### Apex domain (armandev.tech)
Create *four* `A` records:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
