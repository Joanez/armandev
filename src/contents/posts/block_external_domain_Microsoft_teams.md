---
title: "Block External Domains in Microsoft Teams Federation"
date: 2026-09-04
author: "Armando Martinez"
excerpt: "Discover external Teams federation domains, build an approved allow list, and restrict communications to trusted organizations using Microsoft Teams PowerShell."
tags:
  - Microsoft Teams
  - Microsoft 365
  - Security
  - PowerShell
  - Teams Federation
  - Collaboration
category: "Microsoft Teams"
header_image: "/images/m365/teams-federation-control/header.png"
---

# Block External Domains in Microsoft Teams Federation

## Overview

Microsoft Teams federation enables users to communicate with people outside their organization using Teams chat, calling, and meetings. While this improves collaboration, many organizations prefer to limit communications to approved partners, suppliers, and vendors.

This solution helps identify external domains currently communicating with your organization and restrict Teams federation to an approved allow list.

## Objectives

- Discover external domains communicating with your organization.
- Build a list of approved domains.
- Restrict federation to approved organizations only.
- Maintain and update the allow list when new business partners are onboarded.
- Improve governance and security of external communications.

---

# Environment

### Required Modules

```powershell
Install-Module ExchangeOnlineManagement -Scope CurrentUser
Install-Module MicrosoftTeams -Scope CurrentUser
```

### Required Permissions

The account performing these actions should have permissions to:

- Search the Microsoft 365 Unified Audit Log
- Connect to Exchange Online
- Connect to Microsoft Teams PowerShell
- Modify Teams federation settings

---

# Step 1 - Discover External Domains

The first step is determining which external organizations are currently communicating with your users.

Connect to Exchange Online:

```powershell
Connect-ExchangeOnline
```

Search the Unified Audit Log for Teams activities during the last 90 days:

```powershell
Search-UnifiedAuditLog `
-StartDate (Get-Date).AddDays(-90) `
-EndDate (Get-Date) `
-RecordType MicrosoftTeams `
-ResultSize 5000 |
ForEach-Object {
    ($_.AuditData | ConvertFrom-Json).ParticipantInfo.ParticipatingDomains
} |
Where-Object {
    $_ -and $_ -notlike "contoso.com"
} |
Sort-Object -Unique
```

### Example Output

```text
vendor1.com
supplier.ca
partnercompany.com
```

Review the results and validate which domains should remain authorized for business communications.

---

# Step 2 - Create an Approved Domain List

Create a CSV file containing the approved external domains.

## TeamsAllowedDomains.csv

```csv
Domain
vendor1.com
supplier.ca
partnercompany.com
```

Import the approved domains into PowerShell:

```powershell
[string[]]$AllowedDomains = (
    Import-Csv -Path "C:\Temp\TeamsAllowedDomains.csv"
).Domain.Trim().ToLower() |
Sort-Object -Unique
```

---

# Step 3 - Connect to Microsoft Teams

```powershell
Connect-MicrosoftTeams
```

Verify connectivity:

```powershell
Get-CsTenantFederationConfiguration
```

---

# Step 4 - Apply Federation Restrictions

Once the approved domains have been validated, configure Teams federation to allow only those domains.

```powershell
Set-CsTenantFederationConfiguration `
-AllowedDomainsAsAList $AllowedDomains
```

This configuration switches Teams federation from an open federation model to an allow-list model.

---

# Step 5 - Verify Configuration

Display all approved domains currently configured:

```powershell
(Get-CsTenantFederationConfiguration).AllowedDomains.AllowedDomain
```

Example:

```text
domain=vendor1.com
domain=supplier.ca
domain=partnercompany.com
```

Review overall federation settings:

```powershell
Get-CsTenantFederationConfiguration |
Select-Object AllowFederatedUsers, AllowTeamsConsumer
```

Example Output:

```text
AllowFederatedUsers : True
AllowTeamsConsumer  : False
```

---

# Adding a New Domain Without Overwriting Existing Entries

A common mistake is replacing the entire allow list when onboarding a new partner. The following approach preserves existing entries and adds the new domain safely.

```powershell
$NewDomain = "newpartner.com"

[string[]]$CurrentDomains = (
    Get-CsTenantFederationConfiguration
).AllowedDomains.AllowedDomain |
ForEach-Object {
    $_ -replace '^domain=', '' |
    ForEach-Object {
        $_.Trim().ToLower()
    }
}

$RegexPattern = '^[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+$'

[string[]]$UpdatedDomains = (
    $CurrentDomains + $NewDomain
) |
Where-Object {
    $_ -and $_ -match $RegexPattern
} |
Sort-Object -Unique

Set-CsTenantFederationConfiguration `
-AllowedDomainsAsAList $UpdatedDomains
```

Verify the update:

```powershell
(Get-CsTenantFederationConfiguration).AllowedDomains.AllowedDomain
```

---

# Export Existing Allowed Domains

If you need to audit or document the current configuration:

```powershell
(Get-CsTenantFederationConfiguration).AllowedDomains.AllowedDomain |
ForEach-Object {
    [PSCustomObject]@{
        Domain = ($_ -replace '^domain=', '')
    }
} |
Export-Csv `
-Path "C:\Temp\TeamsFederationDomains.csv" `
-NoTypeInformation
```

---

# Security Benefits

### Reduced Attack Surface

External communications are restricted to trusted organizations only.

### Improved Governance

Business relationships can be reviewed and approved before federation is enabled.

### Better Visibility

Approved domains can be documented and audited easily.

### Simplified Compliance

Organizations maintain tighter control over external collaboration channels.

---

# Operational Recommendations

- Review allowed domains quarterly.
- Remove inactive suppliers and partners.
- Require business justification before adding new domains.
- Maintain an approval workflow for federation requests.
- Export and document the configuration regularly.

---

# Troubleshooting

## No Results Returned from Audit Log

Verify that:

- Unified Audit Logging is enabled.
- Teams communications exist during the selected timeframe.
- The account has proper permissions.

## Domain Not Appearing After Configuration

Verify the current configuration:

```powershell
(Get-CsTenantFederationConfiguration).AllowedDomains.AllowedDomain
```

## Federation Still Works with Unapproved Domains

Verify that:

```powershell
Get-CsTenantFederationConfiguration |
Select AllowFederatedUsers
```

returns:

```text
True
```

and that only approved domains exist in the allow list.

---

# Conclusion

Restricting Microsoft Teams federation using an approved domain allow list provides a simple and effective way to improve security and governance while maintaining collaboration with trusted partners. Using audit log data to identify active external organizations helps build an accurate baseline, while Teams PowerShell makes it easy to manage and maintain federation settings over time.

## Files

### CSV Example

```text
C:\Temp\TeamsAllowedDomains.csv
```

### Exported Configuration

```text
C:\Temp\TeamsFederationDomains.csv
```

## Script Location

```text
Microsoft 365/Teams/
```

## Related Technologies

- Microsoft Teams
- Microsoft 365
- Exchange Online
- Microsoft Teams PowerShell
- Unified Audit Log
- Entra ID
- Security & Compliance

---

**Author:** Armando Martinez  
**Website:** https://armandev.tech  
**GitHub:** https://github.com/Joanez/m365-cloud-architecture-lab