---
title: "Audit Entra ID Authentication Methods by Group with PowerShell"
date: "2026-09-29"
category: "Entra ID"
tags:
  - Microsoft Entra
  - Microsoft Graph
  - PowerShell
  - MFA
  - Windows Hello for Business
  - Passwordless
  - SSPR
  - Power BI
  - Excel
excerpt: "Using Microsoft Graph PowerShell to audit MFA, passwordless, Windows Hello for Business, and SSPR registration for specific Entra ID groups, then analyzing the results in Excel or Power BI."
---

# Problem

Microsoft Entra ID provides authentication registration reporting, but it is **tenant-wide**. That works for an overall security posture review, but not for the targeted questions that come up during real projects:

- Is this pilot group ready before a Conditional Access policy is enforced?
- Which users in this department still have not registered MFA?
- How many users in the deployment group have Windows Hello for Business?
- Are privileged accounts protected with strong methods?
- Which office or company has the lowest adoption?
- Which users are ready for Self-Service Password Reset?

Answering these from the portal means exporting the full tenant and filtering manually every time.

![Report Overview](/images/EntraID/Entra_Auth_Methods.png)

> **Script download:** [Authentication_Methods_Report.ps1](https://github.com/Joanez/m365-cloud-architecture-lab/blob/main/EntraID/Authentication_Methods_Report.ps1)

# Environment

- Microsoft Entra ID
- Microsoft Graph PowerShell SDK
- Graph report: `/reports/authenticationMethods/userRegistrationDetails`
- PowerShell 7 or Windows PowerShell 5.1
- Microsoft Excel / Power BI Desktop

# Solution Overview

The script:

1. Retrieves users from one or more Entra ID groups.
2. Enriches each user with profile attributes (company, office, job title).
3. Pages through the tenant-wide authentication registration report and keeps only users from the target groups.
4. Exports one row per user per registered method to CSV for Excel or Power BI.

# Why This Can Be Confusing

A few things tripped me up while building and reading this report:

- **One user, multiple rows.** A user with Authenticator and Windows Hello for Business appears twice. Using `COUNTROWS` or a normal count inflates user numbers. User metrics must use a **distinct count** of `UserId`.
- **Capable vs registered.** `IsMfaCapable` and `IsMfaRegistered` are not the same thing. Capable also depends on the method being allowed by policy, so a user can be registered but not capable.
- **Registered is not used.** The report shows what a user *has registered*, not what they *actually use* at sign-in. For usage, the sign-in logs are the source.
- **`LastUpdatedDateTime` is not "last used".** It reflects when the report record was refreshed, not the last time a method was used.
- **Users missing from the output.** Group members can be absent from the registration report, which makes totals from the group and the CSV not match.
- **Nested groups are ignored.** Direct membership only. A group that contains other groups silently returns fewer users than expected.
- **Method names are raw values.** Graph returns values like `windowsHelloForBusiness` or `microsoftAuthenticatorPush`, which the script converts to readable labels.

# Prerequisites

## Install the Modules

```powershell
Install-Module Microsoft.Graph.Authentication -Scope CurrentUser
Install-Module Microsoft.Graph.Users -Scope CurrentUser
Install-Module Microsoft.Graph.Groups -Scope CurrentUser
```

## Required Scopes

```powershell
Connect-MgGraph -Scopes "Group.Read.All","GroupMember.Read.All","User.Read.All","AuditLog.Read.All"
```

The account running the script also needs an Entra role that can read authentication reports, such as **Reports Reader**, **Security Reader**, or **Global Reader**.

# Configuration

Add the object IDs of the groups to audit:

```powershell
$GroupIds = @(
    "00000000-0000-0000-0000-000000000000",
    "11111111-1111-1111-1111-111111111111"
)
```

Group object IDs are available in **Entra admin center > Entra ID > Groups > All groups > [group] > Object ID**.

# How the Script Works

## 1. Collect Group Members

Direct user members are retrieved from each group, duplicates are removed, and a hashtable is built for fast lookups:

```powershell
$groupUsers = @{}

foreach ($groupId in $GroupIds) {
    Get-MgGroupMember -GroupId $groupId -All |
        Where-Object { $_.AdditionalProperties.'@odata.type' -eq '#microsoft.graph.user' } |
        ForEach-Object { $groupUsers[$_.Id] = $true }
}

Write-Output "Unique users in target groups: $($groupUsers.Count)"
```

For nested groups, use transitive membership instead:

```powershell
Get-MgGroupTransitiveMember -GroupId $groupId -All
```

## 2. Enrich User Profiles

```powershell
$user = Get-MgUser -UserId $userId `
    -Property Id,DisplayName,UserPrincipalName,Mail,GivenName,Surname,JobTitle,OfficeLocation,CompanyName
```

## 3. Page Through the Registration Report

The endpoint is tenant-wide, so every page is processed and filtered locally:

```powershell
$uri = "https://graph.microsoft.com/v1.0/reports/authenticationMethods/userRegistrationDetails"
$registrationReport = @()

do {
    $response = Invoke-MgGraphRequest -Method GET -Uri $uri
    $registrationReport += $response.value | Where-Object { $groupUsers.ContainsKey($_.id) }
    $uri = $response.'@odata.nextLink'
} while ($uri)
```

## 4. Export

Each registered method becomes its own row. The export folder is chosen by operating system:

| OS | Export folder |
|---|---|
| Windows | `C:\Temp` |
| macOS | `~/Downloads` |
| Linux | `~/tmp` |

Output file:

```text
Group_UserAuthMethods.csv
```

# Running the Script

```powershell
./Authentication_Methods_Report.ps1
```

The console shows progress for group retrieval, profile lookup, report paging, and export, followed by the export path and a count per authentication method.

# Output Structure

## User Columns

`Username`, `Email`, `FirstName`, `LastName`, `DisplayName`, `JobTitle`, `OfficeLocation`, `CompanyName`, `UserId`

## Authentication Columns

| Column | Meaning |
|---|---|
| `AuthMethodType` | Registered method (one per row) |
| `IsAdmin` | User holds an admin role |
| `IsMfaCapable` | Registered a strong method that is allowed by policy |
| `IsMfaRegistered` | Registered a method that can satisfy MFA |
| `IsPasswordlessCapable` | Registered a passwordless method allowed by policy |
| `IsSsprCapable` / `IsSsprEnabled` / `IsSsprRegistered` | SSPR readiness |
| `IsSystemPreferredEnabled` / `SystemPreferredAuthMethod` | System-preferred MFA status |
| `LastUpdatedDateTime` | Report record refresh time, not last use |

## Example Rows

```text
Username               AuthMethodType               IsMfaRegistered  IsPasswordlessCapable
--------               --------------               ---------------  ---------------------
jdoe@domain.com        Microsoft Authenticator      True             True
jdoe@domain.com        Windows Hello for Business   True             True
asmith@domain.com      Mobile Phone                 True             False
bnguyen@domain.com                                  False            False
```

`jdoe` is **one user with two rows**. `bnguyen` has no registered method and needs follow-up.

# Validation

## Find Group Members Missing from the Report

Run this after the main loop, reusing `$registrationReport` collected during paging:

```powershell
$reportedIds = $registrationReport.id
$missing = $groupUsers.Keys | Where-Object { $_ -notin $reportedIds }

$missing | ForEach-Object {
    Get-MgUser -UserId $_ -Property DisplayName,UserPrincipalName,AccountEnabled,UserType |
        Select-Object DisplayName,UserPrincipalName,AccountEnabled,UserType
}
```

## Validate a Single User

```powershell
$upn = "user@domain.com"
$id  = (Get-MgUser -UserId $upn).Id

Invoke-MgGraphRequest -Method GET `
  -Uri "https://graph.microsoft.com/v1.0/reports/authenticationMethods/userRegistrationDetails/$id" |
  Select-Object userPrincipalName, isMfaRegistered, isPasswordlessCapable, methodsRegistered
```

Compare the result with the user's **Authentication methods** blade in Entra.

## Check the Totals

Unique users in the CSV plus users in `$missing` should equal `$groupUsers.Count`.

# Using the Data in Excel

## Import

1. **Data > From Text/CSV**.
2. Select `Group_UserAuthMethods.csv`.
3. Choose **Transform Data** and set Boolean and date types.
4. **Close & Load**.

## PivotTables

When creating the PivotTable, check **Add this data to the Data Model**. Otherwise the **Distinct Count** option is not available.

| Purpose | Rows | Columns | Values |
|---|---|---|---|
| MFA registration | `CompanyName` or `OfficeLocation` | `IsMfaRegistered` | Distinct count of `UserId` |
| Method distribution | `AuthMethodType` | - | Distinct count of `UserId` |
| Passwordless readiness | `OfficeLocation` | `IsPasswordlessCapable` | Distinct count of `UserId` |

## Remediation Filters

- `IsMfaRegistered = False`
- `IsPasswordlessCapable = False`
- `IsAdmin = True`
- `AuthMethodType` is blank
- `IsSsprRegistered = False`

# Using the Data in Power BI

## Import

1. **Get data > Text/CSV**.
2. Select `Group_UserAuthMethods.csv`, then **Transform Data**.
3. Confirm Boolean and date types.
4. Rename the table to `AuthenticationRegistration`.
5. **Close & Apply**.

## DAX Measures

All user measures use `DISTINCTCOUNT` because of the one-row-per-method structure.

```DAX
Total Users =
DISTINCTCOUNT(AuthenticationRegistration[UserId])
```

```DAX
MFA Registered Users =
CALCULATE(
    DISTINCTCOUNT(AuthenticationRegistration[UserId]),
    AuthenticationRegistration[IsMfaRegistered] = TRUE()
)
```

```DAX
MFA Adoption % =
DIVIDE([MFA Registered Users], [Total Users], 0)
```

```DAX
Passwordless Capable Users =
CALCULATE(
    DISTINCTCOUNT(AuthenticationRegistration[UserId]),
    AuthenticationRegistration[IsPasswordlessCapable] = TRUE()
)
```

```DAX
Passwordless Adoption % =
DIVIDE([Passwordless Capable Users], [Total Users], 0)
```

```DAX
Windows Hello Users =
CALCULATE(
    DISTINCTCOUNT(AuthenticationRegistration[UserId]),
    AuthenticationRegistration[AuthMethodType] = "Windows Hello for Business"
)
```

```DAX
Users Missing MFA =
CALCULATE(
    DISTINCTCOUNT(AuthenticationRegistration[UserId]),
    AuthenticationRegistration[IsMfaRegistered] = FALSE()
)
```

## Recommended Visuals

| Visual | Content |
|---|---|
| Cards | Total users, MFA adoption, passwordless adoption, SSPR registration |
| Bar chart | Distinct users by authentication method |
| Stacked column | MFA registration by company |
| Matrix | Office location by readiness status |
| Donut | Passwordless capable vs not capable |
| Table | Users requiring remediation |
| Slicers | Company, office, job title, method, admin status |

# Operational Value

- Contact users who have not registered MFA before enforcement.
- Validate pilot group readiness before enabling Conditional Access.
- Measure Windows Hello for Business adoption after deployment.
- Track passwordless progress by business unit.
- Prioritize admin accounts without strong authentication.
- Identify users not ready for SSPR.
- Give management measurable adoption trends.

# Notes

- The report endpoint is tenant-wide; large tenants take longer because filtering happens locally after each page.
- Direct membership is used by default. Switch to `Get-MgGroupTransitiveMember` for nested groups.
- Registration data shows capability, not actual sign-in usage.
- `LastUpdatedDateTime` is report metadata, not a last-used date.
- Access depends on both Graph scopes and the Entra role of the account running the script.

# References

- [authenticationMethodsRoot: userRegistrationDetails - Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/authenticationmethodsroot-list-userregistrationdetails)
- [userRegistrationDetails resource type - Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/resources/userregistrationdetails)
- [Authentication Methods Activity - Microsoft Entra](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-methods-activity)
