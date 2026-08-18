---
title: "macOS LAPS and Platform SSO Deployment Order in Hybrid Environments"
date: "2026-08-17"
category: "Intune"
tags: ["MacOS", "SSO", "Security", "Intune", "LAPS", "Platform SSO"]
excerpt: "Deploying macOS LAPS and Platform SSO together can cause enrollment inconsistencies in hybrid environments. This article documents the deployment sequence that resulted in reliable enrollment and successful Platform SSO registration."
author: "Armando Martinez"
---

# macOS LAPS and Platform SSO Deployment Order in Hybrid Environments

## Overview

While deploying Microsoft Intune macOS LAPS alongside Platform Single Sign-On (SSO) in a Hybrid Active Directory and Entra ID environment, I observed inconsistent enrollment behavior when both configurations were assigned simultaneously during provisioning.

After multiple tests, the issue was resolved by changing the deployment sequence.

---

## Environment

- Microsoft Intune
- macOS Platform SSO
- Hybrid Active Directory
- Microsoft Entra ID
- Company Portal
- macOS LAPS

---

## Problem

When the Platform SSO profile and macOS LAPS profile were deployed together during enrollment, Platform SSO registration frequently failed or remained incomplete.

### Symptoms

- Company Portal enrollment never fully completed
- Platform SSO registration did not trigger
- User account mapping issues
- Authentication prompts continued despite Platform SSO assignment

---

## Root Cause

During testing, Platform SSO appeared to depend on portions of the enrollment process that were not yet fully completed in a hybrid environment.

Deploying Platform SSO after the local administrator account creation, domain join, and first user sign-in resulted in a successful registration every time.

---

# Solution

## Step 1 - Deploy macOS LAPS First

Create the local administrator account using the Intune macOS LAPS policy1.

![macOS LAPS Configuration](/images/intune/macos-laps-sso/laps-configuration.png)

### LAPS Settings Used

- Create local admin account: Yes
- Admin account username: sonadm
- Admin account full name: Sonepar Admin
- Hide in Users & Groups: Yes
- Password rotation period: 1 Day
- Create local primary account: No

---

## Step 2 - Sign In With the Local Administrator Account

After enrollment finishes:

1. Sign in using the local administrator account.
2. Verify the account was created successfully.
3. Allow Intune policies to complete processing.

---

## Step 3 - Join the Hybrid Domain

Join the Mac to Active Directory.

Verify:

- Computer object creation
- Domain trust
- Connectivity to domain resources

---

## Step 4 - Restart the Device

Reboot the Mac after the domain join completes.

---

## Step 5 - Sign In With the Corporate User Account

Log in using the assigned user account.

Confirm:

- User profile creation
- Active Directory authentication
- Company Portal functionality

---

## Step 6 - Deploy Platform SSO

Only after the previous steps are complete should the Platform SSO configuration be assigned.

### Platform SSO Configuration

![Platform SSO Configuration](/images/intune/macos-laps-sso/platform-sso-configuration.png)

### Authentication URLs

```text
https://login.microsoftonline.com
https://login.microsoft.com
https://login.windows.net
```

### Important Settings

- Authentication Method: UserSecureEnclaveKey
- Enable Authorization: Enabled
- Create User At Login: Enabled
- Registration During Setup: Disabled
- FileVault Policy: AttemptAuthentication
- New User Authorization Mode: Standard
- User Authorization Mode: Standard
- Use Shared Device Keys: Enabled

---

## Additional Platform SSO Settings

![Additional Platform SSO Settings](/images/intune/macos-laps-sso/platform-sso-additional-settings.png)

### Extension Settings

- Team Identifier: UBF8T346G9
- Extension Identifier: com.microsoft.CompanyPortalMac.ssoextension
- Type: Redirect

### Additional Keys

- AppPrefixAllowList = com.microsoft.,com.apple.
- disable_explicit_app_prompt = 1
- browser_sso_interaction_enabled = 1

---

## Validation

### LAPS Validation

✅ Local administrator account created

✅ Password visible in Intune

✅ Password rotation functioning correctly

### Platform SSO Validation

✅ Company Portal enrollment completed

✅ Platform SSO registration successful

✅ User account mapping successful

✅ Reduced authentication prompts

✅ Improved Microsoft 365 sign-in experience

---

## Working Deployment Sequence

```text
macOS LAPS Deployment
          ↓
Login with Local Administrator
          ↓
Hybrid Domain Join
          ↓
Restart Device
          ↓
Login with User Account
          ↓
Platform SSO Deployment
          ↓
Company Portal Registration Completes
```

---

## Lessons Learned

Although both features work independently, assigning Platform SSO too early in the deployment process can result in incomplete registration in hybrid environments.

Delaying Platform SSO until after the domain join and first user sign-in consistently produced successful results during testing.

## Conclusion

For hybrid macOS deployments managed through Intune, deploy macOS LAPS first, complete the Active Directory join process, and assign Platform SSO only after the device has been fully onboarded.

This deployment order resulted in successful LAPS management, successful Platform SSO registration, and proper Company Portal enrollment.

---

## Common Issues

### Platform SSO registration fails after a macOS update

In some cases, Platform SSO may stop working after a macOS update even though:

- The device remains enrolled in Intune
- Company Portal is still installed
- The Platform SSO profile is present
- The device remains compliant

Symptoms may include:

- "POUserStateNeedsRegistration"
- "Registration failed and will automatically retry"
- "Code=-1004"
- Missing Platform SSO user configuration

➡️ ![Fix: Platform SSO Registration Failed After macOS Update](/src/contents/posts/fix-platform-sso-registration-failed)
