---
title: "macOS Platform SSO Registration Failed and Will Automatically Retry"
date: "2026-08-18"
category: "macOS"
tags:
  - macOS
  - Intune
  - Platform SSO
  - Microsoft Entra
  - Company Portal
  - Troubleshooting
excerpt: "Troubleshooting Microsoft Platform SSO registration failures on macOS when Intune enrollment is healthy but user registration becomes stuck."
---

# Problem

A macOS device that was previously working with Microsoft Platform SSO suddenly stops authenticating correctly.

Attempting to register the account again from **System Settings > Users & Groups > Microsoft Entra** results in:

> Single Sign-On for Mac  
> Registration failed and will automatically retry in a few minutes.

The device remains enrolled in Intune and appears healthy, but Platform SSO no longer functions correctly.

# Environment

- Microsoft Intune
- Microsoft Entra ID
- Company Portal
- Platform SSO
- macOS
- Automated Device Enrollment (ADE)

# Symptoms

- Platform SSO registration fails.
- Microsoft Entra account cannot be registered.
- Company Portal appears healthy.
- Device remains compliant and managed in Intune.
- SSO prompts repeatedly appear.
- Access to cloud or hybrid resources becomes inconsistent.

# Validation

## Verify Platform SSO Status

```bash
app-sso platform -s
```

Look for:

```text
state = POUserStateNeedsRegistration
```

## Verify Intune Enrollment

```bash
sudo profiles status -type enrollment
```

Expected:

```text
Enrolled via DEP: Yes
MDM enrollment: Yes (User Approved)
```

# Root Cause

The Microsoft Enterprise SSO Plug-in, AppSSOAgent, or Company Portal may become stuck in a stale registration state.

The device remains enrolled and compliant, but the user registration process cannot complete successfully.

# Resolution

Open Terminal and execute:

```bash
killall "Company Portal"
killall AppSSOAgent
killall Microsoft\ Enterprise\ SSO\ Plug-in
```

After a few seconds:

1. Reopen Company Portal.
2. Allow synchronization to complete.
3. Retry Platform SSO registration if required.

# Verification

```bash
app-sso platform -s
```

Confirm the registration state is no longer:

```text
POUserStateNeedsRegistration
```

# Additional Troubleshooting

## Check Enrollment Status

```bash
sudo profiles status -type enrollment
```

## Check Platform SSO Status

```bash
app-sso platform -s
```

## Watch Platform SSO Logs

```bash
log stream --info --debug --predicate 'subsystem CONTAINS "com.apple.AppSSO"'
```

## Collect Registration Events

```bash
log stream --info --debug --predicate '(process CONTAINS "Company Portal") OR (eventMessage CONTAINS[c] "registration")'
```

# Notes

If the device remains stuck in the registration state after restarting the processes above, verify:

- Device still exists in Entra ID
- Device is present in Intune
- Primary user assignment is correct
- Company Portal is signed in
- Platform SSO profile is still assigned and installed

Only consider re-enrollment after validating these items.

# References

- Add Microsoft Learn Platform SSO documentation link here
- Add Intune Platform SSO configuration article here
- Add Company Portal troubleshooting article here
