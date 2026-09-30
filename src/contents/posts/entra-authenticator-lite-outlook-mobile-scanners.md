---
title: "Microsoft Authenticator Showing on Devices Where It Is Not Installed"
date: "2026-09-30"
category: "Entra ID"
tags:
  - Microsoft Entra
  - MFA
  - Authentication Methods
  - Authenticator Lite
  - Outlook Mobile
  - Microsoft Graph
  - PowerShell
  - Troubleshooting
excerpt: "Investigating why rugged Android scanners appear as Microsoft Authenticator methods in Entra ID when the Authenticator app was never installed, and how to trace, clean up, and prevent Authenticator Lite registrations from Outlook mobile."
---

# Problem

A user's **Authentication methods** blade in Microsoft Entra ID lists several rugged Android scanners (for example, Zebra TC52X and Honeywell CT70) as **Microsoft Authenticator** methods.

The Microsoft Authenticator app is **not installed** on these devices. They are managed through a third-party MDM with a controlled app list, and Authenticator was never deployed to them.

The question from the business was simple:

> Why does Entra show Microsoft Authenticator on the scanners if the app is not installed?

# Environment

- Microsoft Entra ID
- Microsoft Authenticator / Authentication methods policy
- Outlook mobile (Android)
- Rugged Android scanners (Zebra TC52X, Honeywell CT70)
- Third-party MDM for scanner management
- Microsoft Graph PowerShell SDK

# Symptoms

The user's authentication methods show entries similar to:

| Authentication method | Detail |
|---|---|
| Phone number | Primary mobile |
| Microsoft Authenticator | iPhone |
| Microsoft Authenticator - Outlook Mobile | CT70 |
| Microsoft Authenticator - Outlook Mobile | TC52X |
| Microsoft Authenticator - Outlook Mobile | TC52X |
| Microsoft Authenticator | iPhone 16 Pro |
| Passkey | Authenticator - iOS |
| Windows Hello for Business | Workstation |

- Scanner models are listed as Microsoft Authenticator methods.
- The Authenticator app is not installed on the scanners.
- The device inventory in the MDM confirms Authenticator is absent.
- MFA prompts may be delivered to a shared scanner instead of the user's phone.

# Why This Was Confusing

This one took longer than expected because every signal pointed in the wrong direction:

- **The method is named "Microsoft Authenticator".** The portal groups it under Authenticator, so the natural assumption is that the Authenticator app is installed somewhere.
- **The app inventory contradicts the portal.** The MDM shows no Authenticator app on the scanners, so it looks like either Entra or the MDM is wrong.
- **The "- Outlook Mobile" suffix is easy to overlook.** It is the only hint in the portal, and it reads like a label rather than the actual source of the registration.
- **Nobody registered anything on purpose.** Outlook mobile can register itself as an MFA method automatically, without the user going through the security info registration page.
- **The feature was enabled for us.** Authenticator Lite is controlled by a *Microsoft managed* setting, which Microsoft changed to enabled. No admin in the tenant made a change.
- **The creation date is empty.** Graph returns a blank `createdDateTime` for these entries, so you cannot easily tell when the registration happened.
- **The sign-in logs were already gone.** The last use was months earlier, beyond the default 30-day Entra sign-in log retention.

My first theory was that users installed Authenticator on the scanners before they were locked down. That was wrong. The real source was Outlook.

# Root Cause

The entries are created by **Authenticator Lite**, an MFA capability built into **Outlook mobile**.

When a user signs into Outlook on an Android or iOS device, Outlook can register itself as a push notification and TOTP method for that user. Entra then lists it as **Microsoft Authenticator - Outlook Mobile** with the device model as the detail.

Key points:

- Authenticator Lite is controlled in the Authentication methods policy under **Microsoft Authenticator on companion applications**.
- The default state is **Microsoft managed**, and the Microsoft-managed value is now **enabled**.
- Users of Outlook mobile in **shared device mode** are not eligible for Authenticator Lite.

In this case, users had signed into Outlook on shared scanners, and Outlook registered those scanners as MFA methods.

# Validation

## Connect to Microsoft Graph

```powershell
Connect-MgGraph -Scopes "UserAuthenticationMethod.Read.All"
```

## Check Which App Registered the Method

```powershell
$upn = "user@domain.com"

Invoke-MgGraphRequest -Method GET `
  -Uri "https://graph.microsoft.com/beta/users/$upn/authentication/microsoftAuthenticatorMethods" |
  Select-Object -ExpandProperty value |
  ForEach-Object { [PSCustomObject]$_ } |
  Select-Object displayName, clientAppName, phoneAppVersion, createdDateTime, lastUsedDateTime
```

Example output:

```text
displayName      : TC52X
clientAppName    : outlookMobile
phoneAppVersion  : 5.2613.1
createdDateTime  :
lastUsedDateTime : 4/27/2026 1:15:47 PM
```

How to read it:

| Property | Meaning |
|---|---|
| `displayName` | Device model reported by the app |
| `clientAppName` | `outlookMobile` confirms Authenticator Lite; `microsoftAuthenticator` would be the real app |
| `phoneAppVersion` | Outlook mobile build, not an Authenticator version |
| `createdDateTime` | Only populated for passwordless phone sign-in registrations, so it is usually blank here |
| `lastUsedDateTime` | Last time the method was used to satisfy MFA (beta only) |

**`clientAppName : outlookMobile` is the proof.** The Authenticator app was never involved.

# Resolution

## 1. Remove the Existing Registrations

Portal:

1. Go to **Entra ID > Users > [user] > Authentication methods**.
2. Delete each **Microsoft Authenticator - Outlook Mobile** entry tied to a scanner.

PowerShell (requires `UserAuthenticationMethod.ReadWrite.All`):

```powershell
Connect-MgGraph -Scopes "UserAuthenticationMethod.ReadWrite.All"

$upn = "user@domain.com"
$scannerModels = @("TC52X", "CT70")

$methods = (Invoke-MgGraphRequest -Method GET `
  -Uri "https://graph.microsoft.com/beta/users/$upn/authentication/microsoftAuthenticatorMethods").value

foreach ($m in $methods) {
    if ($m.clientAppName -eq "outlookMobile" -and $scannerModels -contains $m.displayName) {
        Write-Output "Removing $($m.displayName) ($($m.id))"
        Invoke-MgGraphRequest -Method DELETE `
          -Uri "https://graph.microsoft.com/beta/users/$upn/authentication/microsoftAuthenticatorMethods/$($m.id)"
    }
}
```

## 2. Prevent New Registrations

1. Go to **Entra ID > Authentication methods > Policies > Microsoft Authenticator**.
2. Open **Configure**.
3. Set **Microsoft Authenticator on companion applications** to either:
   - **Disabled**, or
   - **Enabled** with an **exclude** group containing scanner or shared-device users.
4. Save.

This requires the **Authentication Policy Administrator** role or higher.

## 3. Long-Term Fix for Shared Devices

If the scanners are shared, configure Outlook mobile in **shared device mode**. Authenticator Lite does not register in that mode.

# Verification

Re-run the validation query for the user:

```powershell
Invoke-MgGraphRequest -Method GET `
  -Uri "https://graph.microsoft.com/beta/users/$upn/authentication/microsoftAuthenticatorMethods" |
  Select-Object -ExpandProperty value |
  ForEach-Object { [PSCustomObject]$_ } |
  Where-Object clientAppName -eq "outlookMobile" |
  Select-Object displayName, lastUsedDateTime
```

Expected: no scanner models returned.

# Additional Troubleshooting

## Report All Outlook Mobile Registrations in the Tenant

Useful for finding how many users have Authenticator Lite registered on scanners or other unexpected devices.

```powershell
Connect-MgGraph -Scopes "User.Read.All","UserAuthenticationMethod.Read.All"

$users = Get-MgUser -All -Filter "accountEnabled eq true" -Property Id,UserPrincipalName
$report = foreach ($u in $users) {
    $methods = (Invoke-MgGraphRequest -Method GET `
      -Uri "https://graph.microsoft.com/beta/users/$($u.Id)/authentication/microsoftAuthenticatorMethods").value

    foreach ($m in $methods | Where-Object { $_.clientAppName -eq "outlookMobile" }) {
        [PSCustomObject]@{
            UserPrincipalName = $u.UserPrincipalName
            Device            = $m.displayName
            OutlookVersion    = $m.phoneAppVersion
            LastUsed          = $m.lastUsedDateTime
        }
    }
}

$report | Sort-Object Device, UserPrincipalName | Format-Table -AutoSize
$report | Export-Csv ".\AuthenticatorLite_Report.csv" -NoTypeInformation
```

For large tenants, scope `$users` to a group or department to avoid long run times and throttling.

## Check Recent Registration Events in the Audit Log

Covers the last 30 days only.

```powershell
Connect-MgGraph -Scopes "AuditLog.Read.All"

Get-MgAuditLogDirectoryAudit -All `
  -Filter "loggedByService eq 'Authentication Methods'" |
  Where-Object { $_.TargetResources.UserPrincipalName -contains "user@domain.com" } |
  Select-Object ActivityDateTime, ActivityDisplayName, Result |
  Sort-Object ActivityDateTime -Descending
```

## Check Which Method Satisfied MFA

In **Entra ID > Monitoring & health > Sign-in logs**, open a sign-in and review **Authentication Details**. This shows whether MFA was approved through Outlook mobile.

# Notes

- Entra sign-in logs are retained for **30 days** by default. If the last use is older and logs are not exported to Log Analytics or a SIEM, the exact sign-in event cannot be reviewed from Entra.
- For older events, the Purview unified audit log (up to 180 days with Audit Standard) or Exchange mobile device records can help, but require Exchange or Purview access.
- `lastUsedDateTime` is only available on the Graph **beta** endpoint.
- Removing the method does not remove Outlook from the device. Without the policy change, Outlook can register again at the next sign-in.

## Summary for Non-Technical Stakeholders

> The Microsoft Authenticator app is not installed on the scanners. The entry is created by Outlook mobile, which includes a built-in Microsoft MFA feature called Authenticator Lite. When a user signed into Outlook on the scanner, Outlook registered itself as an MFA method, and Entra lists it under "Microsoft Authenticator - Outlook Mobile." The registrations were removed and the feature was disabled for scanner users.

# References

- [Enable Authenticator Lite for Outlook mobile - Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-authenticator-lite)
- [Sign-in event details for Microsoft Entra multifactor authentication - Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-mfa-reporting)
- [microsoftAuthenticatorAuthenticationMethod resource type - Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/resources/microsoftauthenticatorauthenticationmethod)
